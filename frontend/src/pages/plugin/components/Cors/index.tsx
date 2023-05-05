import { Checkbox, Form, Row, Col, Switch, Radio, InputNumber, Input } from 'antd';
import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const { TextArea } = Input;

const defaultCorsData = {
  enabled: false,
  maxAge: 86400,
  allowMethods: ['GET', 'PUT', 'POST', 'HEAD', 'DELETE', 'PATCH', 'OPTIONS'],
  exposeHeaders: ['*'],
  allowCredentials: 'true',
  allowOrigins: ['*'],
  allowHeaders: ['*'],
};

const Cors = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const data = props?.data || {};
  const [form] = Form.useForm();

  const list = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'];

  useEffect(() => {
    let initData = defaultCorsData;

    if (data?.cors.enabled !== null) {
      initData = data?.cors;
    }

    const { enabled, maxAge, allowMethods, exposeHeaders, allowCredentials, allowOrigins, allowHeaders } = initData;

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

  const onSubmit = async () => {
    await form.validateFields();
    const formData = form.getFieldsValue();

    return {
      cors: {
        enabled: !!formData.enabled,
        allowCredentials: !!formData.allowCredentials,
        allowHeaders: formData.allowHeaders ? formData.allowHeaders?.split(';') : null,
        allowMethods: formData.allowMethods?.length ? formData.allowMethods : null,
        allowOrigins: formData.allowOrigins?.length ? formData.allowOrigins?.split(';') : null,
        exposeHeaders: formData.exposeHeaders?.length ? formData.exposeHeaders?.split(';') : null,
        maxAge: formData?.maxAge || null,
      },
    };
  };

  useImperativeHandle(ref, () => ({
    submit: onSubmit,
  }));

  return (
    <div>
      <Form name="basic" form={form} autoComplete="off" layout="horizontal">
        <Form.Item label={t('plugins.configForm.enableStatus')} name="enabled" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item
          label={t('plugins.builtIns.cors.allowOrigins')}
          name="allowOrigins"
          rules={[{ required: true, message: t('plugins.builtIns.cors.allowOriginsRequired') || '' }]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label={t('plugins.builtIns.cors.allowMethods')}
          name="allowMethods"
          rules={[{ required: true, message: t('plugins.builtIns.cors.allowMethodsRequired') || '' }]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
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
          label={t('plugins.builtIns.cors.allowHeaders')}
          name="allowHeaders"
          rules={[{ required: true, message: t('plugins.builtIns.cors.allowHeadersRequired') || '' }]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label={t('plugins.builtIns.cors.exposeHeaders')}
          name="exposeHeaders"
          rules={[{ required: true, message: t('plugins.builtIns.cors.exposeHeadersRequired') || '' }]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label={t('plugins.builtIns.cors.allowCredentials')}
          name="allowCredentials"
          valuePropName="checked"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Radio.Group defaultValue="true">
            <Radio value="true">{t('plugins.builtIns.cors.allow')}</Radio>
            <Radio value="false">{t('plugins.builtIns.cors.disallow')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label={t('plugins.builtIns.cors.maxAge')}
          name="maxAge"
          rules={[{ required: true, message: t('plugins.builtIns.cors.maxAgeRequired') || '' }]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <InputNumber addonAfter={t('misc.seconds')} />
        </Form.Item>
      </Form>
    </div>
  );
});

export default Cors;
