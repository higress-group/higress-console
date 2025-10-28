import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, Table, Space, Switch, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { DubboConfig, DubboMethodConfig, ServiceSource } from '@/interfaces/route';
import { getServiceSources } from '@/services/route';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

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
      setMethods(value.methods || []);
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
      paramKey: 'p',
      paramSource: 'QUERY',
      paramTypeValue: 'java.lang.String',
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
    newMethods[index] = { ...newMethods[index], [field]: fieldValue };
    setMethods(newMethods);
    updateValue({ methods: newMethods });
  };

  const updateValue = (partialValue: Partial<DubboConfig>) => {
    const currentValue = form.getFieldsValue();
    const newValue = { ...currentValue, ...partialValue };
    onChange?.(newValue);
  };

  const methodColumns = [
    {
      title: t('dubbo.httpMethod'),
      dataIndex: 'httpMethod',
      width: 100,
      render: (cellValue: string, record: DubboMethodConfig, index: number) => (
        <Select
          value={cellValue}
          onChange={(val) => updateMethod(index, 'httpMethod', val)}
          style={{ width: '100%' }}
        >
          <Option value="GET">GET</Option>
          <Option value="POST">POST</Option>
        </Select>
      ),
    },
    {
      title: t('dubbo.serviceMethod'),
      dataIndex: 'serviceMethod',
      width: 150,
      render: (cellValue: string, record: DubboMethodConfig, index: number) => (
        <Input
          value={cellValue}
          onChange={(e) => updateMethod(index, 'serviceMethod', e.target.value)}
          placeholder={t('dubbo.serviceMethodPlaceholder') || ''}
        />
      ),
    },
    {
      title: t('dubbo.httpPath'),
      dataIndex: 'httpPath',
      width: 150,
      render: (cellValue: string, record: DubboMethodConfig, index: number) => (
        <Input
          value={cellValue}
          onChange={(e) => updateMethod(index, 'httpPath', e.target.value)}
          placeholder={t('dubbo.httpPathPlaceholder') || ''}
        />
      ),
    },
    {
      title: t('dubbo.paramType'),
      dataIndex: 'paramType',
      width: 120,
      render: (cellValue: string, record: DubboMethodConfig, index: number) => (
        <Select
          value={cellValue}
          onChange={(val) => updateMethod(index, 'paramType', val)}
          style={{ width: '100%' }}
        >
          <Option value="params">params</Option>
          <Option value="paramFromEntireBody">paramFromEntireBody</Option>
        </Select>
      ),
    },
    {
      title: t('dubbo.paramKey'),
      dataIndex: 'paramKey',
      width: 80,
      render: (cellValue: string, record: DubboMethodConfig, index: number) => (
        record.paramType === 'params' ? (
          <Input
            value={cellValue}
            onChange={(e) => updateMethod(index, 'paramKey', e.target.value)}
            placeholder="p"
          />
        ) : null
      ),
    },
    {
      title: t('dubbo.paramSource'),
      dataIndex: 'paramSource',
      width: 100,
      render: (cellValue: string, record: DubboMethodConfig, index: number) => (
        record.paramType === 'params' ? (
          <Select
            value={cellValue}
            onChange={(val) => updateMethod(index, 'paramSource', val)}
            style={{ width: '100%' }}
          >
            <Option value="QUERY">QUERY</Option>
            <Option value="HEADER">HEADER</Option>
            <Option value="BODY">BODY</Option>
          </Select>
        ) : null
      ),
    },
    {
      title: t('dubbo.paramTypeValue'),
      dataIndex: 'paramTypeValue',
      width: 120,
      render: (cellValue: string, record: DubboMethodConfig, index: number) => (
        <Input
          value={cellValue}
          onChange={(e) => updateMethod(index, 'paramTypeValue', e.target.value)}
          placeholder="java.lang.String"
        />
      ),
    },
    {
      title: t('misc.action'),
      width: 80,
      render: (cellValue: any, record: DubboMethodConfig, index: number) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeMethod(index)}
        />
      ),
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={(changedValues) => updateValue(changedValues)}
    >
      <div style={{ marginBottom: 16, padding: '12px 16px', backgroundColor: '#f6f8fa', borderRadius: '6px', border: '1px solid #d0d7de' }}>
        <a
          href="https://higress.cn/docs/latest/user/dubbo-http2rpc/?spm=36971b57.c5bbb55.0.0.4cf3597cLtmHPn"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0969da', textDecoration: 'none', fontSize: '14px' }}
        >
          📖 HTTP 转 Dubbo 配置说明
        </a>
        <span style={{ color: '#656d76', fontSize: '12px', marginLeft: '8px' }}>
          点击查看Higress官方文档了解详细配置参数
        </span>
      </div>
      <Form.Item
        label={t('dubbo.serviceSource')}
        name="serviceSource"
        rules={[{ required: true, message: t('dubbo.serviceSourceRequired') || '' }]}
      >
        <Select
          placeholder={t('dubbo.serviceSourcePlaceholder') || ''}
          onChange={handleServiceSourceChange}
        >
          {serviceSources.map((source) => (
            <Option key={source.name} value={source.name}>
              {source.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={t('dubbo.serviceInterface')}
        name="serviceInterface"
        rules={[{ required: true, message: t('dubbo.serviceInterfaceRequired') || '' }]}
      >
        <Input placeholder={t('dubbo.serviceInterfacePlaceholder') || ''} />
      </Form.Item>

      <Form.Item
        label={t('dubbo.serviceGroup')}
        name="serviceGroup"
        rules={[{ required: true, message: t('dubbo.serviceGroupRequired') || '' }]}
      >
        <Select placeholder={t('dubbo.serviceGroupPlaceholder') || ''}>
          {/* 默认分组选项 */}
          <Option key="DEFAULT_GROUP" value="DEFAULT_GROUP">
            DEFAULT_GROUP
          </Option>
          {/* 从服务来源获取的分组选项 */}
          {selectedServiceSource && serviceSources.find(s => s.name === selectedServiceSource)?.properties?.nacosGroups?.map((group) => (
            <Option key={group} value={group}>
              {group}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={t('dubbo.methods')}>
        <Table
          dataSource={methods}
          columns={methodColumns}
          pagination={false}
          size="small"
          rowKey={(record, index) => (index ?? 0).toString()}
        />
        <Button
          type="dashed"
          onClick={addMethod}
          icon={<PlusOutlined />}
          style={{ width: '100%', marginTop: 8 }}
        >
          {t('dubbo.addMethod')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DubboConfigForm;
