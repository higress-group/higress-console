import { Form, Select, Switch, InputNumber } from 'antd';
import { useEffect } from 'react';

const { Option } = Select;

export default function Retries(props) {
  const { form, data } = props;

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

  return (
    <div>
      <Form
        name="basic"
        initialValues={{ attempts: 3, retryOn: 'error' }}
        autoComplete="off"
        form={form}
        layout="vertical"
      >
        <Form.Item label="开启状态" name="enabled" valuePropName="checked">
          <Switch checked />
        </Form.Item>
        <Form.Item label="重试次数" name="attempts" rules={[{ required: true, message: '请输入你的重试次数!' }]}>
          <InputNumber style={{ width: '100%' }} max={3} />
        </Form.Item>
        <Form.Item label="重试条件" name="conditions" rules={[{ required: true, message: '请输入你的重试条件!' }]}>
          <Select mode="multiple">
            <Option value="error">error：建立连接失败</Option>
            <Option value="timeout"> timeout：建立连接超时</Option>
            <Option value="non_idempotent">non_idempotent：对于非幂等请求出错时进行重试</Option>
          </Select>
        </Form.Item>
        <Form.Item label="超时" name="timeout" rules={[{ required: true, message: '请输入你的超时时间!' }]}>
          <InputNumber style={{ width: '100%' }} max={600} addonAfter="秒" />
        </Form.Item>
      </Form>
    </div>
  );
}
