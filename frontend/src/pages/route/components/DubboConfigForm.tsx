import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, Table, Space, Switch, message, Card, Divider, Typography, Tag, Tooltip } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SettingOutlined,
  ApiOutlined,
  DatabaseOutlined,
  LinkOutlined,
  InfoCircleOutlined,
  BookOutlined,
  ThunderboltOutlined,
  CodeOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { DubboConfig, DubboMethodConfig, DubboParamItem, ServiceSource } from '@/interfaces/route';
import { getServiceSources } from '@/services/route';
import { useTranslation } from 'react-i18next';
import styles from './DubboConfigForm.module.css';

const { Option } = Select;
const { Text, Title } = Typography;

interface DubboConfigFormProps {
  value?: DubboConfig;
  onChange?: (value: DubboConfig) => void;
}

const DubboConfigForm: React.FC<DubboConfigFormProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [serviceSources, setServiceSources] = useState<ServiceSource[]>([]);
  const [selectedServiceSource, setSelectedServiceSource] = useState<string>('');
  const [methods, setMethods] = useState<DubboMethodConfig[]>([]);

  const { data: serviceSourcesData = [] } = useRequest(getServiceSources, {
    onSuccess: (result) => {
      setServiceSources(result);
    },
  });

  useEffect(() => {
    if (value) {
      form.setFieldsValue(value);
      setSelectedServiceSource(value.serviceSource);
      const normalized = (value.methods || []).map((m) => {
        if (m.paramType === 'params') {
          const hasNew = Array.isArray(m.params) && m.params.length > 0;
          if (!hasNew && (m.paramKey || m.paramSource || m.paramTypeValue)) {
            const param: DubboParamItem = {
              paramKey: m.paramKey || 'p',
              paramSource: m.paramSource || 'QUERY',
              paramType: m.paramTypeValue || 'java.lang.String',
            };
            return { ...m, params: [param] };
          }
          return m;
        } else {
          // paramFromEntireBody
          if (!m.bodyParamType && m.paramTypeValue) {
            return { ...m, bodyParamType: m.paramTypeValue };
          }
          return m;
        }
      });
      setMethods(normalized);
    }
  }, [value, form]);

  const handleServiceSourceChange = (selectedValue: string) => {
    setSelectedServiceSource(selectedValue);
    const source = serviceSources.find(s => s.name === selectedValue);
    if (source && source.properties?.nacosGroups && source.properties.nacosGroups.length > 0) {
      form.setFieldsValue({
        serviceGroup: source.properties.nacosGroups[0] || 'DEFAULT_GROUP',
      });
    }
  };

  const addMethod = () => {
    const newMethod: DubboMethodConfig = {
      httpMethod: 'GET',
      serviceMethod: '',
      httpPath: '',
      paramType: 'params',
      params: [
        { paramKey: 'p', paramSource: 'QUERY', paramType: 'java.lang.String' },
      ],
      bodyParamType: 'java.lang.String',
      headersAttach: '*',
    };
    const newMethods = [...methods, newMethod];
    setMethods(newMethods);
    updateValue({ methods: newMethods });
  };

  const removeMethod = (index: number) => {
    const newMethods = methods.filter((_, i) => i !== index);
    setMethods(newMethods);
    updateValue({ methods: newMethods });
  };

  const updateMethod = (index: number, field: keyof DubboMethodConfig, fieldValue: any) => {
    const newMethods = [...methods];
    if (field === 'paramType') {
      const next: DubboMethodConfig = { ...newMethods[index], [field]: fieldValue };
      if (fieldValue === 'params') {
        if (!next.params || next.params.length === 0) {
          next.params = [{ paramKey: 'p', paramSource: 'QUERY', paramType: 'java.lang.String' }];
        }
      } else {
        // paramFromEntireBody
        next.bodyParamType = next.bodyParamType || 'java.lang.String';
      }
      newMethods[index] = next;
    } else {
      newMethods[index] = { ...newMethods[index], [field]: fieldValue };
    }
    setMethods(newMethods);
    updateValue({ methods: newMethods });
  };

  const addParam = (methodIndex: number) => {
    const newMethods = [...methods];
    const currentParams = newMethods[methodIndex].params || [];
    const nextParam: DubboParamItem = { paramKey: 'p', paramSource: 'QUERY', paramType: 'java.lang.String' };
    newMethods[methodIndex] = { ...newMethods[methodIndex], params: [...currentParams, nextParam] };
    setMethods(newMethods);
    updateValue({ methods: newMethods });
  };

  const removeParam = (methodIndex: number, paramIndex: number) => {
    const newMethods = [...methods];
    const currentParams = newMethods[methodIndex].params || [];
    newMethods[methodIndex] = { ...newMethods[methodIndex], params: currentParams.filter((_, i) => i !== paramIndex) };
    setMethods(newMethods);
    updateValue({ methods: newMethods });
  };

  const updateParam = (methodIndex: number, paramIndex: number, key: keyof DubboParamItem, paramValue: string) => {
    const newMethods = [...methods];
    const currentParams = newMethods[methodIndex].params || [];
    const newParams = [...currentParams];
    newParams[paramIndex] = { ...newParams[paramIndex], [key]: paramValue } as const;
    newMethods[methodIndex] = { ...newMethods[methodIndex], params: newParams };
    setMethods(newMethods);
    updateValue({ methods: newMethods });
  };

  const updateValue = (partialValue: Partial<DubboConfig>) => {
    const currentValue = form.getFieldsValue();
    const newValue = { ...currentValue, ...partialValue };
    onChange?.(newValue);
  };

  // 展开行渲染：将参数列表竖向显示在方法行下方
  const renderMethodParams = (record: DubboMethodConfig) => {
    const methodIndex = methods.indexOf(record);
    if (methodIndex < 0) return null;
    if (record.paramType === 'params') {
      const items = record.params || [];
      return (
        <div className={styles.paramConfigArea}>
          {items.map((p, pi) => (
            <div key={`param-${methodIndex}-${pi}`} className={styles.paramItem}>
              <Input
                value={p.paramKey}
                placeholder="paramKey"
                style={{ width: 180 }}
                size="small"
                onChange={(e) => updateParam(methodIndex, pi, 'paramKey', e.target.value)}
              />
              <Select
                value={p.paramSource}
                style={{ width: 120 }}
                size="small"
                onChange={(val) => updateParam(methodIndex, pi, 'paramSource', val)}
              >
                <Option value="QUERY">
                  <div style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
                    <Tag color="blue" style={{ margin: 0 }}>QUERY</Tag>
                  </div>
                </Option>
                <Option value="HEADER">
                  <div style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
                    <Tag color="green" style={{ margin: 0 }}>HEADER</Tag>
                  </div>
                </Option>
                <Option value="BODY">
                  <div style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
                    <Tag color="orange" style={{ margin: 0 }}>BODY</Tag>
                  </div>
                </Option>
              </Select>
              <Input
                value={p.paramType}
                placeholder="java.lang.String"
                style={{ flex: 1 }}
                size="small"
                onChange={(e) => updateParam(methodIndex, pi, 'paramType', e.target.value)}
              />
              <Button
                size="small"
                danger
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => removeParam(methodIndex, pi)}
                className={styles.deleteBtn}
              />
            </div>
          ))}
          <Button
            size="small"
            type="dashed"
            onClick={() => addParam(methodIndex)}
            icon={<PlusOutlined />}
            className={styles.addParamBtn}
          >
            {t('misc.add')}
          </Button>
        </div>
      );
    }
    // 整体Body参数
    return (
      <Input
        value={record.bodyParamType}
        onChange={(e) => updateMethod(methodIndex, 'bodyParamType', e.target.value)}
        placeholder="java.lang.String"
        size="small"
        prefix={<CodeOutlined className={styles.inputPrefixSmall} />}
      />
    );
  };

  const methodColumns = [
    {
      title: (
        <div className={styles.formItemLabel}>
          <ThunderboltOutlined className={styles.formItemLabelIcon} style={{ color: '#52c41a' }} />
          <span>{t('dubbo.httpMethod')}</span>
        </div>
      ),
      dataIndex: 'httpMethod',
      width: 120,
      render: (cellValue: string, record: DubboMethodConfig, index: number) => (
        <Select
          value={cellValue}
          onChange={(val) => updateMethod(index, 'httpMethod', val)}
          style={{ width: '100%' }}
          size="small"
        >
          <Option value="GET">
            <div style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
              <Tag color="green" style={{ margin: 0 }}>GET</Tag>
            </div>
          </Option>
          <Option value="POST">
            <div style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
              <Tag color="blue" style={{ margin: 0 }}>POST</Tag>
            </div>
          </Option>
        </Select>
      ),
    },
    {
      title: (
        <div className={styles.formItemLabel}>
          <CodeOutlined className={styles.formItemLabelIcon} style={{ color: '#fa8c16' }} />
          <span>{t('dubbo.serviceMethod')}</span>
        </div>
      ),
      dataIndex: 'serviceMethod',
      width: 180,
      render: (cellValue: string, record: DubboMethodConfig, index: number) => (
        <Input
          value={cellValue}
          onChange={(e) => updateMethod(index, 'serviceMethod', e.target.value)}
          placeholder={t('dubbo.serviceMethodPlaceholder') || ''}
          size="small"
          prefix={<SettingOutlined className={styles.inputPrefixSmall} />}
        />
      ),
    },
    {
      title: (
        <div className={styles.formItemLabel}>
          <LinkOutlined className={styles.formItemLabelIcon} style={{ color: '#1890ff' }} />
          <span>{t('dubbo.httpPath')}</span>
        </div>
      ),
      dataIndex: 'httpPath',
      width: 180,
      render: (cellValue: string, record: DubboMethodConfig, index: number) => (
        <Input
          value={cellValue}
          onChange={(e) => updateMethod(index, 'httpPath', e.target.value)}
          placeholder={t('dubbo.httpPathPlaceholder') || ''}
          size="small"
          prefix={<ApiOutlined className={styles.inputPrefixSmall} />}
        />
      ),
    },
    {
      title: (
        <div className={styles.formItemLabel}>
          <DatabaseOutlined className={styles.formItemLabelIcon} style={{ color: '#722ed1' }} />
          <span>{t('dubbo.paramType')}</span>
        </div>
      ),
      dataIndex: 'paramType',
      width: 140,
      render: (cellValue: string, record: DubboMethodConfig, index: number) => (
        <Select
          value={cellValue}
          onChange={(val) => updateMethod(index, 'paramType', val)}
          style={{ width: '100%' }}
          size="small"
        >
          <Option value="params">
            <div style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
              <Tag color="orange" style={{ margin: 0 }}>params</Tag>
            </div>
          </Option>
          <Option value="paramFromEntireBody">
            <div style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
              <Tag color="purple" style={{ margin: 0 }}>paramFromEntireBody</Tag>
            </div>
          </Option>
        </Select>
      ),
    },
    {
      title: (
        <div className={styles.formItemLabel}>
          <DeleteOutlined className={styles.formItemLabelIcon} style={{ color: '#ff4d4f' }} />
          <span>{t('misc.action')}</span>
        </div>
      ),
      width: 60,
      render: (cellValue: any, record: DubboMethodConfig, index: number) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeMethod(index)}
          size="small"
          className={styles.deleteBtn}
        />
      ),
    },
  ];

  return (
    <div className={styles.dubboConfigForm}>
      {/* 文档提示卡片 */}
      <Card
        size="small"
        className={styles.docCard}
        bodyStyle={{ padding: '12px 16px' }}
      >
        <div className={styles.docCardTitle}>
          <div className={styles.docCardTitleLeft}>
            <BookOutlined className={styles.docCardIcon} />
            <Text strong className={styles.docCardText}>
              HTTP 转 Dubbo 配置说明
            </Text>
          </div>
          <Button
            type="link"
            size="small"
            icon={<LinkOutlined />}
            href="https://higress.cn/docs/latest/user/dubbo-http2rpc/?spm=36971b57.c5bbb55.0.0.4cf3597cLtmHPn"
            target="_blank"
            className={styles.docCardLink}
          >
            查看文档
          </Button>
        </div>
        <Text type="secondary" className={styles.docCardDesc}>
          点击查看Higress官方文档了解详细配置参数
        </Text>
      </Card>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={(changedValues) => updateValue(changedValues)}
      >
        {/* 服务配置卡片 */}
        <Card
          title={
            <div className={styles.cardTitle}>
              <DatabaseOutlined className={styles.cardTitleIcon} style={{ color: '#1890ff' }} />
              <span>服务配置</span>
            </div>
          }
          size="small"
          className={styles.serviceCard}
          headStyle={{
            background: '#fafafa',
            borderBottom: '1px solid #f0f0f0',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <Form.Item
            label={
              <div className={styles.formItemLabel}>
                <ApiOutlined className={styles.formItemLabelIcon} style={{ color: '#52c41a' }} />
                <span>{t('dubbo.serviceSource')}</span>
                <Tooltip title="选择Dubbo服务的数据源">
                  <InfoCircleOutlined className={styles.formItemLabelTooltip} />
                </Tooltip>
              </div>
            }
            name="serviceSource"
            rules={[{ required: true, message: t('dubbo.serviceSourceRequired') || '' }]}
          >
            <Select
              placeholder={t('dubbo.serviceSourcePlaceholder') || ''}
              onChange={handleServiceSourceChange}
              suffixIcon={<GlobalOutlined className={styles.selectSuffix} />}
            >
              {serviceSources.map((source) => (
                <Option key={source.name} value={source.name}>
                  <div style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
                    <Tag color="blue" style={{ marginRight: '8px', margin: 0 }}>
                      {source.name}
                    </Tag>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <div className={styles.formItemLabel}>
                <CodeOutlined className={styles.formItemLabelIcon} style={{ color: '#fa8c16' }} />
                <span>{t('dubbo.serviceInterface')}</span>
                <Tooltip title="Dubbo服务的接口名称">
                  <InfoCircleOutlined className={styles.formItemLabelTooltip} />
                </Tooltip>
              </div>
            }
            name="serviceInterface"
            rules={[{ required: true, message: t('dubbo.serviceInterfaceRequired') || '' }]}
          >
            <Input
              placeholder={t('dubbo.serviceInterfacePlaceholder') || ''}
              prefix={<SettingOutlined className={styles.inputPrefix} />}
            />
          </Form.Item>

          <Form.Item
            label={
              <div className={styles.formItemLabel}>
                <ThunderboltOutlined className={styles.formItemLabelIcon} style={{ color: '#722ed1' }} />
                <span>{t('dubbo.serviceGroup')}</span>
                <Tooltip title="Dubbo服务的分组名称">
                  <InfoCircleOutlined className={styles.formItemLabelTooltip} />
                </Tooltip>
              </div>
            }
            name="serviceGroup"
            rules={[{ required: true, message: t('dubbo.serviceGroupRequired') || '' }]}
          >
            <Select placeholder={t('dubbo.serviceGroupPlaceholder') || ''}>
              {/* 默认分组选项 */}
              <Option key="DEFAULT_GROUP" value="DEFAULT_GROUP">
                <Tag color="default">DEFAULT_GROUP</Tag>
              </Option>
              {/* 从服务来源获取的分组选项 */}
              {selectedServiceSource && serviceSources.find(s => s.name === selectedServiceSource)?.properties?.nacosGroups?.map((group) => (
                <Option key={group} value={group}>
                  <Tag color="green">{group}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Card>

        {/* 方法配置卡片 */}
        <Card
          title={
            <div className={styles.methodCardTitle}>
              <div className={styles.methodCardTitleLeft}>
                <ApiOutlined className={styles.methodCardIcon} />
                <span>方法配置</span>
                <Tag color="blue" className={styles.methodCount}>
                  {methods.length} 个方法
                </Tag>
              </div>
              <Button
                type="primary"
                size="small"
                onClick={addMethod}
                icon={<PlusOutlined />}
                className={styles.addMethodBtn}
              >
                {t('dubbo.addMethod')}
              </Button>
            </div>
          }
          size="small"
          className={styles.methodCard}
          headStyle={{
            background: '#fafafa',
            borderBottom: '1px solid #f0f0f0',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {methods.length === 0 ? (
            <div className={styles.emptyState}>
              <ApiOutlined className={styles.emptyStateIcon} />
              <Text type="secondary">暂无方法配置</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>点击上方按钮添加HTTP到Dubbo的方法映射</Text>
            </div>
          ) : (
            <Table
              dataSource={methods}
              columns={methodColumns}
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{ padding: '8px 12px' }}>
                    <div className={styles.formItemLabel} style={{ marginBottom: 8 }}>
                      <SettingOutlined className={styles.formItemLabelIcon} style={{ color: '#13c2c2' }} />
                      <span>{t('dubbo.params')}</span>
                    </div>
                    {renderMethodParams(record)}
                  </div>
                ),
                rowExpandable: () => true,
              }}
              pagination={false}
              size="small"
              rowKey={(record, index) => (index ?? 0).toString()}
              className={styles.dubboMethodsTable}
            />
          )}
        </Card>
      </Form>
    </div>
  );
};

export default DubboConfigForm;
