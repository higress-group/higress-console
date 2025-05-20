import { OptionItem } from '@/interfaces/common';
import { Form, Input, Select, DatePicker } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const TlsCertificateForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { value } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    if (value) {
      const { name, cert, key } = value;
      form.setFieldsValue({ name, cert, key });
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    reset: () => form.resetFields(),
    handleSubmit: () => (form.validateFields()),
  }));

  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        label={t('tlsCertificate.tlsCertificateForm.name')}
        required
        name="name"
        tooltip={t('tlsCertificate.tlsCertificateForm.nameTooltip')}
        rules={[
          {
            required: true,
            message: t('tlsCertificate.tlsCertificateForm.nameRequired'),
          },
        ]}
      >
        <Input
          showCount
          allowClear
          disabled={value}
          maxLength={256}
          placeholder={t('tlsCertificate.tlsCertificateForm.namePlaceholder')}
        />
      </Form.Item>
      {
        value &&
        <Form.Item>
          {t('tlsCertificate.tlsCertificateForm.infoSecNote')}
        </Form.Item>
      }
      <Form.Item
        label={t('tlsCertificate.tlsCertificateForm.cert')}
        required
        name="cert"
        rules={[
          {
            required: true,
            message: t('tlsCertificate.tlsCertificateForm.certRequired'),
          },
        ]}
      >
        <Input.TextArea
          rows={6}
          allowClear
          placeholder={t('tlsCertificate.tlsCertificateForm.certPlaceholder')}
        />
      </Form.Item>
      <Form.Item
        label={t('tlsCertificate.tlsCertificateForm.key')}
        required
        name="key"
        rules={[
          {
            required: true,
            message: t('tlsCertificate.tlsCertificateForm.keyRequired'),
          },
        ]}
      >
        <Input.TextArea
          rows={6}
          allowClear
          placeholder={t('tlsCertificate.tlsCertificateForm.keyPlaceholder')}
        />
      </Form.Item>
    </Form>
  );
});

export default TlsCertificateForm;
