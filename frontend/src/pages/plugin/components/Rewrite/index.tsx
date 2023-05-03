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
      message.error(t('plugins.builtIns.rewrite.missingParamError'));
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
        <Card title={t('plugins.configForm.enableStatus')}>
          <Form.Item name="enabled" label="" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>
        <Card title={t('plugins.builtIns.rewrite.path')}>
          <Form.Item label={t('plugins.builtIns.rewrite.originalPath')}>
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
          <Form.Item label={t('plugins.builtIns.rewrite.rewritePath')}>
            <Input.Group compact>
              <Form.Item name={['new', 'matchType']} noStyle>
                <Select disabled style={{ width: '40%' }} placeholder={t('route.routeForm.matchType')}>
                  <Option value="PRE">{t('plugins.builtIns.rewrite.rewriteType.PRE')}</Option>
                  <Option value="EQUAL">{t('plugins.builtIns.rewrite.rewriteType.EQUAL')}</Option>
                </Select>
              </Form.Item>
              <Form.Item name={['new', 'path']} noStyle>
                <Input style={{ width: '60%' }} placeholder={t('plugins.builtIns.rewrite.rewritePathPlaceholder')} maxLength={1024} />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Card>

        <Card title={t('plugins.builtIns.rewrite.host')}>
          <Form.Item label={t('plugins.builtIns.rewrite.originalHost')} name="origin_host">
            <Input disabled />
          </Form.Item>
          <Form.Item label={t('plugins.builtIns.rewrite.rewriteHost')} name="host">
            <Input placeholder={t('plugins.builtIns.rewrite.rewriteHostPlaceholder')} maxLength={1024} />
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
});

export default Rewrite;
