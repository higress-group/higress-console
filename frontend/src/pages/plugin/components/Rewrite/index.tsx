import { Form, Input, Select, Card, Switch, message } from 'antd';
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
        // 精确匹配->精确重写
        // 正则匹配->精确重写
        // 前缀匹配->前缀重写
        matchType: path?.matchType === 'PRE' ? 'PRE' : 'EQUAL',
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

    if (!host && !newPath.path) {
      message.error('重写path和重写主机域必须要至少填一个');
      return;
    }
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
                  {/* <Option value="PRE">前缀重写</Option>
                  <Option value="EQUAL">精确重写</Option>
                  <Option value="REGULAR">正则重写</Option> */}
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
              <Form.Item name={['new', 'matchType']} noStyle>
                <Select disabled style={{ width: '40%' }} placeholder={t('route.routeForm.matchType')}>
                  <Option value="PRE">前缀重写</Option>
                  <Option value="EQUAL">精确重写</Option>
                </Select>
              </Form.Item>
              <Form.Item name={['new', 'path']} noStyle>
                <Input style={{ width: '60%' }} placeholder="Path /a" maxLength={1024} />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Card>

        <Card title="主机域(Host)">
          <Form.Item label="原主机域(Host)" name="origin_host">
            <Input disabled />
          </Form.Item>
          <Form.Item label="重写主机域(Host)" name="host">
            <Input placeholder="例如:example.com" maxLength={1024} />
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
});

export default Rewrite;
