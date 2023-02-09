import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

/**
 * Service Source Type Enum
 */
const SourceType = {
  Default: "default",
  Nacos2: "nacos2",
  Nacos: "nacos",
  Zookeeper: "zookeeper",
  Consul: "consul",
  Eureka: "eureka"
};

const SourceForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { value } = props;
  const [form] = Form.useForm();
  const [sourceType, setSourceType] = useState<string>(SourceType.Default);

  useEffect(() => {
    form.resetFields();
    if (value) {
      setSourceType(value.type);
      form.setFieldsValue(value);
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSourceType(SourceType.Default)
      form.resetFields();
    },
    handleSubmit: () => (form.validateFields()),
  }));

  function selectServiceSourceType(type) {
    setSourceType(type)
    if (type === 'nacos2' || type === 'nacos') {
      form.setFieldsValue({
        nacosGroups: ["DEFAULT_GROUP"]
      });
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
        name='type'
        tooltip={t('serviceSource.serviceSourceForm.nameTooltip')}
      >
        <Select
          allowClear
          placeholder={t('serviceSource.serviceSourceForm.typePlaceholder')}
          onChange={(v) => selectServiceSourceType(v)}
        >
          <Option value="nacos2">nacos2.x</Option>
          <Option value="nacos">nacos</Option>
          <Option value="zookeeper">zookeeper</Option>
          {/* <Option value="consul">consul</Option>
          <Option value="eureka">eureka</Option> */}
        </Select>
      </Form.Item>
      <Form.Item
        label={t('serviceSource.serviceSourceForm.name')}
        required
        name='name'
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
          placeholder={t('serviceSource.serviceSourceForm.namePlaceholder')}
        />
      </Form.Item>
      <Form.Item
        label={t('serviceSource.serviceSourceForm.domain')}
        required
        name='domain'
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
        name='port'
        rules={[
          {
            required: true,
            message: t('serviceSource.serviceSourceForm.port'),
          },
        ]}
      >
        <Input
          allowClear
          placeholder={t('serviceSource.serviceSourceForm.portPlaceholder')}
        />
      </Form.Item>

      {
        sourceType === SourceType.Zookeeper ? (
          <div>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.zkServicesPath')}
              name='zkServicesPath'
              tooltip={t('serviceSource.serviceSourceForm.zkServicesPathTooltip')}
            >
              <Select
                allowClear
                mode="tags"
                placeholder={t('serviceSource.serviceSourceForm.zkServicesPathPlaceholder')}
                options={[]}
              />
            </Form.Item>
          </div>
        ) : (sourceType === SourceType.Nacos || sourceType === SourceType.Nacos2) ? (<div>
          <Form.Item
            label={t('serviceSource.serviceSourceForm.nacosNamespaceId')}
            name='nacosNamespaceId'
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
            name='nacosGroups'
          >
            <Select
              mode="tags"
              allowClear
              placeholder={t('serviceSource.serviceSourceForm.nacosGroupsPlaceholder')}
              options={[{ value: "DEFAULT_GROUP" }]}
            />
          </Form.Item>
        </div>) : sourceType === SourceType.Consul ? (
          <div>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.consulNamespace')}
              name='consulNamespace'
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
        ) : null
      }
    </Form>
  );
});

export default SourceForm;