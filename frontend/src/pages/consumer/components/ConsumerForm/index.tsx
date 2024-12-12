import { Form, Input, Select, Tabs, Button, Row, Col } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ConsumerForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { value } = props;
  const [form] = Form.useForm();
  const [activeTabKey, setActiveTabKey] = useState('');
  const [creSource, setCreSource] = useState('BEARER');

  useEffect(() => {
    if (value) {
      const { name = "", credentials = [] } = value;
      if (name && credentials.length) {
        setActiveTabKey(credentials[0].type);
        setCreSource(credentials[0].source);
        form.setFieldsValue({ name, credentials });
      } else {
        form.resetFields();
        setActiveTabKey('key-auth');
      }
    } else {
      form.resetFields();
      setActiveTabKey('key-auth');
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields();
    },
    handleSubmit: async () => {
      const values = await form.validateFields();
      if (activeTabKey === "key-auth") {
        values["credentials"][0]["type"] = activeTabKey;
        return values;
      }

      return activeTabKey
    },
  }));

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0;
      let v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const setAuthValue = () => {
    const uuid = generateUUID();
    changeCredentials({ value: uuid });
  }

  const changeCredentials = (params) => {
    const oldData = form.getFieldValue("credentials");
    form.setFieldsValue({ credentials: [{ ...oldData[0], ...params }] });
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
            pattern: /^(?!-)[A-Za-z0-9-]{0,62}[A-Za-z0-9]$/,
            message: t('consumer.consumerForm.nameRequired'),
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={63}
          disabled={value}
          placeholder={t('consumer.consumerForm.namePlaceholder')}
        />
      </Form.Item>
      <div>{t("consumer.columns.credentialTypes")}</div>
      <Tabs
        activeKey={activeTabKey}
        onChange={key => setActiveTabKey(key)}
        size="small"
        items={[
          {
            label: 'Key Auth',
            key: 'key-auth',
            children: (
              <></>
            ),
          },
          {
            label: 'OAuth2',
            key: 'oauth2',
            children: (
              <>{t("consumer.underDevelopment")}</>
            ),
          },
          {
            label: 'JWT',
            key: 'jwt-auth',
            children: (
              <>{t("consumer.underDevelopment")}</>
            ),
          },
        ]}
      />
      {
        activeTabKey === "key-auth" ?
          <Form.List name="credentials" initialValue={[{ source: "BEARER" }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <>
                    <Row>
                      <Col span={20}>
                        <Form.Item
                          label={t("consumer.authenticationToken")} // "认证令牌"
                          name={[name, 'value']}
                          rules={[{ required: true, message: t("consumer.consumerForm.pleaseEnter") }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={4} style={{ paddingTop: 30, textAlign: "right" }}>
                        {/* 随机生成 */}
                        <Form.Item><Button onClick={setAuthValue}>{t("consumer.randomGeneration")}</Button></Form.Item>
                      </Col>
                    </Row>

                    {/* 令牌来源 */}
                    <Form.Item
                      label={t("consumer.tokenSource")}
                      name={[name, 'source']}
                      rules={[{ required: true, message: t("consumer.consumerForm.pleaseSelect") }]}
                    >
                      <Select
                        placeholder={t("consumer.consumerForm.pleaseSelect")}
                        onChange={e => {
                          setCreSource(e);
                          changeCredentials({ key: null });
                        }}
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
                      creSource === "HEADER" ?
                        // Header 名称
                        <Form.Item
                          key="HEADER_key"
                          label={t("consumer.headerName")}
                          name={[name, 'key']}
                          rules={[{ required: true, message: t("consumer.consumerForm.pleaseEnter") }]}
                        >
                          <Input.TextArea rows={1} style={{ width: "100%" }} />
                        </Form.Item>
                        : null
                    }

                    {
                      // 参数名称
                      creSource === "QUERY" ?
                        <Form.Item
                          key="QUERY_key"
                          label={t("consumer.paramsName")}
                          name={[name, 'key']}
                          rules={[{ required: true, message: t("consumer.consumerForm.pleaseEnter") }]}
                        >
                          <Input.TextArea rows={1} style={{ width: "100%" }} />
                        </Form.Item>
                        : null
                    }
                  </>
                ))}
              </>)
            }
          </Form.List>
          : null
      }
    </Form>
  );
});

export default ConsumerForm;
