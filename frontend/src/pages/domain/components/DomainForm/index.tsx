import { OptionItem } from '@/interfaces/common';
import { EnableHttpsValue, Protocol } from '@/interfaces/domain';
import { TlsCertificate } from '@/interfaces/tls-certificate';
import { getTlsCertificates } from '@/services';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Checkbox, Form, Input, Select, Tooltip } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const DomainForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();

  const { value } = props;
  const [form] = Form.useForm();
  const [protocol, setProtocol] = useState<string>(Protocol.http);
  const [certificateOptions, setCertificateOptions] = useState<OptionItem[]>([]);
  const { data: _certificates = [] } = useRequest(getTlsCertificates);

  useEffect(() => {
    form.resetFields();
    setProtocol(Protocol.http);

    const _certificateOptions: OptionItem[] = [];
    const certificates = _certificates as TlsCertificate[];
    certificates && certificates.forEach(domain => {
      const { name } = domain;
      _certificateOptions.push({ label: name, value: name });
    });
    setCertificateOptions(_certificateOptions);

    if (value) {
      const { name, enableHttps } = value;
      const protocolValue = enableHttps !== EnableHttpsValue.off ? Protocol.https : Protocol.http;
      setProtocol(protocolValue);
      const values = { name, protocol: protocolValue };
      if (value.certIdentifier) {
        Object.assign(values, { certIdentifier: value.certIdentifier });
      }
      if (enableHttps === EnableHttpsValue.force) {
        Object.assign(values, { mustHttps: [true] });
      }
      form.setFieldsValue(values);
    }
  }, [value, _certificates]);

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
        label={t('domain.domainForm.name')}
        required
        name='name'
        tooltip={t('domain.domainForm.nameTooltip')}
        rules={[
          {
            required: true,
            message: t('domain.domainForm.nameRequired')
          },
        ]}
      >
        <Input
          showCount
          allowClear
          disabled={value}
          maxLength={256}
          placeholder={t('domain.domainForm.namePlaceholder')}
        />
      </Form.Item>
      <Form.Item
        label={t('domain.domainForm.protocol')}
        required
        name='protocol'
        tooltip={t('domain.domainForm.protocolTooltip')}
        rules={[
          {
            required: true,
            message: t('domain.domainForm.protocolRequired'),
          },
        ]}
      >
        <Select
          allowClear
          placeholder={t('domain.domainForm.protocolPlaceholder')}
          onChange={(v) => setProtocol(v)}
        >
          <Option value={Protocol.http}>HTTP</Option>
          <Option value={Protocol.https}>HTTPS</Option>
        </Select>
      </Form.Item>
      {
        protocol === Protocol.https ? (
          <div>
            <Form.Item
              label={t('domain.domainForm.certificate')}
              required
              name='certIdentifier'
              tooltip={t('domain.domainForm.certificateTooltip')}
              rules={[
                {
                  required: true,
                  message: t('domain.domainForm.certificateRequired'),
                },
              ]}
            >
              <Select
                showSearch
                allowClear
                placeholder={t('domain.domainForm.certificatePlaceholder')}
                options={certificateOptions}
              />
            </Form.Item>
            <Form.Item
              name='mustHttps'
              tooltip={t('domain.domainForm.mustHttpsTooltip')}
            >
              <Checkbox.Group
                options={[
                  {
                    label: (
                      <>
                        <span style={{ marginRight: 4 }}>{t('domain.domainForm.mustHttps')}</span>
                        <Tooltip title={t('domain.domainForm.mustHttpsCheckboxTooltip')}>
                          <QuestionCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                        </Tooltip>
                      </>
                    ),
                    value: true
                  }
                ]}
              />
            </Form.Item>
          </div>
        ) : null
      }
    </Form>
  );
});

export default DomainForm;