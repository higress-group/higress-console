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
import { getServiceTypeMap, REG_DSN_STRING, SERVICE_TYPE, SERVICE_TYPES } from '../constant';
import DatabaseConfig, { computeDSN, DB_FIXED_FIELDS } from './DatabaseConfig';

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
        [DB_FIXED_FIELDS[0].id]: service.endpoints?.[0] || '-',
        [DB_FIXED_FIELDS[1].id]: service.port || '-',
      });
    }
  }, [originalBackendServiceList, selectedService]);

  // 监听 record 变化，重置表单
  useEffect(() => {
    if (visible) {
      if (mode === 'create') {
        form.resetFields();
      } else {
        if (record && record.dsn) {
          const match = record.dsn.match(REG_DSN_STRING.DEFAULT);
          if (match) {
            form.setFieldsValue({
              db_user_name: match[1],
              db_password: match[2],
              db_database: match[5],
            });
          }
        }
        form.setFieldsValue({
          ...record,
          service: record?.services?.[0]?.name,
          consumerAuth: record?.consumerAuthInfo?.enable || false,
          domains: record?.domains?.[0],
          db_type: record?.dbType,
          allowedConsumers: record?.consumerAuthInfo?.allowedConsumers || [],
        });
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
    const serviceName = values.service.split(':')[0];
    const service = originalBackendServiceList.find((item) => item.name === serviceName);
    if (!service) {
      return;
    }

    const submitData = {
      ...record,
      ...values,
      services: [
        {
          name: service.name,
          port: service.port,
          version: '1.0',
          weight: 100,
        },
      ],
      ...(values.type === SERVICE_TYPE.DB
        ? {
          dsn: computeDSN(values),
          dbType: values.db_type,
        }
        : {}),
      consumerAuthInfo: {
        enable: values.consumerAuth,
        type: CredentialType.KEY_AUTH,
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
            { required: true, message: t('mcp.form.nameRequired') },
            {
              pattern: /^(?![-.])[A-Za-z0-9.-]{1,63}[A-Za-z0-9]$/,
              message: t('mcp.form.namePattern'),
            },
          ]}
        >
          <Input disabled={mode === 'edit'} placeholder={t('mcp.form.nameRequired')!} />
        </Form.Item>

        <Form.Item
          label={t('mcp.form.description')}
          name="description"
          rules={[{ required: true, message: t('mcp.form.descriptionRequired') }]}
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
          rules={[{ required: true, message: t('mcp.form.typeRequired') }]}
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

        <Form.Item
          label={t('mcp.form.upstreamService')}
          name="service"
          rules={[{ required: true, message: t('mcp.form.upstreamServiceRequired') }]}
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

        {serviceType === SERVICE_TYPE.DB && (
          <Form.Item
            label={t('mcp.form.databaseConfig')}
            name="dsn"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  if (!value || !value.match(REG_DSN_STRING.DEFAULT)) {
                    return Promise.reject(new Error(t('mcp.form.databaseConfigInvalid')!));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatabaseConfig
              form={form}
              onChange={(dsn, dbType) => {
                form.setFieldsValue({
                  dsn,
                  dbType,
                });
              }}
            />
          </Form.Item>
        )}

        {serviceType === SERVICE_TYPE.DIRECT_ROUTE && (
          <Form.Item
            label={t('mcp.form.upstreamPathPrefixLabel') || '后端服务前缀匹配路径'}
            name="upstreamPathPrefix"
            rules={[
              { required: true, message: t('mcp.form.upstreamPathPrefixRequired') },
              {
                pattern: /^\/.*/,
                message: t('mcp.form.upstreamPathPrefixPattern'),
              },
            ]}
            extra={t('mcp.form.upstreamPathPrefixExtra') || '后端服务需支持 SSE 或 Streamable 协议'}
          >
            <Input />
          </Form.Item>
        )}

        <Form.Item
          label={t('mcp.form.consumerAuth')}
          name="consumerAuth"
          valuePropName="checked"
        >
          <Switch
            onChange={(value) => {
              form.setFieldsValue({
                consumerAuth: value,
                authType: value ? 'key-auth' : undefined,
                allowedConsumers: value ? form.getFieldValue('allowedConsumers') : undefined,
              });
            }}
          />
        </Form.Item>

        {form.getFieldValue('consumerAuth') && (
          <>
            <Form.Item
              label={t('misc.authType')}
              name="authType"
              initialValue="key-auth"
              extra={t('misc.keyAuthOnlyTip')}
            >
              <Select disabled>
                <Select.Option value="key-auth">Key Auth</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              required
              label={t('mcp.form.allowedConsumers')}
              extra={(<HistoryButton text={t('consumer.create')} path={"/consumer"} />)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Item
                  name="allowedConsumers"
                  noStyle
                  rules={[{ required: true, message: t('mcp.form.allowedConsumersRequired') }]}
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
          </>
        )}
      </Form>
    </Drawer>
  );
};

export default McpFormDrawer;
