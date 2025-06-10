import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, Button, Space, Select, Switch, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { getServiceTypeMap, SERVICE_TYPE, SERVICE_TYPES, DB_TYPE_OPTIONS } from '../constant';
import { getGatewayDomains } from '@/services/domain';
import { getGatewayServices } from '@/services/service';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useWatch } from 'antd/es/form/Form';

interface McpFormDrawerProps {
  visible: boolean;
  mode: 'create' | 'edit';
  record?: any;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const McpFormDrawer: React.FC<McpFormDrawerProps> = ({ visible, mode, record, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [serviceType, setServiceType] = useState(record?.type || '');
  const [domainList, setDomainList] = useState<string[]>([]);
  const [domainLoading, setDomainLoading] = useState(false);
  const [backendServiceList, setBackendServiceList] = useState<any[]>([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [originalBackendServiceList, setOriginalBackendServiceList] = useState<any[]>([]);
  const consumerAuth = useWatch('consumerAuth', form);

  // 监听 record 变化，重置表单
  useEffect(() => {
    if (visible) {
      if (mode === 'create') {
        form.resetFields();
        setServiceType('');
      } else {
        form.setFieldsValue({
          ...record,
          service: record?.services?.[0]?.name,
          consumerAuth: record?.consumerAuthInfo?.enable || false,
          domains: record?.domains?.[0],
        });
        setServiceType(record?.type || '');
      }
    }
  }, [visible, mode, record, form]);

  // 获取域名列表
  const getDomainList = async (query?: string) => {
    setDomainLoading(true);
    try {
      const res = await getGatewayDomains();
      setDomainList(res.map((item: any) => item.name));
    } finally {
      setDomainLoading(false);
    }
  };

  // 获取后端服务列表
  const getBackendServiceList = async (query?: string) => {
    setServiceLoading(true);
    try {
      const res = await getGatewayServices();
      setOriginalBackendServiceList(res);
      setBackendServiceList(
        res.map((item: any) => ({
          value: item.name,
          label: item.name,
        })),
      );
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      getDomainList();
      getBackendServiceList();
    }
  }, [visible]);

  // DSN自动生成逻辑
  const computeDSN = (values: any) => {
    if (serviceType !== SERVICE_TYPE.DB) return '';
    const { dbType, dbUser, dbPassword, dbHost, dbPort, dbName, dbParams } = values;
    if (!dbType || !dbUser || !dbPassword || !dbHost || !dbPort || !dbName) return '';
    return `${dbType.toLowerCase()}:${dbUser}:${dbPassword}@tcp(${dbHost}:${dbPort})/${dbName}${
      dbParams ? `?${dbParams}` : ''
    }`;
  };

  // 表单提交
  const handleFinish = (values: any) => {
    const service = originalBackendServiceList.find((item) => item.name === values.service);
    if (!service) {
      return;
    }

    const submitData = {
      ...values,
      services: [
        {
          name: service.name,
          port: service.nodes[0].port,
          version: '1.0',
          weight: service.nodes[0].weight,
        },
      ],
      ...(values.type === SERVICE_TYPE.DB
        ? {
          dsn: computeDSN(values),
          dbType: values.dbType,
        }
        : {}),
      consumerAuthInfo: {
        enable: values.consumerAuth,
        type: 'API_KEY',
        strategyConfigId: values.consumerAuthInfo?.strategyConfigId,
      },
      domains: Array.isArray(values.domains) ? values.domains : [values.domains],
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
            {t('mcp.form.saveAndPublish')}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(_, allValues) => setServiceType(allValues.type)}
        onFinish={handleFinish}
      >
        <Form.Item
          label={t('mcp.form.name')}
          name="name"
          rules={[
            { required: true, message: t('mcp.form.nameRequired') },
            {
              pattern: /^(?!-)[A-Za-z0-9-]{1,63}[A-Za-z0-9]$/,
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
          rules={[{ required: true, message: t('mcp.form.domainsRequired') }]}
        >
          <Select
            showSearch
            loading={domainLoading}
            options={domainList.map((domain) => ({ label: domain, value: domain }))}
            onSearch={(value) => getDomainList(value)}
            filterOption={false}
            placeholder={t('mcp.form.domainsRequired')!}
          />
        </Form.Item>

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
            onChange={(v) => setServiceType(v)}
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
            onSearch={(value) => getBackendServiceList(value)}
            filterOption={false}
            placeholder={t('mcp.form.upstreamServiceRequired')!}
          />
        </Form.Item>

        {serviceType === SERVICE_TYPE.DB && (
          <>
            <Form.Item
              label={t('mcp.form.dbType')}
              name="dbType"
              rules={[{ required: true, message: t('mcp.form.dbTypeRequired') }]}
            >
              <Select
                options={DB_TYPE_OPTIONS}
                onChange={(value) => form.setFieldsValue({ dbType: value })}
                placeholder={t('mcp.form.dbTypeRequired')!}
              />
            </Form.Item>
            <Form.Item
              label={t('mcp.form.dbUser')}
              name="dbUser"
              rules={[{ required: true, message: t('mcp.form.dbUserRequired') }]}
            >
              <Input placeholder={t('mcp.form.dbUserRequired')!} />
            </Form.Item>
            <Form.Item
              label={t('mcp.form.dbPassword')}
              name="dbPassword"
              rules={[{ required: true, message: t('mcp.form.dbPasswordRequired') }]}
            >
              <Input.Password placeholder={t('mcp.form.dbPasswordRequired')!} />
            </Form.Item>
            <Form.Item
              label={t('mcp.form.dbHost')}
              name="dbHost"
              rules={[{ required: true, message: t('mcp.form.dbHostRequired') }]}
            >
              <Input placeholder={t('mcp.form.dbHostRequired')!} />
            </Form.Item>
            <Form.Item
              label={t('mcp.form.dbPort')}
              name="dbPort"
              rules={[{ required: true, message: t('mcp.form.dbPortRequired') }]}
            >
              <Input placeholder={t('mcp.form.dbPortRequired')!} />
            </Form.Item>
            <Form.Item
              label={t('mcp.form.dbName')}
              name="dbName"
              rules={[{ required: true, message: t('mcp.form.dbNameRequired') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label={t('mcp.form.dbParams')} name="dbParams">
              <Input />
            </Form.Item>
          </>
        )}

        {serviceType === SERVICE_TYPE.DIRECT_ROUTE && (
          <Form.Item
            label={t('mcp.form.upstreamPathPrefix')}
            name="upstreamPathPrefix"
            rules={[
              { required: true, message: t('mcp.form.upstreamPathPrefixRequired') },
              {
                pattern: /^\/.*/,
                message: t('mcp.form.upstreamPathPrefixPattern'),
              },
            ]}
          >
            <Input />
          </Form.Item>
        )}

        <Form.Item label={t('mcp.form.consumerAuth')} name="consumerAuth" valuePropName="checked">
          <Switch onChange={(value) => {
            form.setFieldsValue({
              consumerAuth: value,
              consumerAuthInfo: {
                enable: value,
              },
            });
          }}
          />
        </Form.Item>

        {consumerAuth && (
          <Form.Item label={t('mcp.form.authType')}>
            <Space>
              <span>API Key</span>
              <Tooltip title={t('mcp.form.apiKeyTooltip')}>
                <QuestionCircleOutlined style={{ color: '#888' }} />
              </Tooltip>
            </Space>
          </Form.Item>
        )}
      </Form>
    </Drawer>
  );
};

export default McpFormDrawer;
