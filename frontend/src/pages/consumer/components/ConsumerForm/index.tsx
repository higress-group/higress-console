import { ServiceSourceTypes } from '@/interfaces/service-source';
import { Form, Input, Select, Tabs } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const ConsumerForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { value } = props;
  const [form] = Form.useForm();
  const [activeTabKey, setActiveTabKey] = useState('');

  useEffect(() => {
    setActiveTabKey('key-auth');
    form.resetFields();
  }, [value]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields();
    },
    handleSubmit: async () => {
      const values = await form.validateFields();
      return values;
    },
  }));

  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        label={t('consumer.consumerForm.name')}
        required
        name="name"
        rules={[
          {
            required: true,
            pattern: /^(?!-)[A-Za-z0-9-]{0,62}[A-Za-z0-9]$/,
            message: t('consumer.consumerForm.nameRequired'),
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={63}
          disabled={value}
          placeholder={t('consumer.consumerForm.namePlaceholder')}
        />
      </Form.Item>
      <Tabs
        activeKey={activeTabKey}
        onChange={key => setActiveTabKey(key)}
        items={[
          {
            label: 'Key Auth',
            key: 'key-auth',
            children: (
              <></>
            ),
          },
          {
            label: 'OAuth2',
            key: 'oauth2',
            children: (
              <></>
            ),
          },
          {
            label: 'JWT',
            key: 'jwt-auth',
            children: (
              <></>
            ),
          },
        ]}
      />
    </Form>
  );
});

export default ConsumerForm;
