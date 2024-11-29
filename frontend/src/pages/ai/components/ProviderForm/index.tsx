import { ServiceSourceTypes } from '@/interfaces/service-source';
import { Form, Input, Select, Tabs, Button, Switch, InputNumber } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const providerTypeDisplayName = [
  { key: 'openai', label: 'llmProvider.providerTypes.openai' },
  { key: 'qwen', label: 'llmProvider.providerTypes.qwen' },
  { key: 'moonshot', label: 'llmProvider.providerTypes.moonshot' },
];

const ProviderForm: React.FC = forwardRef((props: { value: any }, ref) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    form.resetFields();
    if (props.value) {
      const {
        name,
        type,
        protocol,
        tokens,
        modelMapping = {},
        tokenFailoverConfig = {},
      } = props.value;
      const {
        failureThreshold,
        successThreshold,
        healthCheckInterval,
        healthCheckTimeout,
        healthCheckModel,
      } = tokenFailoverConfig ?? {};

      setEnabled(tokenFailoverConfig?.enabled || false);
      form.setFieldsValue({
        name,
        type,
        protocol,
        tokens,
        modelMapping: getModelText(modelMapping),
        enabled,
        failureThreshold,
        successThreshold,
        healthCheckInterval,
        healthCheckTimeout,
        healthCheckModel,
      })
    }

    return () => {
      setEnabled(false);
    }
  }, [props.value]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields();
    },
    handleSubmit: async () => {
      const values = await form.validateFields();

      const result = {
        type: values.type,
        name: values.name,
        tokens: values.tokens,
        version: 0, // 资源版本号。进行创建或强制更新操作时需设置为 0。 /  1 表示强制更新
        protocol: values.protocol,
        modelMapping: getModelMapping(values.modelMapping),
        tokenFailoverConfig: {
          enabled: values.enabled,
        },
      }

      if (values.enabled) {
        result.tokenFailoverConfig['failureThreshold'] = values.failureThreshold;
        result.tokenFailoverConfig['successThreshold'] = values.successThreshold;
        result.tokenFailoverConfig['healthCheckInterval'] = values.healthCheckInterval;
        result.tokenFailoverConfig['healthCheckTimeout'] = values.healthCheckTimeout;
        result.tokenFailoverConfig['healthCheckModel'] = values.healthCheckModel;
      }

      return result;
    },
  }));


  const getModelMapping = (text) => {
    try {
      const lines = text.split('\n');
      const result = {};

      lines.forEach(line => {
        const [key, value] = line.split('=');
        result[key.trim()] = value.trim();
      });

      return result;
    } catch (err) {
      return {}
    }
  };

  const getModelText = (text) => {
    try {
      return Object.entries(text).map(([key, value]) => `${key}=${value}`).join('\n');
    } catch (err) {
      return JSON.stringify(err)
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
    >
      {/* 类型 */}
      <Form.Item
        label={t('llmProvider.providerForm.label.type')}
        required
        name="type"
        rules={[
          {
            required: true,
            message: t('llmProvider.providerForm.placeholder.type'),
          },
        ]}
      >
        <Select
          placeholder={t('llmProvider.providerForm.placeholder.type')}
        >
          {
            providerTypeDisplayName.map((item) => {
              return (
                <Select.Option
                  key={item.key}
                  value={item.key}
                >
                  {t(item.label)}
                </Select.Option>
              )
            })
          }
        </Select>
      </Form.Item>

      {/* 名称 */}
      <Form.Item
        label={t('llmProvider.providerForm.label.name')}
        required
        name="name"
        rules={[
          {
            required: true,
            message: t('llmProvider.providerForm.placeholder.name'),
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={200}
          disabled={props.value}
          placeholder={t('llmProvider.providerForm.rules.name')}
        />
      </Form.Item>

      {/* 类型 */}
      <Form.Item
        label={"面向调用者的接口协议"}
        required
        name="protocol"
        initialValue="openai/v1"
      >
        <Select
          allowClear
          placeholder={"面向调用者的接口协议"}
        >
          <Select.Option value="openai/v1">
            openai/v1
          </Select.Option>
        </Select>
      </Form.Item>

      {/* 认证令牌 */}
      <Form.List name="tokens">
        {(fields, { add, remove }, { errors }) => (
          <>
            {!fields.length ?
              <div
                style={{ marginBottom: '8px' }}
              >
                {t('llmProvider.columns.tokens')}
              </div> : null
            }

            {fields.map((field, index) => (
              <Form.Item
                label={index === 0 ? t('llmProvider.columns.tokens') : ''}
                required={false}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: false,
                      message: "请输入认证令牌",
                    },
                  ]}
                  noStyle
                >
                  <Input
                    style={{ width: '90%' }}
                    placeholder={t('llmProvider.providerForm.placeholder.tokens')}
                  />
                </Form.Item>
                {/* 删除按钮 */}
                {fields.length > 1 ?
                  (<Button
                    type="dashed"
                    onClick={() => remove(field.name)}
                    icon={<MinusCircleOutlined />}
                  />) :
                  null}
              </Form.Item>
            ))}

            {/* 添加按钮 */}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              />
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* 模型映射 */}
      <Form.Item
        name="modelMapping"
        label="模型映射"
      >
        <Input.TextArea
          placeholder={`配置请求模型与目标模型的映射关系，示例如下:
gpt-3=qwen-turbo
gpt-*=qwen-max
*=qwen-long`
          }
          rows={4}
        />
      </Form.Item>

      {/* 令牌降级 */}
      <Form.Item
        name="enabled"
        label="令牌降级"
        valuePropName="checked"
        extra="启用后，若某一认证令牌返回异常响应的数量超出网值，Higress 将暂停使用该令牌发起请求，直至后续健康检测请求连续收到一定数量的正常响应。"
      >
        <Switch onChange={e => setEnabled(e)} />
      </Form.Item>

      {
        enabled ?
          <>
            {/* 令牌不可用时需满足的最小连续请求失败次数 */}
            <Form.Item
              name="failureThreshold"
              label="令牌不可用时需满足的最小连续请求失败次数"
              rules={[
                { required: true, message: "请输入" },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            {/* 令牌可用时需满足的最小连续健康检测成功次数 */}
            <Form.Item
              name="successThreshold"
              label="令牌可用时需满足的最小连续健康检测成功次数"
              rules={[
                { required: true, message: "请输入" },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            {/* 健康检测请求发起间隔 */}
            <Form.Item
              name="healthCheckInterval"
              label="健康检测请求发起间隔(ms)"
              rules={[
                { required: true, message: "请输入" },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            {/* 健康检测请求超时时间 */}
            <Form.Item
              name="healthCheckTimeout"
              label="健康检测请求超时时间(ms)"
              rules={[
                { required: true, message: "请输入" },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            {/* 健康检测请求使用的模型名称 */}
            <Form.Item
              name="healthCheckModel"
              label="健康检测请求使用的模型名称"
              rules={[
                { required: true, message: "请输入" },
              ]}
            >
              <Input />
            </Form.Item>
          </>
          : null
      }

    </Form>
  );
});

export default ProviderForm;
