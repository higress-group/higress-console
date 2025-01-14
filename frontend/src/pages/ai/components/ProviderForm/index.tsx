import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Select, Switch } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const providerTypeDisplayName = [
  { key: 'openai', label: 'llmProvider.providerTypes.openai' },
  { key: 'qwen', label: 'llmProvider.providerTypes.qwen' },
  { key: 'moonshot', label: 'llmProvider.providerTypes.moonshot' },
];

const protocolList = [
  { label: "openai/v1", value: "openai/v1" },
];

const ProviderForm: React.FC = forwardRef((props: { value: any }, ref) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [failoverEnabled, setFailoverEnabled] = useState(false);

  useEffect(() => {
    form.resetFields();
    if (props.value) {
      const {
        name,
        type,
        protocol,
        tokens,
        tokenFailoverConfig = {},
      } = props.value;
      const {
        failureThreshold,
        successThreshold,
        healthCheckInterval,
        healthCheckTimeout,
        healthCheckModel,
      } = tokenFailoverConfig ?? {};

      const localFailoverEnabled = !!tokenFailoverConfig?.enabled;
      setFailoverEnabled(localFailoverEnabled);
      form.setFieldsValue({
        name,
        type,
        protocol,
        tokens,
        failoverEnabled: localFailoverEnabled,
        failureThreshold: failureThreshold || 1,
        successThreshold: successThreshold || 1,
        healthCheckInterval: healthCheckInterval || 5000,
        healthCheckTimeout: healthCheckTimeout || 10000,
        healthCheckModel,
      })
    }

    return () => {
      setFailoverEnabled(false);
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
        version: 0,
        protocol: values.protocol,
        tokenFailoverConfig: {
          enabled: values.failoverEnabled,
          failureThreshold: values.failureThreshold,
          successThreshold: values.successThreshold,
          healthCheckInterval: values.healthCheckInterval,
          healthCheckTimeout: values.healthCheckTimeout,
          healthCheckModel: values.healthCheckModel,
        },
      };

      return result;
    },
  }));

  return (
    <Form
      form={form}
      layout="vertical"
    >
      {/* 大模型供应商 */}
      <Form.Item
        label={t('llmProvider.providerForm.label.type')}
        required
        name="type"
        rules={[
          {
            required: true,
            message: t('llmProvider.providerForm.rules.typeRequired'),
          },
        ]}
      >
        <Select
          disabled={props.value}
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

      {/* 服务名称 */}
      <Form.Item
        label={t('llmProvider.providerForm.label.serviceName')}
        required
        name="name"
        rules={[
          {
            required: true,
            message: t('llmProvider.providerForm.rules.serviceNameRequired'),
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={200}
          disabled={props.value}
        />
      </Form.Item>

      {/* 协议 */}
      <Form.Item
        label={t('llmProvider.providerForm.label.protocol')}
        required
        name="protocol"
        initialValue={protocolList[0].value}
      >
        <Select
          placeholder={t('llmProvider.providerForm.rules.protocol')}
        >
          {protocolList.map(item => (
            <Select.Option value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* 凭证 */}
      <Form.List name="tokens" initialValue={[null]}>
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
                style={{ marginBottom: '0.5rem' }}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: false,
                      message: t('llmProvider.providerForm.rules.tokenRequired'),
                    },
                  ]}
                  noStyle
                >
                  <Input
                    style={{ width: '94%' }}
                  />
                </Form.Item>
                {/* 删除按钮 */}
                <div style={{ display: "inline-block", width: '6%', textAlign: 'right' }}>
                  <Button
                    type="dashed"
                    disabled={!(fields.length > 1)}
                    onClick={() => remove(field.name)}
                    icon={<MinusCircleOutlined />}
                  />
                </div>
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

      {/* 令牌降级 */}
      <Form.Item
        name="failoverEnabled"
        initialValue={false}
        label={t('llmProvider.providerForm.label.failoverEnabled')}
        valuePropName="checked"
        extra={t('llmProvider.providerForm.label.failoverEnabledExtra')}
      >
        <Switch onChange={e => setFailoverEnabled(e)} />
      </Form.Item>

      {
        failoverEnabled ?
          <>
            {/* 令牌不可用时需满足的最小连续请求失败次数 */}
            <Form.Item
              name="failureThreshold"
              label={t('llmProvider.providerForm.label.failureThreshold')}
              rules={[
                { required: true, message: t("llmProvider.providerForm.rules.failureThresholdRequired") },
              ]}
              initialValue={1}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            {/* 令牌可用时需满足的最小连续健康检测成功次数 */}
            <Form.Item
              name="successThreshold"
              label={t('llmProvider.providerForm.label.successThreshold')}
              rules={[
                { required: true, message: t("llmProvider.providerForm.rules.successThresholdRequired") },
              ]}
              initialValue={1}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            {/* 健康检测请求发起间隔 */}
            <Form.Item
              name="healthCheckInterval"
              label={t('llmProvider.providerForm.label.healthCheckInterval')}
              rules={[
                { required: true, message: t("llmProvider.providerForm.rules.healthCheckIntervalRequired") },
              ]}
              initialValue={5000}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            {/* 健康检测请求超时时间 */}
            <Form.Item
              name="healthCheckTimeout"
              label={t('llmProvider.providerForm.label.healthCheckTimeout')}
              rules={[
                { required: true, message: t("llmProvider.providerForm.rules.healthCheckTimeoutRequired") },
              ]}
              initialValue={10000}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            {/* 健康检测请求使用的模型名称 */}
            <Form.Item
              name="healthCheckModel"
              label={t('llmProvider.providerForm.label.healthCheckModel')}
              rules={[
                { required: true, message: t("llmProvider.providerForm.rules.healthCheckModelRequired") },
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
