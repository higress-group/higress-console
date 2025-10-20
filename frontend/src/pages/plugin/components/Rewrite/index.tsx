import { Form, Input, Select, Card, Switch, message } from 'antd';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';

import styles from './index.module.css';

const { Option } = Select;

const Rewrite = forwardRef((props, ref) => {
  const { data, t } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    const { path = {}, rewrite = {}, domains = [] } = data;
    form.setFieldsValue({
      origin: {
        matchType: path?.matchType || '',
        path: path?.matchValue || '',
      },
      new: {
        matchType: path?.matchType || '',
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

    if (enabled && !host && !newPath.path) {
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
      <Form name="basic" autoComplete="off" form={form} layout="horizontal">
        <Form.Item name="enabled" label={t('plugins.configForm.enableStatus')} valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          label={t('plugins.builtIns.rewrite.path')}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Form.Item
            label={t('plugins.builtIns.rewrite.originalPath')}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
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
          <Form.Item
            label={t('plugins.builtIns.rewrite.rewritePath')}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input.Group compact>
              <Form.Item name={['new', 'matchType']} noStyle>
                <Select disabled style={{ width: '40%' }} placeholder={t('route.routeForm.matchType')}>
                  <Option value="PRE">{t('plugins.builtIns.rewrite.rewriteType.PRE')}</Option>
                  <Option value="EQUAL">{t('plugins.builtIns.rewrite.rewriteType.EQUAL')}</Option>
                  <Option value="REGULAR">{t('plugins.builtIns.rewrite.rewriteType.REGULAR')}</Option>
                </Select>
              </Form.Item>
              <Form.Item name={['new', 'path']} noStyle>
                <Input style={{ width: '60%' }} placeholder={t('plugins.builtIns.rewrite.rewritePathPlaceholder')} maxLength={1024} />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={t('plugins.builtIns.rewrite.host')}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Form.Item
            label={t('plugins.builtIns.rewrite.originalHost')}
            name="origin_host"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={t('plugins.builtIns.rewrite.rewriteHost')}
            name="host"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input placeholder={t('plugins.builtIns.rewrite.rewriteHostPlaceholder')} maxLength={1024} />
          </Form.Item>
        </Form.Item>
      </Form>
    </div>
  );
});

export default Rewrite;
