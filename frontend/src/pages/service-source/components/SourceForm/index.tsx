import { ServiceSourceTypes } from '@/interfaces/service-source';
import { Form, Input, Select } from 'antd';
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
      form.setFieldsValue(value);
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSourceType(null);
      form.resetFields();
    },
    handleSubmit: () => (form.validateFields()),
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
              v.enabled && (<Option key={v.key} value={v.key}>{v.name}</Option>))
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
            message: t('serviceSource.serviceSourceForm.nameRequired'),
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={256}
          disabled={value}
          placeholder={t('serviceSource.serviceSourceForm.namePlaceholder')}
        />
      </Form.Item>
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

      {
        sourceType === ServiceSourceTypes.zookeeper.key && (
          <div>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.zkServicesPath')}
              name={['properties', 'zkServicesPath']}
              tooltip={t('serviceSource.serviceSourceForm.zkServicesPathTooltip')}
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.zkServicesPathRequired'),
                },
              ]}
            >
              <Select
                allowClear
                mode="tags"
                placeholder={t('serviceSource.serviceSourceForm.zkServicesPathPlaceholder')}
              />
            </Form.Item>
          </div>
        )
      }
      {
        (sourceType === ServiceSourceTypes.nacos.key || sourceType === ServiceSourceTypes.nacos2.key) && (
          <div>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.nacosNamespaceId')}
              name={['properties', 'nacosNamespaceId']}
              rules={[
                {
                  required: true,
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
          </div>)
      }
      {
        sourceType === ServiceSourceTypes.consul.key && (
          <div>
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
          </div>
        )
      }
    </Form>
  );
});

export default SourceForm;
