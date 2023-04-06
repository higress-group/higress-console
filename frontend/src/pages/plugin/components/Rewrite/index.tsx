import { Form, Input, Select, Card, Row, Col, Switch, Button } from 'antd';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';

import styles from './index.module.css';

const { Option } = Select;

const Rewrite = forwardRef((props, ref) => {
  const { data, t } = props;

  const [form] = Form.useForm();

  const { path = {}, rewrite = {}, domains = [] } = data;
  useEffect(() => {
    form.setFieldsValue({
      origin: {
        matchType: path?.matchType || '',
        path: path?.matchValue || '',
      },
      new: {
        matchType: 'EQUAL',
        path: rewrite?.path || '',
      },
      origin_host: domains.length ? domains?.join(',') : '',
      host: rewrite?.host || '',
      enabled: !!rewrite?.enabled,
    });
  }, [data]);

  const onSubmit = async () => {
    await form.validateFields();
    const formData = form.getFieldsValue();
    const { enabled, host, new: newPath } = formData;
    return {
      rewrite: {
        enabled,
        path: newPath.path,
        host,
      },
    };
  };

  useImperativeHandle(ref, () => ({
    submit: onSubmit,
  }));

  return (
    <div className={styles.rewrite}>
      <Form name="basic" autoComplete="off" form={form} layout="vertical">
        <Card title="开启状态">
          <Form.Item name="enabled" label="" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>
        <Card title="路径(Path)">
          <Form.Item label="原路径(Path)">
            <Input.Group compact>
              <Form.Item name={['origin', 'matchType']} noStyle>
                <Select disabled style={{ width: '40%' }}>
                  <Option value="PRE">{t('route.matchTypes.PRE')}</Option>
                  <Option value="EQUAL">{t('route.matchTypes.EQUAL')}</Option>
                  <Option value="REGULAR">{t('route.matchTypes.REGULAR')}</Option>
                </Select>
              </Form.Item>
              <Form.Item name={['origin', 'path']} noStyle>
                <Input disabled style={{ width: '60%' }} placeholder="Path /a" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="重写路径(Path)">
            <Input.Group compact>
              <Form.Item
                name={['new', 'matchType']}
                noStyle
                rules={[{ required: true, message: '请输入重写路径(Path)' }]}
              >
                <Select style={{ width: '40%' }} placeholder={t('route.routeForm.matchType')}>
                  {/* <Option value="PRE">{t('route.matchTypes.PRE')}</Option> */}
                  <Option value="EQUAL">{t('route.matchTypes.EQUAL')}</Option>
                  {/* <Option value="REGULAR">{t('route.matchTypes.REGULAR')}</Option> */}
                </Select>
              </Form.Item>
              <Form.Item name={['new', 'path']} noStyle rules={[{ required: true, message: '请输入重写路径(Path)' }]}>
                <Input style={{ width: '60%' }} placeholder="Path /a" maxLength={1024} />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Card>

        <Card title="主机域(Host)">
          <Form.Item label="原主机域(Host)" name="origin_host">
            <Input disabled />
          </Form.Item>
          <Form.Item label="重写主机域(Host)" name="host" rules={[{ required: true, message: '请输入主机域(Host)' }]}>
            <Input placeholder="例如:example.com" maxLength={1024} />
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
});

export default Rewrite;
