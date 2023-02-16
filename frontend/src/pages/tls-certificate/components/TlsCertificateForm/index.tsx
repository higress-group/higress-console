import { OptionItem } from '@/interfaces/common';
import { TlsCertificate } from '@/interfaces/tls-certificate';
import { getGatewayDomains, getTlsCertificates } from '@/services';
import { useRequest } from 'ahooks';
import { Form, Input, Select,DatePicker } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import moment from 'moment';

const TlsCertificateForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();

  const { value } = props;
  const [domainsOptions, setDomainsOptions] = useState<OptionItem[]>([]);
  const [form] = Form.useForm();
  const { data: _domains = [] } = useRequest(getGatewayDomains);

  useEffect(() => {
    form.resetFields();

    const _domainsOptions: OptionItem[] = [];
    const domains = _domains as TlsCertificate[];
    domains && domains.forEach(domain => {
      const { name } = domain;
      _domainsOptions.push({ label: name, value: name });
    });
    setDomainsOptions(_domainsOptions);

    if (value) {
      const { name,version, cert, key } = value;

      const values = { name,version, cert, key };
      if (value.domains) {
        Object.assign(values, { domains: value.domains });
      }
      if (value.validityStart) {
        Object.assign(values, { validityStart: moment(value.validityStart) });
      }
      if (value.validityEnd) {
        Object.assign(values, { validityEnd: moment(value.validityEnd) });
      }
      form.setFieldsValue(values);
    }

  }, [value,_domains]);

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
        name='name'
        tooltip={t('tlsCertificate.tlsCertificateForm.nameTooltip')}
        rules={[
          {
            required: true,
            message: t('tlsCertificate.tlsCertificateForm.nameRequired')
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
      <Form.Item
        label={t('tlsCertificate.tlsCertificateForm.version')}
        required
        name='version'
        rules={[
          {
            required: true,
            message: t('tlsCertificate.tlsCertificateForm.versionRequired')
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={256}
          placeholder={t('tlsCertificate.tlsCertificateForm.versionPlaceholder')}
        />
      </Form.Item>
      <Form.Item
        label={t('tlsCertificate.tlsCertificateForm.cert')}
        required
        name='cert'
        tooltip={t('tlsCertificate.tlsCertificateForm.certTooltip')}
        rules={[
          {
            required: true,
            message: t('tlsCertificate.tlsCertificateForm.certRequired')
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
        name='key'
        tooltip={t('tlsCertificate.tlsCertificateForm.keyTooltip')}
        rules={[
          {
            required: true,
            message: t('tlsCertificate.tlsCertificateForm.keyRequired')
          },
        ]}
      >
        <Input.TextArea
          rows={6}
          allowClear
          placeholder={t('tlsCertificate.tlsCertificateForm.keyPlaceholder')}
        />
      </Form.Item>
      <Form.Item
        label={t('tlsCertificate.tlsCertificateForm.domains')}
        required
        name='domains'
        rules={[
          {
            required: true,
            message: t('tlsCertificate.tlsCertificateForm.domainsRequired')
          },
        ]}
      >
        <Select
          mode="tags"
          allowClear
          options={domainsOptions}
          placeholder={t('tlsCertificate.tlsCertificateForm.domainsPlaceholder')}
        />
      </Form.Item>
      <Form.Item
        label={t('tlsCertificate.tlsCertificateForm.validityStart')}
        required
        name='validityStart'
        rules={[
          {
            required: true,
            message: t('tlsCertificate.tlsCertificateForm.validityStartRequired')
          },
        ]}
      >
        <DatePicker
          showTime
          allowClear
          format="yyyy/MM/DD HH:mm:ss"
          placeholder={t('tlsCertificate.tlsCertificateForm.validityStartPlaceholder')}
        />
      </Form.Item>
      <Form.Item
        label={t('tlsCertificate.tlsCertificateForm.validityEnd')}
        required
        name='validityEnd'
        rules={[
          {
            required: true,
            message: t('tlsCertificate.tlsCertificateForm.validityEndRequired')
          },
        ]}
      >
        <DatePicker
          showTime
          allowClear
          format="yyyy/MM/DD HH:mm:ss"
          placeholder={t('tlsCertificate.tlsCertificateForm.validityEndPlaceholder')}
        />
      </Form.Item>
    </Form>
  );
});

export default TlsCertificateForm;