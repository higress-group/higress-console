import { Checkbox, Form, Row, Col, Switch, Radio, InputNumber, Input } from 'antd';

import { useEffect } from 'react';

const { TextArea } = Input;

export default function Cors(props) {
  const { form, data } = props;

  const list = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'];

  useEffect(() => {
    const {
      enabled = false,
      maxAge = 1728000,
      allowMethods = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
      exposeHeaders = ['*'],
      allowCredentials = true,
      allowOrigins = ['*'],
      allowHeaders = [
        'DNT',
        'X-CustomHeader',
        'Keep-Alive',
        'User-Agent',
        'X-Requested-With',
        'If-Modified-Since',
        'Cache-Control',
        'Content-Type',
        'Authorization',
      ],
    } = data?.cors || {};

    form.setFieldsValue({
      allowOrigins: allowOrigins?.join(';') || '',
      allowHeaders: allowHeaders?.join(';') || '',
      allowMethods,
      exposeHeaders: exposeHeaders?.join(';') || '',
      allowCredentials,
      maxAge,
      enabled,
    });
  }, []);

  return (
    <div>
      <Form name="basic" form={form} autoComplete="off" layout="vertical">
        <Form.Item label="开启状态" name="enabled" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item
          label="允许的访问来源"
          name="allowOrigins"
          rules={[{ required: true, message: '请输入允许的访问来源' }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item label="允许的方法" name="allowMethods" rules={[{ required: true, message: '请输入允许的方法' }]}>
          <Checkbox.Group>
            <Row>
              {list.map((item) => {
                return (
                  <Col span={8} key={item}>
                    <Checkbox value={item} style={{ lineHeight: '32px' }}>
                      {item}
                    </Checkbox>
                  </Col>
                );
              })}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="允许的请求头部"
          name="allowHeaders"
          rules={[{ required: true, message: '请输入允许的请求头部' }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label="允许的响应头部"
          name="exposeHeaders"
          rules={[{ required: true, message: '请输入允许的响应头部' }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item label="允许携带凭证" name="allowCredentials">
          <Radio.Group defaultValue="false">
            <Radio value="true">允许</Radio>
            <Radio value="false">不允许</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="预检的过期时间" name="maxAge" rules={[{ required: true, message: '请输入预检的过期时间' }]}>
          <InputNumber addonAfter="秒" />
        </Form.Item>
      </Form>
    </div>
  );
}
