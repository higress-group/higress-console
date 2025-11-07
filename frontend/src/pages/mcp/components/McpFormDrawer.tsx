import { CredentialType } from '@/interfaces/consumer';
import { HistoryButton } from '@/pages/ai/components/RouteForm/Components';
import { getConsumers } from '@/services/consumer';
import { getGatewayDomains } from '@/services/domain';
import { getMcpServer } from '@/services/mcp';
import { getGatewayServices } from '@/services/service';
import { RedoOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, Select, Space, Switch } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { getServiceTypeMap, SERVICE_TYPE, SERVICE_TYPES, DB_TYPE_OPTIONS } from '../constant';

interface McpFormDrawerProps {
  visible: boolean;
  mode: 'create' | 'edit';
  name: string;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const McpFormDrawer: React.FC<McpFormDrawerProps> = ({ visible, mode, name, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [domainList, setDomainList] = useState<string[]>([]);
  const [domainLoading, setDomainLoading] = useState(false);
  const [backendServiceList, setBackendServiceList] = useState<any[]>([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [originalBackendServiceList, setOriginalBackendServiceList] = useState<any[]>([]);
  const consumerAuth = useWatch('consumerAuth', form);
  const selectedService = useWatch('service', form);
  const serviceType = useWatch('type', form);
  const mcpServerName = useWatch('name', form);
  const [record, setRecord] = useState<any>(null);
  const [allDomainList, setAllDomainList] = useState<string[]>([]);
  const [allBackendServiceList, setAllBackendServiceList] = useState<any[]>([]);
  const [consumerList, setConsumerList] = useState<any[]>([]);

  useEffect(() => {
    if (visible && mode === 'edit') {
      getMcpServer(name).then((res) => {
        setRecord(res);
      });
    }
  }, [visible]);

  // 计算 dbUrl 和 dbPort
  useEffect(() => {
    if (!selectedService) return;
    const serviceName = selectedService.split(':')[0];
    const service = originalBackendServiceList.find((item) => item.name === serviceName);
    if (service) {
      form.setFieldsValue({
        db_server_host: service.endpoints?.[0] || '-',
        db_server_port: service.port || '-',
      });
    }
  }, [originalBackendServiceList, selectedService]);

  // 监听 record 变化，重置表单
  useEffect(() => {
    if (visible) {
      if (mode === 'create') {
        form.resetFields();
      } else {
        const formValues: any = {
          ...record,
          service: record?.services?.[0]?.name,
          consumerAuth: record?.consumerAuthInfo?.enable || false,
          domains: record?.domains?.[0],
          allowedConsumers: record?.consumerAuthInfo?.allowedConsumers || [],
        };

        // DB 类型数据回填
        if (record?.type === SERVICE_TYPE.DB && record.dbConfig) {
          formValues.db_type = record.dbConfig.type;
          formValues.db_user_name = record.dbConfig.username;
          formValues.db_password = record.dbConfig.password;
          formValues.db_database = record.dbConfig.database;

          // 将 otherParams 对象转换为字符串格式
          if (record.dbConfig.otherParams && typeof record.dbConfig.otherParams === 'object') {
            const otherParamsStr = Object.entries(record.dbConfig.otherParams)
              .map(([key, value]) => `${key}=${value}`)
              .join('&');
            formValues.db_other_params = otherParamsStr;
          } else {
            formValues.db_other_params = record.dbConfig.otherParams || '';
          }
        }

        // 直接路由类型数据回填
        if (record?.type === SERVICE_TYPE.DIRECT_ROUTE && record.directRouteConfig) {
          formValues.directRoute_service = record?.services?.[0]?.name;
          formValues.directRoute_transportType = record.directRouteConfig.transportType;
          formValues.directRoute_path = record.directRouteConfig.path;
        }

        form.setFieldsValue(formValues);
      }
    }
  }, [visible, mode, record, form]);

  // 获取域名列表（全量）
  const getDomainList = async () => {
    setDomainLoading(true);
    try {
      const res = await getGatewayDomains();
      const domains = res.map((item: any) => item.name);
      setAllDomainList(domains);
      setDomainList(domains);
    } finally {
      setDomainLoading(false);
    }
  };

  // 获取后端服务列表（全量）
  const getBackendServiceList = async () => {
    setServiceLoading(true);
    try {
      const res = await getGatewayServices();
      setAllBackendServiceList(res);
      setOriginalBackendServiceList(res);
      setBackendServiceList(
        res.map((item: any) => ({
          value: `${item.name}:${item.port}`,
          label: item.name,
        })),
      );
    } finally {
      setServiceLoading(false);
    }
  };

  // 本地模糊过滤域名
  const handleDomainSearch = (value: string) => {
    if (!value) {
      setDomainList(allDomainList);
    } else {
      setDomainList(allDomainList.filter((domain) => domain.includes(value)));
    }
  };

  // 本地模糊过滤服务
  const handleServiceSearch = (value: string) => {
    if (!value) {
      setBackendServiceList(
        allBackendServiceList.map((item: any) => ({
          value: `${item.name}:${item.port}`,
          label: item.name,
        })),
      );
    } else {
      setBackendServiceList(
        allBackendServiceList
          .filter((item: any) => item.name.includes(value))
          .map((item: any) => ({
            value: `${item.name}:${item.port}`,
            label: item.name,
          })),
      );
    }
  };

  useEffect(() => {
    if (visible) {
      getDomainList();
      getBackendServiceList();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      getConsumers().then((res) => setConsumerList(res || []));
    }
  }, [visible]);

  // 表单提交
  const handleFinish = (values: any) => {
    let serviceName: string;
    let service: any;

    // 根据服务类型确定使用哪个服务字段
    if (values.type === SERVICE_TYPE.DIRECT_ROUTE) {
      serviceName = values.directRoute_service?.split(':')[0];
    } else {
      serviceName = values.service?.split(':')[0];
    }

    service = originalBackendServiceList.find((item) => item.name === serviceName);
    if (!service) {
      return;
    }

    const submitData: any = {
      ...record,
      name: values.name,
      description: values.description,
      type: values.type,
      services: [
        {
          name: service.name,
          port: service.port,
          version: '1.0',
          weight: 100,
        },
      ],
      consumerAuthInfo: {
        enable: values.consumerAuth,
        type: CredentialType.KEY_AUTH.key,
        strategyConfigId: values.consumerAuthInfo?.strategyConfigId,
        allowedConsumers: values.allowedConsumers || [],
      },
      domains: (() => {
        if (Array.isArray(values.domains)) {
          return values.domains;
        } else if (values.domains) {
          return [values.domains];
        } else {
          return [];
        }
      })(),
    };

    // DB 类型特殊处理 - 提交配置对象,不拼接 DSN
    if (values.type === SERVICE_TYPE.DB) {
      const { db_type, db_user_name, db_password, db_database, db_other_params, db_server_host, db_server_port } = values;

      // 将 otherParams 字符串转换为键值对对象
      let otherParamsObj = {};
      if (db_other_params && typeof db_other_params === 'string') {
        // 按照 key1=value1&key2=value2 的格式解析
        db_other_params.split('&').forEach(param => {
          const [key, value] = param.split('=');
          if (key && value !== undefined) {
            otherParamsObj[key] = value;
          }
        });
      } else if (typeof db_other_params === 'object' && db_other_params !== null) {
        // 如果已经是对象格式，直接使用
        otherParamsObj = db_other_params;
      }

      submitData.dbConfig = {
        type: db_type,
        host: db_server_host,
        port: db_server_port,
        username: db_user_name,
        dbname: db_database,
        password: db_password,
        database: db_database,
        otherParams: otherParamsObj,
      };
      submitData.dbType = db_type;
    }

    // 直接路由类型特殊处理
    if (values.type === SERVICE_TYPE.DIRECT_ROUTE) {
      submitData.directRouteConfig = {
        path: values.directRoute_path,
        transportType: values.directRoute_transportType,
      };
    }

    onSubmit(submitData);
  };

  const serviceTypeMap = getServiceTypeMap(t('mcp.form.directRouteText'));

  return (
    <Drawer
      title={mode === 'create' ? t('mcp.form.create') : t('mcp.form.edit')}
      width={600}
      open={visible}
      onClose={onClose}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose}>{t('mcp.form.cancel')}</Button>
          <Button type="primary" onClick={() => form.submit()}>
            {t('mcp.form.ok') || '确定'}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label={t('mcp.form.name')}
          name="name"
          rules={[
            { required: true, message: t('mcp.form.nameRequired')! },
            {
              pattern: /^(?![-.])[A-Za-z0-9.-]{1,63}[A-Za-z0-9]$/,
              message: t('mcp.form.namePattern')!,
            },
          ]}
        >
          <Input disabled={mode === 'edit'} placeholder={t('mcp.form.nameRequired')!} />
        </Form.Item>

        <Form.Item
          label={t('mcp.form.description')}
          name="description"
          rules={[{ required: true, message: t('mcp.form.descriptionRequired')! }]}
        >
          <Input.TextArea placeholder={t('mcp.form.descriptionRequired')!} rows={3} maxLength={255} />
        </Form.Item>

        <Form.Item
          label={t('mcp.form.domains')}
          name="domains"
        >
          <Select
            showSearch
            loading={domainLoading}
            options={domainList.filter((domain) => domain !== 'higress-default-domain').map((domain) => ({ label: domain, value: domain }))}
            onSearch={handleDomainSearch}
            filterOption={false}
            placeholder={t('mcp.form.domainsRequired')!}
            style={{ width: '100%' }}
            allowClear
          />
        </Form.Item>
        <div
          style={{
            marginTop: -8,
            color: '#bfbfbf',
            background: '#f5f5f5',
            borderRadius: 6,
            padding: '8px 12px',
            fontSize: 14,
            lineHeight: '22px',
          }}
        >
          <Trans t={t} i18nKey="mcp.form.ssePathRule" values={{ currentMcpServerName: name || mcpServerName || t('mcp.form.nameDefault') }}>
            {/* SSE 路径规则：/mcp/{currentMcpServerName}/sse */}
          </Trans>
        </div>
        <div
          style={{
            marginTop: 8,
            marginBottom: 10,
            color: '#bfbfbf',
            background: '#f5f5f5',
            borderRadius: 6,
            padding: '8px 12px',
            fontSize: 14,
            lineHeight: '22px',
          }}
        >
          <Trans t={t} i18nKey="mcp.form.httpPathRule" values={{ currentMcpServerName: name || mcpServerName || t('mcp.form.nameDefault') }}>
            {/* HTTP 路径规则：/mcp/{currentMcpServerName} */}
          </Trans>
        </div>

        <Form.Item
          label={t('mcp.form.type')}
          name="type"
          rules={[{ required: true, message: t('mcp.form.typeRequired')! }]}
        >
          <Select
            options={SERVICE_TYPES.map((v) => ({
              label: t(`${serviceTypeMap[v]}`),
              value: v,
            }))}
            disabled={mode === 'edit'}
            placeholder={t('mcp.form.typeRequired')!}
          />
        </Form.Item>

        {serviceType !== SERVICE_TYPE.DIRECT_ROUTE && (
          <Form.Item
            label={t('mcp.form.upstreamService')}
            name="service"
            rules={[{ required: true, message: t('mcp.form.upstreamServiceRequired')! }]}
          >
            <Select
              showSearch
              loading={serviceLoading}
              options={backendServiceList}
              onSearch={handleServiceSearch}
              filterOption={false}
              placeholder={t('mcp.form.upstreamServiceRequired')!}
            />
          </Form.Item>
        )}

        {serviceType === SERVICE_TYPE.DB && (
          <div
            style={{
              background: '#f5f7fa',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ marginBottom: 8, fontWeight: 500 }}>{t('mcp.form.databaseConfig')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ minWidth: 0 }}>
                <Form.Item
                  label={t('mcp.form.dbType') || '数据库类型'}
                  name="db_type"
                  rules={[{ required: true, message: t('mcp.form.dbTypeRequired') || '请选择数据库类型' }]}
                >
                  <Select
                    options={DB_TYPE_OPTIONS}
                    placeholder={t('mcp.form.dbTypeRequired') || '请选择数据库类型'}
                  />
                </Form.Item>
              </div>
              <div style={{ minWidth: 0 }}>
                <Form.Item
                  label={t('mcp.form.dbHost') || '主机地址'}
                  name="db_server_host"
                >
                  <Input disabled placeholder={t('mcp.form.dbHostPlaceholder') || '请先选择后端服务'} />
                </Form.Item>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ minWidth: 0 }}>
                <Form.Item
                  label={t('mcp.form.dbPort') || '端口'}
                  name="db_server_port"
                >
                  <Input disabled placeholder={t('mcp.form.dbHostPlaceholder') || '请先选择后端服务'} />
                </Form.Item>
              </div>
              <div style={{ minWidth: 0 }}>
                <Form.Item
                  label={t('mcp.form.dbUsername') || '用户名'}
                  name="db_user_name"
                  rules={[{ required: true, message: t('mcp.form.dbUsernameRequired') || '请输入用户名' }]}
                >
                  <Input placeholder={t('mcp.form.dbUsernameRequired') || '请输入用户名'} />
                </Form.Item>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ minWidth: 0 }}>
                <Form.Item
                  label={t('mcp.form.dbPassword') || '密码'}
                  name="db_password"
                  rules={[{ required: true, message: t('mcp.form.dbPasswordRequired') || '请输入密码' }]}
                >
                  <Input.Password placeholder={t('mcp.form.dbPasswordRequired') || '请输入密码'} />
                </Form.Item>
              </div>
              <div style={{ minWidth: 0 }}>
                <Form.Item
                  label={t('mcp.form.dbDatabase') || '数据库名'}
                  name="db_database"
                  rules={[{ required: true, message: t('mcp.form.dbDatabaseRequired') || '请输入数据库名' }]}
                >
                  <Input placeholder={t('mcp.form.dbDatabaseRequired') || '请输入数据库名'} />
                </Form.Item>
              </div>
            </div>
            <div>
              <Form.Item
                label={t('mcp.form.dbOtherParams') || '其他参数'}
                name="db_other_params"
              >
                <Input placeholder={t('mcp.form.dbOtherParamsPlaceholder') || '格式：key1=value1&key2=value2'} />
              </Form.Item>
            </div>
          </div>
        )}

        {serviceType === SERVICE_TYPE.DIRECT_ROUTE && (
          <div
            style={{
              background: '#f5f7fa',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ marginBottom: 8, fontWeight: 500 }}>{t('mcp.form.upstreamService')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ minWidth: 0 }}>
                <Form.Item
                  label={t('mcp.form.serviceName') || '服务名称'}
                  name="directRoute_service"
                  rules={[{ required: true, message: t('mcp.form.upstreamServiceRequired')! }]}
                >
                  <Select
                    showSearch
                    loading={serviceLoading}
                    options={backendServiceList}
                    onSearch={handleServiceSearch}
                    filterOption={false}
                    placeholder={t('mcp.form.upstreamServiceRequired')!}
                  />
                </Form.Item>
              </div>
              <div style={{ minWidth: 0 }}>
                <Form.Item
                  label={t('mcp.form.serviceProtocol') || '服务协议'}
                  name="serviceProtocol"
                  initialValue="MCP"
                >
                  <Input disabled placeholder="MCP" />
                </Form.Item>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ minWidth: 0 }}>
                <Form.Item
                  label="MCP Transport"
                  name="directRoute_transportType"
                  rules={[{ required: true, message: t('mcp.form.transportTypeRequired') || '请选择传输类型' }]}
                >
                  <Select
                    placeholder={t('mcp.form.transportTypeRequired') || '请选择传输类型'}
                    options={[
                      { label: 'SSE', value: 'sse' },
                      { label: 'HTTP', value: 'http' },
                    ]}
                  />
                </Form.Item>
              </div>
              <div style={{ minWidth: 0 }}>
                <Form.Item
                  label={t('mcp.form.path') || '路径'}
                  name="directRoute_path"
                  rules={[
                    { required: true, message: t('mcp.form.pathRequired') || '请输入路径' },
                    {
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.reject(new Error(t('mcp.form.pathRequired') || '请输入路径'));
                        }
                        if (!value.startsWith('/')) {
                          return Promise.reject(new Error(t('mcp.form.pathMustStartWithSlash') || '路径必须以 / 开头'));
                        }
                        const transportType = form.getFieldValue('directRoute_transportType');
                        if (transportType === 'sse' && !value.endsWith('/sse')) {
                          return Promise.reject(new Error(t('mcp.form.ssePathMustEndWithSse') || 'SSE 传输路径必须以 /sse 结尾'));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder={t('mcp.form.pathPlaceholder') || '请输入路径，如：/test'} />
                </Form.Item>
              </div>
            </div>
            {form.getFieldValue('directRoute_transportType') === 'sse' && (
              <div style={{ color: '#999', fontSize: 12, marginTop: -8 }}>
                {t('mcp.form.ssePathTip') || 'SSE 传输路径必须以 /sse 结尾'}
              </div>
            )}
          </div>
        )}

        <Form.Item
          label={t('mcp.form.consumerAuth')}
          name="consumerAuth"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label={t('misc.authType')}
          name="authType"
          initialValue={CredentialType.KEY_AUTH.key}
          extra={t('misc.keyAuthOnlyTip')}
        >
          <Select disabled>
            {
              Object.values(CredentialType).filter(ct => !!ct.enabled).map(ct => (
                <Select.Option key={ct.key} value={ct.key}>{ct.displayName}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          label={t('mcp.form.allowedConsumers')}
          extra={(<HistoryButton text={t('consumer.create')} path={"/consumer"} />)}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Item
              name="allowedConsumers"
              noStyle
            >
              <Select
                mode="multiple"
                allowClear
                placeholder={t('mcp.form.allowedConsumersPlaceholder')}
                style={{ flex: 1 }}
              >
                {consumerList.map((item) => (
                  <Select.Option key={item.name} value={item.name}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => getConsumers().then((res) => setConsumerList(res || []))}
              icon={<RedoOutlined />}
            />
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default McpFormDrawer;
