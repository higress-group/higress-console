import { ServiceSourceTypes } from '@/interfaces/service-source';
import { Form, Input, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { Option } = Select;


const SourceForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { value } = props;
  const [form] = Form.useForm();
  const [sourceType, setSourceType] = useState<string>();

  useEffect(() => {
    form.resetFields();
    if (value) {
      setSourceType(value.type);
      if ([ServiceSourceTypes.static.key, ServiceSourceTypes.dns.key].indexOf(value.type) !== -1) {
        value.domainForEdit = value.domain ? value.domain.replaceAll(',', '\n') : '';
      }
      form.setFieldsValue(value);
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSourceType(null);
      form.resetFields();
    },
    handleSubmit: async () => {
      const values = await form.validateFields();
      if ([ServiceSourceTypes.static.key, ServiceSourceTypes.dns.key].indexOf(values.type) !== -1) {
        if (values.domainForEdit) {
          values.domain = values.domainForEdit.split('\n').map(d => d.trim()).filter(d => d).join(',');
        } else {
          values.domain = '';
        }

        if (values.type === ServiceSourceTypes.static.key) {
          values.port = 80;
        }
      }
      return values;
    },
  }));

  function selectServiceSourceType(type) {
    setSourceType(type)
    if (type === ServiceSourceTypes.nacos.key || type === ServiceSourceTypes.nacos2.key) {
      const groups = form.getFieldValue(["properties", "nacosGroups"]);
      if (!groups || !groups.length) {
        form.setFieldValue(["properties", "nacosGroups"], ["DEFAULT_GROUP"]);
      }
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        label={t('serviceSource.serviceSourceForm.type')}
        required
        name="type"
        tooltip={t('serviceSource.serviceSourceForm.typeTooltip')}
      >
        <Select
          allowClear
          disabled={value}
          placeholder={t('serviceSource.serviceSourceForm.typePlaceholder')}
          onChange={(v) => selectServiceSourceType(v)}
        >
          {
            // eslint-disable-next-line @iceworks/best-practices/recommend-polyfill
            Object.entries(ServiceSourceTypes).map(([k, v]) =>
              v.enabled && (<Option key={v.key} value={v.key}>{v.i18n ? t(v.name) : v.name}</Option>))
          }
        </Select>
      </Form.Item>
      <Form.Item
        label={t('serviceSource.serviceSourceForm.name')}
        required
        name="name"
        rules={[
          {
            required: true,
            pattern: /^(?!-)[A-Za-z0-9-]{0,62}[A-Za-z0-9]$/,
            message: t('serviceSource.serviceSourceForm.nameRequired'),
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={63}
          disabled={value}
          placeholder={t('serviceSource.serviceSourceForm.namePlaceholder')}
        />
      </Form.Item>
      {
        sourceType && [ServiceSourceTypes.static.key, ServiceSourceTypes.dns.key].indexOf(sourceType || '') === -1 &&
        (
          <>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.domain')}
              required
              name="domain"
              tooltip={t('serviceSource.serviceSourceForm.domainTooltip')}
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.domainRequired'),
                },
              ]}
            >
              <Input
                showCount
                allowClear
                maxLength={256}
                placeholder={t('serviceSource.serviceSourceForm.domainPlaceholder')}
              />
            </Form.Item>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.port')}
              required
              name="port"
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.portRequired'),
                },
              ]}
            >
              <Input
                allowClear
                type="number"
                min={1}
                max={65535}
                placeholder={t('serviceSource.serviceSourceForm.portPlaceholder')}
              />
            </Form.Item>
          </>
        )
      }
      {
        sourceType === ServiceSourceTypes.zookeeper.key && (
          <>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.zkServicesPath')}
              name={['properties', 'zkServicesPath']}
              tooltip={t('serviceSource.serviceSourceForm.zkServicesPathTooltip')}
            >
              <Select
                allowClear
                mode="tags"
                placeholder={t('serviceSource.serviceSourceForm.zkServicesPathPlaceholder')}
              />
            </Form.Item>
          </>
        )
      }
      {
        (sourceType === ServiceSourceTypes.nacos.key || sourceType === ServiceSourceTypes.nacos2.key) && (
          <>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.nacosNamespaceId')}
              name={['properties', 'nacosNamespaceId']}
              rules={[
                {
                  message: t('serviceSource.serviceSourceForm.nacosNamespaceIdRequired'),
                },
              ]}
            >
              <Input
                showCount
                allowClear
                maxLength={256}
                placeholder={t('serviceSource.serviceSourceForm.nacosNamespaceIdPlaceholder')}
              />
            </Form.Item>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.nacosGroups')}
              name={['properties', 'nacosGroups']}
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.nacosGroupsRequired'),
                },
              ]}
            >
              <Select
                mode="tags"
                allowClear
                placeholder={t('serviceSource.serviceSourceForm.nacosGroupsPlaceholder')}
                options={[{ value: "DEFAULT_GROUP" }]}
              />
            </Form.Item>
          </>)
      }
      {
        sourceType === ServiceSourceTypes.consul.key && (
          <>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.consulNamespace')}
              name={['properties', 'consulNamespace']}
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.consulNamespaceRequired'),
                },
              ]}
              tooltip={t('serviceSource.serviceSourceForm.consulNamespaceTooltip')}
            >
              <Input
                showCount
                allowClear
                maxLength={256}
                placeholder={t('serviceSource.serviceSourceForm.consulNamespacePlaceholder')}
              />
            </Form.Item>
          </>
        )
      }
      {
        sourceType === ServiceSourceTypes.static.key && (
          <>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.serviceStaticAddresses')}
              name={['domainForEdit']}
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.serviceStaticAddressesRequired'),
                },
              ]}
            >
              <TextArea
                showCount
                allowClear
                maxLength={4096}
                rows={10}
                placeholder={t('serviceSource.serviceSourceForm.serviceStaticAddressesPlaceholder')}
              />
            </Form.Item>
          </>
        )
      }
      {
        sourceType === ServiceSourceTypes.dns.key && (
          <>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.servicePort')}
              required
              name="port"
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.servicePortRequired'),
                },
              ]}
            >
              <Input
                allowClear
                type="number"
                min={1}
                max={65535}
                placeholder={t('serviceSource.serviceSourceForm.servicePortPlaceholder')}
              />
            </Form.Item>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.serviceDomains')}
              name={['domainForEdit']}
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.serviceDomainsRequired'),
                },
              ]}
            >
              <TextArea
                showCount
                allowClear
                maxLength={4096}
                rows={5}
                placeholder={t('serviceSource.serviceSourceForm.serviceDomainsPlaceholder')}
              />
            </Form.Item>
          </>
        )
      }
    </Form>
  );
});

export default SourceForm;
