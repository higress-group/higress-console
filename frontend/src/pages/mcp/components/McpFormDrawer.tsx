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
import DatabaseConfig from './DatabaseConfig';

// MCP传输类型常量
const MCP_TRANSPORT_TYPE = {
  STREAMABLE_HTTP: 'streamable',
  SSE: 'sse',
};

const MCP_TRANSPORT_OPTIONS = [
  { label: 'Streamable HTTP', value: MCP_TRANSPORT_TYPE.STREAMABLE_HTTP },
  { label: 'SSE', value: MCP_TRANSPORT_TYPE.SSE },
];

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
  const transportType = useWatch(['directRouteConfig', 'transportType'], form);
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

  // 设置服务的主机和端口到数据库配置字段
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
        form.setFieldsValue({
          ...record,
          service: record?.services?.[0]?.name,
          consumerAuth: record?.consumerAuthInfo?.enable || false,
          domains: record?.domains?.[0] || '',
          db_type: record?.dbType,
          allowedConsumers: record?.consumerAuthInfo?.allowedConsumers || [],
          serviceProtocol: 'MCP',
          directRouteConfig: {
            path: record?.directRouteConfig?.path || '',
            transportType: record?.directRouteConfig?.transportType || '',
          },
          // 数据库配置字段 - 后端直接返回分离的字段
          db_user_name: record?.dbConfig?.username || '',
          db_password: record?.dbConfig?.password || '',
          db_database: record?.dbConfig?.dbname || '',
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
          dbType: values.db_type,
          dbConfig: {
            host: service.endpoints?.[0],
            port: service.port,
            username: values.db_user_name,
            password: values.db_password,
            dbname: values.db_database,
          },
        }
        : {}),
      ...(values.type === SERVICE_TYPE.DIRECT_ROUTE
        ? {
          directRouteConfig: {
            transportType: values.directRouteConfig?.transportType,
            path: values.directRouteConfig?.path,
          },
        }
        : {}),
      serviceProtocol: 'MCP',
      consumerAuthInfo: {
        enable: values.consumerAuth,
        type: CredentialType.KEY_AUTH.key,
        strategyConfigId: values.consumerAuthInfo?.strategyConfigId,
        allowedConsumers: values.allowedConsumers || [],
      },
      domains: values.domains ? [values.domains] : [],
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

        <Form.Item label={t('mcp.form.domains')} name="domains">
          <Select
            showSearch
            loading={domainLoading}
            options={domainList
              .filter((domain) => domain !== 'higress-default-domain')
              .map((domain) => ({ label: domain, value: domain }))}
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
          <Trans
            t={t}
            i18nKey="mcp.form.ssePathRule"
            values={{ currentMcpServerName: name || mcpServerName || t('mcp.form.nameDefault') }}
          >
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
          <Trans
            t={t}
            i18nKey="mcp.form.httpPathRule"
            values={{ currentMcpServerName: name || mcpServerName || t('mcp.form.nameDefault') }}
          >
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
          <Form.Item label={t('mcp.form.databaseConfig')} name="dbConfig">
            <DatabaseConfig form={form} />
          </Form.Item>
        )}

        {serviceType === SERVICE_TYPE.DIRECT_ROUTE && (
          <>
            <Form.Item label="服务协议" name="serviceProtocol" initialValue="MCP">
              <Input value="MCP" disabled />
            </Form.Item>
            <Form.Item
              label={t('mcp.form.transportType')}
              name={['directRouteConfig', 'transportType']}
              rules={[{ required: true, message: '请选择 MCP Transport 类型' }]}
            >
              <Select style={{ width: 200 }} options={MCP_TRANSPORT_OPTIONS} />
            </Form.Item>

            <Form.Item
              label={t('mcp.form.upstreamPathPrefix')}
              name={['directRouteConfig', 'path']}
              rules={[
                { required: true, message: '请输入路径' },
                {
                  pattern: /^\/.*/,
                  message: '路径必须以 / 开头',
                },
                {
                  validator: (_, value) => {
                    if (transportType === 'sse' && !value.endsWith('/sse')) {
                      return Promise.reject(new Error('SSE 传输类型路径必须以 /sse 结尾'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              extra={
                transportType === 'sse' && (
                  <div style={{ color: '#999', fontSize: 12, marginTop: 8 }}>SSE 传输类型路径必须以 /sse 结尾</div>
                )
              }
            >
              <Input placeholder="请输入路径，如 /api/v1" />
            </Form.Item>

            {/* {transportType === 'sse' && (
              <div style={{ color: '#999', fontSize: 12, marginTop: 8 }}>SSE 传输类型路径必须以 /sse 结尾</div>
            )} */}
          </>
        )}

        <Form.Item label={t('mcp.form.consumerAuth')} name="consumerAuth" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          label={t('misc.authType')}
          name="authType"
          initialValue={CredentialType.KEY_AUTH.key}
          extra={t('misc.keyAuthOnlyTip')}
        >
          <Select disabled>
            {Object.values(CredentialType)
              .filter((ct) => !!ct.enabled)
              .map((ct) => (
                <Select.Option key={ct.key} value={ct.key}>
                  {ct.displayName}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={t('mcp.form.allowedConsumers')}
          extra={<HistoryButton text={t('consumer.create')} path={'/consumer'} />}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Item name="allowedConsumers" noStyle>
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
