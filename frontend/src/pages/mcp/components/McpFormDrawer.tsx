import React, { useState, useEffect, useMemo } from 'react';
import { Drawer, Form, Input, Button, Space, Select, Switch, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { getServiceTypeMap, SERVICE_TYPE, SERVICE_TYPES, REG_DSN_STRING } from '../constant';
import { getGatewayDomains } from '@/services/domain';
import { getGatewayServices } from '@/services/service';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useWatch } from 'antd/es/form/Form';
import DatabaseConfig, { DB_FIXED_FIELDS } from './DatabaseConfig';
import { getMcpServer } from '@/services/mcp';

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
  const [record, setRecord] = useState<any>(null);


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
        form.setFieldsValue({
          ...record,
          service: record?.services?.[0]?.name,
          consumerAuth: record?.consumerAuthInfo?.enable || false,
          domains: record?.domains?.[0],
        });
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
          value: `${item.name}:${item.port}`,
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
    const { dbType, dbUser, dbPassword, dbHost, dbName, dbParams } = values;
    if (!dbType || !dbUser || !dbPassword || !dbHost || !dbName) return '';
    return `${dbType.toLowerCase()}:${dbUser}:${dbPassword}@tcp(${dbHost})/${dbName}${dbParams ? `?${dbParams}` : ''}`;
  };

  // 表单提交
  const handleFinish = (values: any) => {
    const serviceName = values.service.split(':')[0];
    const service = originalBackendServiceList.find((item) => item.name === serviceName);
    if (!service) {
      return;
    }

    const submitData = {
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
          <Form.Item
            label={t('mcp.form.databaseConfig')}
            name="dsn"
            rules={[
              {
                required: true,
                message: t('mcp.form.databaseConfigRequired'),
                validator: (_, value) => {
                  if (!value || !value.match(REG_DSN_STRING.DEFAULT)) {
                    return Promise.reject(new Error(t('mcp.form.databaseConfigInvalid')!));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatabaseConfig />
          </Form.Item>
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
          <Switch
            onChange={(value) => {
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
