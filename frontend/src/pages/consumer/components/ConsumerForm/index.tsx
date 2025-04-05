import { CredentialType } from '@/interfaces/consumer';
import { MinusCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space, Tabs } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ConsumerForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { value } = props;
  const [form] = Form.useForm();
  const [activeTabKey, setActiveTabKey] = useState('');
  const [keyAuthCredentialSource, setKeyAuthCredentialSource] = useState();

  const credentialEnabledCheckers = {};
  credentialEnabledCheckers[CredentialType.KEY_AUTH] = c => true;

  useEffect(() => {
    let formValues: object | null = null
    let activeTabKey_ = '';
    if (value) {
      const credentials = {};
      if (value.credentials) {
        for (const credential of value.credentials) {
          credentials[credential.type] = credential;
          activeTabKey_ = activeTabKey_ || credential.type;
        }
      }
      formValues = Object.assign({}, value, { credentials });
    }
    formValues ? form.setFieldsValue(formValues) : form.resetFields();
    setActiveTabKey(activeTabKey_ || 'key-auth');
    setKeyAuthCredentialSource(form.getFieldValue(['credentials', CredentialType.KEY_AUTH, 'source']) || 'BEARER');
  }, [value]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields();
    },
    handleSubmit: async () => {
      const values = await form.validateFields();
      const credentials: any[] = [];
      for (const key in CredentialType) {
        const type = CredentialType[key];
        const credential = values.credentials[type];
        if (!credential) {
          continue;
        }
        credential.type = type;
        const checker = credentialEnabledCheckers[type];
        if (!checker || checker(credential)) {
          credentials.push(credential);
        }
      }
      values.credentials = credentials;
      return values;
    },
  }));

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      /* jslint bitwise: true */
      const r = Math.random() * 16 | 0;
      /* jslint bitwise: true */
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const randomizeKeyAuthToken = (i) => {
    const uuid = generateUUID();
    form.setFieldValue(['credentials', CredentialType.KEY_AUTH, 'values', i], uuid);
  }

  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        label={t('consumer.consumerForm.name')}
        required
        name="name"
        rules={[
          {
            required: true,
            message: t('consumer.consumerForm.nameRequired') || '',
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={63}
          disabled={value}
        />
      </Form.Item>
      <div>{t("consumer.columns.authMethods")}</div>
      <Tabs
        activeKey={activeTabKey}
        onChange={key => setActiveTabKey(key)}
        size="small"
        items={[
          {
            label: 'Key Auth',
            key: 'key-auth',
            children: (
              <>
                <Form.List
                  label={t("consumer.authToken") || ''} // "认证令牌"
                  name={['credentials', CredentialType.KEY_AUTH, 'values']}
                  initialValue={[null]}
                >
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => (
                        <Form.Item
                          required={false}
                          key={index}
                          style={{ marginBottom: '0.5rem' }}
                        >
                          <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[{ required: true, message: t("consumer.consumerForm.authTokenRequired") || '' }]}
                            noStyle
                          >
                            <Input style={{ width: '85%' }} />
                          </Form.Item>
                          <div style={{ display: "inline-block", width: '15%', textAlign: 'right' }}>
                            <Button
                              onClick={() => randomizeKeyAuthToken(index)}
                              title={t("consumer.randomGeneration") || ''}
                              icon={<ReloadOutlined />}
                              style={{ marginRight: '0.5rem' }}
                            />
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

                {/* 令牌来源 */}
                <Form.Item
                  label={t("consumer.tokenSource")}
                  name={['credentials', CredentialType.KEY_AUTH, 'source']}
                  rules={[{ required: true, message: t("consumer.consumerForm.tokenSourceRequired") || '' }]}
                >
                  <Select
                    onChange={e => { setKeyAuthCredentialSource(e); }}
                  >
                    {
                      [
                        { name: "BEARER", label: t("consumer.selectBEARER") }, // 对应 HTTP Header “Authorization: Bearer ${value}” 的传递方式
                        { name: "HEADER", label: t("consumer.selectHEADER") }, // HEADER：使用自定义 HTTP Header 来传递。Header 名称使用 key 来配置
                        { name: "QUERY", label: t("consumer.selectQUERY") }, // 使用查询参数来传递。参数名称使用 key 来配置
                      ].map((item) => (<Select.Option key={item.name} value={item.name}>{item.label} </Select.Option>))
                    }
                  </Select>
                </Form.Item>

                {
                  keyAuthCredentialSource === "HEADER" ?
                    // Header 名称
                    <Form.Item
                      key="HEADER_key"
                      label={t("consumer.headerName")}
                      name={['credentials', CredentialType.KEY_AUTH, 'key']}
                      rules={[{ required: true, message: t("consumer.consumerForm.headerNameRequired") || '' }]}
                    >
                      <Input.TextArea rows={1} style={{ width: "100%" }} />
                    </Form.Item>
                    : null
                }

                {
                  // 参数名称
                  keyAuthCredentialSource === "QUERY" ?
                    <Form.Item
                      key="QUERY_key"
                      label={t("consumer.paramName")}
                      name={['credentials', CredentialType.KEY_AUTH, 'key']}
                      rules={[{ required: true, message: t("consumer.consumerForm.paramNameRequired") || '' }]}
                    >
                      <Input.TextArea rows={1} style={{ width: "100%" }} />
                    </Form.Item>
                    : null
                }
              </>
            ),
          },
          {
            label: 'OAuth2',
            key: 'oauth2',
            children: (
              <>{t("misc.tbd")}</>
            ),
          },
          {
            label: 'JWT',
            key: 'jwt-auth',
            children: (
              <>{t("misc.tbd")}</>
            ),
          },
        ]}
      />
    </Form>
  );
});

export default ConsumerForm;
