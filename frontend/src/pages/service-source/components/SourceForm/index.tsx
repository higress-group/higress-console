import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Input, Select } from 'antd';

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


  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        label="注册中心类型"
        required
        name='type'
        tooltip="注册中心类型，可选项：nacos,nacos2,zookeeper,consul,eureka"
      >
        <Select
          allowClear
          placeholder="请选择类型"
          onChange={(v) => setSourceType(v)}
        >
          <Option value="nacos2">nacos2</Option>
          <Option value="nacos">nacos</Option>
          <Option value="zookeeper">zookeeper</Option>
          <Option value="consul">consul</Option>
          <Option value="eureka">eureka</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="服务来源名称"
        required
        name='name'
        rules={[
          {
            required: true,
            message: '支持大小写字母、数字、下划线（_）、短划线（-）和星号（*），不超过256个字符。',
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={256}
          placeholder="支持大小写字母、数字、下划线（_）、短划线（-）和星号（*），不超过256个字符。"
        />
      </Form.Item>
      <Form.Item
        label="注册中心地址"
        required
        name='domain'
        tooltip="注册中心地址，可以是ip或域名"
        rules={[
          {
            required: true,
            message: '注册中心地址，可以是ip或域名',
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={256}
          placeholder="支持大小写字母、数字、下划线（_）、短划线（-）和星号（*），不超过256个字符。"
        />
      </Form.Item>
      <Form.Item
        label="注册中心访问端口"
        required
        name='port'
        rules={[
          {
            required: true,
            message: '注册中心访问端口',
          },
        ]}
      >
        <Input
          allowClear
          placeholder="注册中心访问端口"
        />
      </Form.Item>

      {
        sourceType === SourceType.Zookeeper ? (
          <div>
            <Form.Item
              label="服务注册根路径"
              name='zkServicesPath'
              tooltip="使用zk时,填写服务注册的根路径,默认监听 /dubbo 和 /services，前者为dubbo 服务默认根路径，后者为SpringCloud服务默认根路径"
            >
              <Select
                allowClear
                mode="tags"
                placeholder="默认监听 /dubbo 和 /services，前者为dubbo 服务默认根路径，后者为SpringCloud服务默认根路径"
                options={[]}
              />
            </Form.Item>
          </div>
        ) : (sourceType === SourceType.Nacos || sourceType === SourceType.Nacos2) ? (<div>
          <Form.Item
            label="nacos命名空间id"
            name='nacosNamespaceId'
          >
            <Input
              showCount
              allowClear
              maxLength={256}
              placeholder="支持大小写字母、数字、下划线（_）、短划线（-）和星号（*），不超过256个字符。"
            />
          </Form.Item>
          <Form.Item
            label="nacos服务分组列表"
            name='nacosGroups'
          >
            <Select
              mode="tags"
              allowClear
              options={[{ value: "DEFAULT_GROUP" }]}
            />
          </Form.Item>
        </div>) : sourceType === SourceType.Consul ? (
          <div>
            <Form.Item
              label="命名空间"
              name='consulNamespace'
              tooltip="使用consul时需要填写命名空间"
            >
              <Input
                showCount
                allowClear
                maxLength={256}
                placeholder="consul命名空间"
              />
            </Form.Item>
          </div>
        ) : null
      }
    </Form>
  );
});

export default SourceForm;