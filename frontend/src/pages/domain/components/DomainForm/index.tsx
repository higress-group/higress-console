import { OptionItem } from '@/interfaces/common';
import { DEFAULT_DOMAIN, EnableHttpsValue, Protocol } from '@/interfaces/domain';
import { TlsCertificate } from '@/interfaces/tls-certificate';
import { getTlsCertificates } from '@/services';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Checkbox, Form, Input, Select, Tooltip } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DomainGroup from '../DomainGroup';

const { Option } = Select;

interface DomainFormProps {
  value?: any;
  isIngressMode?: boolean;
}

const DomainForm = forwardRef((props: DomainFormProps, ref) => {
  const { t } = useTranslation();

  const { value, isIngressMode } = props;
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
      const { name, enableHttps, portAndCertMap } = value;
      const protocolValue = enableHttps !== EnableHttpsValue.off ? Protocol.https : Protocol.http;
      setProtocol(protocolValue);
      const values = { name, protocol: protocolValue };
      if (portAndCertMap) {
        Object.assign(values, { portAndCertMap });
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
      {
        value?.name === DEFAULT_DOMAIN && (
          <Form.Item
            required
            label={t('domain.domainForm.name')}
          >
            <Input
              disabled={value}
              value={t('domain.defaultDomain') as string}
            />
          </Form.Item>
        ) || (
          <Form.Item
            label={t('domain.domainForm.name')}
            required
            name="name"
            tooltip={t('domain.domainForm.nameTooltip')}
            rules={[
              {
                required: true,
                pattern: /^(\*\.)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,6}$/,
                message: t('domain.domainForm.nameRequired'),
              },
            ]}
          >
            <Input
              showCount
              allowClear
              disabled={value}
              maxLength={63}
            />
          </Form.Item>
        )
      }
      {/* <Form.Item
        label={t('domain.domainForm.protocol')}
        required
        name="protocol"
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
              name="certIdentifier"
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
              name="mustHttps"
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
                    value: true,
                  },
                ]}
              />
            </Form.Item>
          </div>
        ) : null
      } */}
      <Form.Item
        label={t('domain.domainForm.portAndCertMap')}
        name="portAndCertMap"
        required
        tooltip={t('domain.domainForm.portAndCertMapTooltip')}
        rules={[
          {
            required: true,
            validator: (_, portAndCertMapValue) => {
              if (!portAndCertMapValue || portAndCertMapValue.length === 0) {
                return Promise.reject(new Error(String(t('domain.domainForm.portAndCertMapRequired'))));
              }

              // Check for empty ports
              const hasEmptyPort = portAndCertMapValue.some(item => !item.port);
              if (hasEmptyPort) {
                return Promise.reject(new Error(String(t('domain.domainForm.portRequired'))));
              }

              // Check for duplicate ports
              const ports = portAndCertMapValue.map(item => item.port);
              const hasDuplicates = ports.length !== new Set(ports).size;
              if (hasDuplicates) {
                return Promise.reject(new Error(String(t('domain.domainForm.portDuplicate'))));
              }

              // Check if HTTPS protocol has certificate
              const hasHttpsWithoutCert = portAndCertMapValue.some((item) => {
                return item.protocol === 'HTTPS' && !item.certificate;
              });
              if (hasHttpsWithoutCert) {
                return Promise.reject(new Error(String(t('domain.domainForm.certificateRequiredWhenHttps'))));
              }

              // Validate ingress mode constraints
              if (isIngressMode) {
                const invalidPorts = portAndCertMapValue.some((item) => {
                  return (item.port !== 80 && item.port !== 443) ||
                         (item.port === 80 && item.protocol !== 'HTTP') ||
                         (item.port === 443 && item.protocol !== 'HTTPS');
                });
                if (invalidPorts) {
                  return Promise.reject(new Error(String(t('domain.domainForm.ingressModeConstraint'))));
                }
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <DomainGroup
          value={value?.portAndCertMap}
          certificateOptions={certificateOptions}
          isIngressMode={isIngressMode}
        />
      </Form.Item>
    </Form>
  );
});

export default DomainForm;
