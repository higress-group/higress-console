import { Form, Select, Switch, InputNumber } from 'antd';
import { useEffect, forwardRef, useImperativeHandle, useTransition } from 'react';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const Retries = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const data = props?.data || {};
  const [form] = Form.useForm();

  useEffect(() => {
    const {
      attempts = 3,
      conditions = ['error', 'timeout'],
      enabled = false,
      timeout = 5,
    } = data.proxyNextUpstream || {};

    form.setFieldsValue({
      attempts,
      conditions,
      enabled,
      timeout,
    });
  }, []);

  const onSubmit = async () => {
    await form.validateFields();
    const formData = form.getFieldsValue();
    return {
      proxyNextUpstream: formData,
    };
  };

  useImperativeHandle(ref, () => ({
    submit: onSubmit,
  }));

  return (
    <div>
      <Form
        name="basic"
        initialValues={{ attempts: 3, retryOn: 'error' }}
        autoComplete="off"
        form={form}
        layout="horizontal"
      >
        <Form.Item
          label={t('plugins.configForm.enableStatus')}
          name="enabled"
          valuePropName="checked"
        >
          <Switch checked />
        </Form.Item>
        <Form.Item
          label={t('plugins.builtIns.retries.attempts')}
          name="attempts"
          rules={[{ required: true, message: t('plugins.builtIns.retries.attemptsRequired') || '' }]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <InputNumber style={{ width: '100%' }} max={3} />
        </Form.Item>
        <Form.Item
          label={t('plugins.builtIns.retries.conditions')}
          name="conditions"
          rules={[{ required: true, message: t('plugins.builtIns.retries.conditionsRequired') || '' }]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Select mode="multiple">
            <Option value="error">{t('plugins.builtIns.retries.condition.error')}</Option>
            <Option value="timeout">{t('plugins.builtIns.retries.condition.timeout')}</Option>
            <Option value="non_idempotent">{t('plugins.builtIns.retries.condition.non_idempotent')}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={t('plugins.builtIns.retries.timeout')}
          name="timeout"
          rules={[{ required: true, message: t('plugins.builtIns.retries.timeoutRequired') || '' }]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <InputNumber style={{ width: '100%' }} min={1} max={600} addonAfter="秒" />
        </Form.Item>
      </Form>
    </div>
  );
});

export default Retries;
