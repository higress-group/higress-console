import { Form, Input, Select, Switch, Button, Space, InputNumber, Table } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { LlmProvider } from '@/interfaces/llm-provider';
import { getLlmProviders } from '@/services/llm-provider';
import { Domain } from '@/interfaces/domain';
import { getConsumers } from '@/services/consumer';
import { Consumer } from '@/interfaces/consumer';
import { useRequest } from 'ahooks';
import { getGatewayDomains } from '@/services';
import { RedoOutlinedBtn, HistoryButton } from './Components';

const ConsumerForm: React.FC = forwardRef((props: { value: any }, ref) => {
  const { t } = useTranslation();
  const { value } = props;
  const [form] = Form.useForm();
  const [fallbackConfig_enabled, setFallbackConfigEnabled] = useState(false);
  const [authConfig_enabled, setAuthConfigEnabled] = useState(false);
  const [upstreamsError, setUpstreamsError] = useState<any>(false); // 目标AI服务错误提示
  const [modelService, setModelService] = useState('Proportion');

  const [llmList, setLlmList] = useState<LlmProvider[]>([]);
  const llmResult = useRequest(getLlmProviders, {
    manual: true,
    onSuccess: (result) => {
      const llmProviders = (result || []) as LlmProvider[];
      llmProviders.sort((i1, i2) => {
        return i1.name.localeCompare(i2.name);
      })
      setLlmList(llmProviders);
    },
  });

  const [consumerList, setConsumerList] = useState<Consumer[]>([]);
  const consumerResult = useRequest(getConsumers, {
    manual: true,
    onSuccess: (result) => {
      const consumers = (result || []) as Consumer[];
      setConsumerList(consumers);
    },
  });

  const [domainsList, setDomainsList] = useState<Domain[]>([]);
  const domainsResult = useRequest(getGatewayDomains, {
    manual: true,
    onSuccess: (result) => {
      const consumers = (result || []) as Domain[];
      setDomainsList(consumers);
    },
  });

  useEffect(() => {
    llmResult.run();
    consumerResult.run();
    domainsResult.run();
    form.resetFields();

    if (value) initForm();

    return () => {
      setAuthConfigEnabled(false);
      setFallbackConfigEnabled(false);
    }
  }, []);

  const initForm = () => {
    const { name = "", domains, upstreams = [], modelPredicates } = value;

    const _authConfig_enabled = value?.authConfig?.enabled || false;
    const _fallbackConfig_enabled = value?.fallbackConfig?.enabled || false;

    setAuthConfigEnabled(_authConfig_enabled);
    setFallbackConfigEnabled(_fallbackConfig_enabled);
    const initValues = {
      name,
      domains: domains?.length ? domains[0] : [],
      upstreams,
      authConfig_enabled: _authConfig_enabled,
      authConfig_allowedConsumers: value?.authConfig?.allowedConsumers || "",
      fallbackConfig_enabled: _fallbackConfig_enabled,
      fallbackConfig_upstreams: value?.fallbackConfig?.upstreams ? value?.fallbackConfig?.upstreams[0].provider : undefined,
      fallbackConfig_strategy: value?.fallbackConfig?.strategy,
    };

    if (modelPredicates) {
      setModelService("ModelName");
      initValues["modelPredicates"] = modelPredicates.map(item => ({
        ...item,
        provider: upstreams[0].provider,
      }));
    } else {
      setModelService("Proportion");
      initValues["upstreams"] = upstreams.map((item) => {
        let obj = {
          provider: item.provider,
          weight: item.weight,
        };
        if (item.modelMapping) {
          const _modelMapping = Object.keys(item.modelMapping);
          obj["modelMapping"] = _modelMapping
        }
        return obj;
      });
    }

    form.setFieldsValue(initValues);
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields();
    },
    handleSubmit: async () => {
      const values = await form.validateFields();
      const { upstreams = [] } = values;

      if (modelService === "Proportion") {
        if (!upstreams?.length) {
          setUpstreamsError("aiName");
          return false;
        }

        // 判断 AI 服务权重相加是否等于 100
        const sumWeights: any = upstreams.reduce((accumulator, currentObject) => {
          return parseInt(accumulator, 10) + parseInt(currentObject.weight, 10);
        }, 0)

        if (sumWeights !== 100) {
          setUpstreamsError('weight');
          return false;
        }
      }

      setUpstreamsError(false);

      const {
        name,
        domains,
        fallbackConfig_upstreams = '',
        fallbackConfig_strategy = '',
        authConfig_allowedConsumers = '',
        modelPredicates = [],
      } = values;

      const isProportion = modelService === "Proportion";
      const payload = {
        name,
        domains: domains ? [domains] : [],
        fallbackConfig: {
          enabled: fallbackConfig_enabled,
        },
        authConfig: {
          enabled: authConfig_enabled,
        },
      }

      if (isProportion) {
        payload["upstreams"] = upstreams.map(({ provider, weight, modelMapping }) => {
          const obj = { provider, weight, modelMapping: {} };
          if (modelMapping) {
            obj["modelMapping"][modelMapping] = provider;
          }
          return obj;
        });
      } else {
        payload["upstreams"] = modelPredicates.map(({ provider }) => ({ provider, weight: 100 }));
        payload["modelPredicates"] = modelPredicates.map(({ matchType, matchValue }) => ({ matchType, matchValue }));
      }

      if (fallbackConfig_enabled) {
        payload['fallbackConfig']['upstreams'] = fallbackConfig_upstreams ? [{ provider: fallbackConfig_upstreams }] : [];
        payload['fallbackConfig']['strategy'] = fallbackConfig_strategy;
      }

      if (authConfig_enabled) {
        payload['authConfig']['consuallowedConsumersmer'] = authConfig_allowedConsumers ? [authConfig_allowedConsumers] : [];
      }

      return payload;
    },
  }));

  return (
    <Form
      form={form}
      layout="vertical"
    >
      {/* 名称 */}
      <Form.Item
        label={t('llmProvider.providerForm.label.name')}
        required
        name="name"
        rules={[
          {
            required: true,
            pattern: /^(?!-)[A-Za-z0-9-]{0,63}[A-Za-z0-9]$/,
            message: t('serviceSource.serviceSourceForm.nameRequired'),
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={63}
          disabled={value}
          placeholder={t('llmProvider.providerForm.rules.name')}
        />
      </Form.Item>

      {/* 域名 */}
      <div style={{ display: 'flex' }}>
        <Form.Item
          style={{ flex: 1, marginRight: '8px' }}
          label={t("llmProvider.providerForm.label.domain")}
          name="domains"
          extra={(<HistoryButton text={t("llmProvider.providerForm.creatDomain")} path={"/domain"} />)}
        >
          <Select
            allowClear
            placeholder={t("serviceSource.serviceSourceForm.domainRequired")}
          >
            { domainsList.map((item) => {
              return (
                <Select.Option
                  key={item.name}
                  value={item.name}
                >
                  {item.name}
                </Select.Option>
              )
            })
            }
          </Select>
        </Form.Item>
        <RedoOutlinedBtn getList={domainsResult} />
      </div>

      {/* 选择模型服务 */}
      <Form.Item
        style={{ marginBottom: 10 }}
        label={t("llmProvider.selectModelName")}
        tooltip={modelService === "ModelName" ? "请求 body 中的 model 参数" : null}
      >
        <Select
          onChange={async (e) => {
            await form.resetFields(["upstreams"]);
            setModelService(e);
          }}
          value={modelService}
          allowClear
          style={{ width: "100%", marginBottom: 10 }}
        >
          <Select.Option value="Proportion">{/* 按比例 */}{t("llmProvider.modelProportion")}</Select.Option>
          <Select.Option value="ModelName">{/* 按模型名称 */}{t("llmProvider.modelName")}</Select.Option>
        </Select>
      </Form.Item>

      {
        modelService === "ModelName" ?
          <>
            {/* 基于模型的路由匹配规则 */}
            <Form.List name="modelPredicates" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => {
                    return (
                      <>
                        <Table
                          size="small"
                          dataSource={[{}]}
                          columns={[
                            {
                              title: t('route.factorGroup.columns.key'),
                              dataIndex: 'key',
                              render: () => (<Form.Item><Input style={{ width: 100 }} readOnly value="model" /></Form.Item>),
                            },
                            {
                              title: "模型匹配方式",
                              dataIndex: 'matchValue',
                              render: () => (
                                <Form.Item name={[name, 'matchType']} rules={[{ required: true, message: "请选择模型匹配方式" }]}>
                                  <Select style={{ width: "200px" }} placeholder={"请选择模型匹配方式"}>
                                    {
                                      [
                                        { name: "EQUAL", label: "精确匹配" },
                                        { name: "PRE", label: "前缀匹配" },
                                      ].map((item) => {
                                        return (
                                          <Select.Option key={item.name} value={item.name}>
                                            {item.label}
                                          </Select.Option>
                                        )
                                      })
                                    }
                                  </Select>
                                </Form.Item>),
                            },
                            {
                              title: "模型名称",
                              dataIndex: 'matchType',
                              render: () => (
                                <Form.Item
                                  {...restField}
                                  name={[name, 'matchValue']}
                                  rules={[{ required: true, message: "模型名称" }]}
                                >
                                  <Input.TextArea style={{ width: "200px" }} placeholder={"请输入或选择模型名称"} rows={1} />
                                </Form.Item>),
                            },
                          ]}
                          bordered={false}
                          pagination={false}
                        />
                        {/* 目标AI服务 */}
                        <Form.Item
                          {...restField}
                          style={{ marginTop: 10 }}
                          label={t('llmProvider.providerForm.label.aiName')}
                          name={[name, 'provider']}
                          rules={[
                            { required: true, message: t('llmProvider.providerForm.placeholder.aiName') },
                          ]}
                        >
                          <Select style={{ width: "100%" }} placeholder={t('llmProvider.providerForm.placeholder.aiName')}>
                            { llmList.map((item) => (
                              <Select.Option key={item.name} value={item.name}>
                                {item.name}
                              </Select.Option>
                            ))
                            }
                          </Select>
                        </Form.Item>
                      </>
                    )
                  })}
                </>)
              }
            </Form.List>
          </> :
          <>
            {/* 目标AI服务 upstreams */}
            <Form.Item
              style={{ marginBottom: 8 }}
              label={t('llmProvider.providerForm.label.aiName')}
              hasFeedback={upstreamsError}
              validateStatus={upstreamsError ? "error" : ''}
              help={upstreamsError ? t(`llmProvider.providerForm.placeholder.${upstreamsError}`) : null}
              extra={(<HistoryButton text={t('llmProvider.providerForm.label.aiNameExtra')} path={"/ai/provider"} />)}
            >
              <Form.List name="upstreams" initialValue={[null]}>
                {(fields, { add, remove }) => {
                  const baseStyle = { width: 190 };
                  const requiredStyle = {
                    display: "inline-block",
                    marginRight: "4px",
                    color: "#ff4d4f",
                    fontFamily: "SimSun, sans-serif",
                  };

                  return (
                    <>
                      <Space style={{ display: 'flex', color: "#808080" }} align="start">
                        <div style={{ ...baseStyle }}><span style={requiredStyle}>*</span>服务名称</div>
                        <div style={{ ...baseStyle }}><span style={requiredStyle}>*</span>请求比例</div>
                        <div style={{ ...baseStyle }}>目标模型</div>
                      </Space>

                      {fields.map(({ key, name, ...restField }, index) => (
                        <Space key={key} style={{ display: 'flex' }} align="start">
                          {/* 服务名称 */}
                          <Form.Item
                            {...restField}
                            name={[name, 'provider']}
                            rules={[
                              {
                                required: true,
                                message: t('llmProvider.providerForm.placeholder.aiName'),
                              },
                            ]}
                          >
                            <Select style={{ ...baseStyle }} placeholder={t('llmProvider.providerForm.placeholder.aiName')}>
                              { llmList.map((item) => {
                                const selectArr = form.getFieldValue('upstreams').map(i => i && i.provider) || [];
                                return (
                                  <Select.Option
                                    key={item.name}
                                    value={item.name}
                                    disabled={!!selectArr.includes(item.name)}
                                  >
                                    {item.name}
                                  </Select.Option>
                                )
                              })
                              }
                            </Select>
                          </Form.Item>

                          {/* 请求比例 */}
                          <Form.Item
                            {...restField}
                            name={[name, 'weight']}
                            rules={[
                              { required: true, message: t('llmProvider.providerForm.label.weight') },
                            ]}
                          >
                            <InputNumber
                              style={{ ...baseStyle }}
                              min={0}
                              max={100}
                              addonAfter="%"
                              placeholder={t('llmProvider.providerForm.label.weight')}
                            />
                          </Form.Item>

                          {/* 模型名称 */}
                          <Form.Item {...restField} name={[name, 'modelMapping']}>
                            <Input.TextArea style={{ ...baseStyle }} placeholder={"请输入模型名称"} rows={1} />
                          </Form.Item>

                          <Form.Item>
                            {index ? <MinusCircleOutlined onClick={() => remove(name)} /> : null}
                          </Form.Item>
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          block
                          icon={<PlusOutlined />}
                          onClick={async () => {
                            await form.validateFields();
                            add()
                          }}
                        >
                          {/* 添加目标AI服务 */}{t("llmProvider.addTargetAIservice")}
                        </Button>
                      </Form.Item>
                    </>
                  )
                }}
              </Form.List>
            </Form.Item>
          </>
      }
      <Form.Item
        name="fallbackConfig_enabled"
        label={t('llmProvider.providerForm.label.fallbackConfig')}
        valuePropName="checked"
        initialValue={false}
        extra={t('llmProvider.providerForm.label.fallbackConfigExtra')}
      >{/* 降级服务 */}
        <Switch onChange={e => {
          setFallbackConfigEnabled(e)
          form.resetFields(["fallbackConfig_upstreams", "fallbackConfig_strategy"])
        }}
        />
      </Form.Item>

      {
        fallbackConfig_enabled ?
          <>
            <div style={{ display: 'flex' }}>{/* 降级服务列表 */}
              <Form.Item
                style={{ flex: 1, marginRight: '8px' }}
                label={t('llmProvider.providerForm.label.fallbackConfigList')}
                required
                name="fallbackConfig_upstreams"
                rules={[
                  { required: true, message: t('llmProvider.providerForm.placeholder.fallbackConfigList') },
                ]}
              >
                <Select allowClear placeholder={t('llmProvider.providerForm.placeholder.fallbackConfigList')}>
                  { llmList.map((item) => (
                    <Select.Option key={item.name} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))
                  }
                </Select>
              </Form.Item>

              <RedoOutlinedBtn getList={llmResult} />
            </div>

            {/* 路由降级策略 */}
            <Form.Item
              style={{ flex: 1, marginRight: '8px' }}
              label={t('llmProvider.providerForm.label.routeStrategy')}
              required
              name="fallbackConfig_strategy"
              initialValue={"RAND"}
              rules={[
                {
                  required: true,
                  message: t('llmProvider.providerForm.label.routeStrategy'),
                },
              ]}
            >
              <Select allowClear placeholder={t('llmProvider.providerForm.label.routeStrategy')}>
                <Select.Option value={'RAND'}>{t('llmProvider.providerForm.label.routeStrategy1')}</Select.Option>
                <Select.Option value={'SEQ'}>{t('llmProvider.providerForm.label.routeStrategy')}</Select.Option>
              </Select>
            </Form.Item>
          </>
          : null
      }

      {/* 请求认证设置 */}
      <Form.Item
        name="authConfig_enabled"
        label={t('llmProvider.providerForm.label.authConfig')}
        valuePropName="checked"
        initialValue={false}
        extra={t('llmProvider.providerForm.label.authConfigExtra')}
      >
        <Switch onChange={e => {
          setAuthConfigEnabled(e)
          form.resetFields(["authConfig_allowedConsumers"])
        }}
        />
      </Form.Item>

      {authConfig_enabled ? // 允许请求本路由的消费者名称列表
        <div style={{ display: 'flex' }}>
          <Form.Item
            style={{ flex: 1, marginRight: '8px' }}
            label={t('llmProvider.providerForm.label.authConfigList')}
            required
            name="authConfig_allowedConsumers"
            rules={[
              {
                required: true,
                message: t('llmProvider.providerForm.label.authConfigList'),
              },
            ]}
            extra={(<HistoryButton text={t('consumer.create')} path={"/consumer"} />)}
          >
            <Select allowClear placeholder={t('llmProvider.providerForm.label.authConfigList')}>
              {
                consumerList.map((item) => {
                  return (
                    <Select.Option key={String(item.name)} value={item.name}>
                      {item.name}
                    </Select.Option>
                  )
                })
              }
            </Select>
          </Form.Item>

          <RedoOutlinedBtn getList={consumerResult} />
        </div>
        : null}
    </Form>
  );
});

export default ConsumerForm;
