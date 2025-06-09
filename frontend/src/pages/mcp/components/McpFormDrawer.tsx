import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, Button, Space, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { getServiceTypeMap, SERVICE_TYPE, SERVICE_TYPES } from '../constant';

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

  // 监听 record 变化，重置表单
  useEffect(() => {
    if (visible) {
      if (mode === 'create') {
        form.resetFields();
        setServiceType('');
      } else {
        form.setFieldsValue(record || {});
        setServiceType(record?.type || '');
      }
    }
  }, [visible, mode, record, form]);

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
    if (serviceType === SERVICE_TYPE.DB) {
      values.dsn = computeDSN(values);
    }
    onSubmit(values);
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
          rules={[{ required: true, message: t('mcp.form.nameRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('mcp.form.description')}
          name="description"
          rules={[{ required: true, message: t('mcp.form.descriptionRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('mcp.form.domains')}
          name="domains"
          rules={[{ required: true, message: t('mcp.form.domainsRequired') }]}
        >
          <Input />
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
          />
        </Form.Item>

        {serviceType === SERVICE_TYPE.DB && (
          <>
            <Form.Item
              label={t('mcp.form.dbType')}
              name="dbType"
              rules={[{ required: true, message: t('mcp.form.dbTypeRequired') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t('mcp.form.dbUser')}
              name="dbUser"
              rules={[{ required: true, message: t('mcp.form.dbUserRequired') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t('mcp.form.dbPassword')}
              name="dbPassword"
              rules={[{ required: true, message: t('mcp.form.dbPasswordRequired') }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label={t('mcp.form.dbHost')}
              name="dbHost"
              rules={[{ required: true, message: t('mcp.form.dbHostRequired') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t('mcp.form.dbPort')}
              name="dbPort"
              rules={[{ required: true, message: t('mcp.form.dbPortRequired') }]}
            >
              <Input />
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
            <Form.Item label={t('mcp.form.dsn')} name="dsn">
              <Input value={computeDSN(form.getFieldsValue())} disabled />
            </Form.Item>
          </>
        )}

        {serviceType === SERVICE_TYPE.DIRECT_ROUTE && (
          <Form.Item
            label={t('mcp.form.upstreamPathPrefix')}
            name="upstreamPathPrefix"
            rules={[{ required: true, message: t('mcp.form.upstreamPathPrefixRequired') }]}
          >
            <Input />
          </Form.Item>
        )}

        <Form.Item label={t('mcp.form.upstreamService')} name="services">
          <Input />
        </Form.Item>

        <Form.Item label={t('mcp.form.consumerAuth')} name="consumerAuthInfo">
          <Input />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default McpFormDrawer;
