import { OptionItem } from '@/interfaces/common';
import { Form, Input, Select, DatePicker, message, Spin } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateTlsCertificate } from '@/services/tls-certificate';

const TlsCertificateForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { value } = props;
  const [form] = Form.useForm();
  const [validating, setValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    form.resetFields();
    setValidationErrors([]);
    if (value) {
      const { name, cert, key } = value;
      form.setFieldsValue({ name, cert, key });
    }
  }, [value]);

  // 证书校验函数
  const handleValidateCertificate = async () => {
    try {
      const values = await form.validateFields(['cert', 'key']);
      if (!values.cert || !values.key) {
        return false;
      }

      setValidating(true);
      setValidationErrors([]);

      const result = await validateTlsCertificate({
        cert: values.cert,
        key: values.key,
      });

      if (result.valid) {
        message.success(t('tlsCertificate.validation.success'));
        setValidationErrors([]);
        return true;
      } else {
        setValidationErrors(result.errors);
        message.error(t('tlsCertificate.validation.failed'));
        return false;
      }
    } catch (error) {
      console.error('Certificate validation error:', error);
      message.error(error.response.data.data.errors);
      return false;
    } finally {
      setValidating(false);
    }
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields();
      setValidationErrors([]);
    },
    handleSubmit: async () => {
      // 先校验证书，再验证表单
      const isValid = await handleValidateCertificate();
      if (!isValid) {
        return Promise.reject(new Error('Certificate validation failed'));
      }
      return form.validateFields();
    },
  }));

  return (
    <Spin spinning={validating} tip={t('tlsCertificate.validation.validating')}>
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
          validateStatus={validationErrors.length > 0 ? 'error' : ''}
          help={validationErrors.length > 0 ? validationErrors.join('; ') : ''}
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
          validateStatus={validationErrors.length > 0 ? 'error' : ''}
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
    </Spin>
  );
});

export default TlsCertificateForm;
