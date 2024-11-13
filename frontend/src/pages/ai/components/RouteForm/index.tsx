import { Form, Input, Select, Switch, Button, Space, InputNumber } from 'antd';
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
  // 目标AI服务错误提示
  const [upstreamsError, setUpstreamsError] = useState<any>(false);
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
    const { name = "", domains, upstreams = [] } = value;

    const _authConfig_enabled = value?.authConfig?.enabled || false;
    const _fallbackConfig_enabled = value?.fallbackConfig?.enabled || false;

    setAuthConfigEnabled(_authConfig_enabled);
    setFallbackConfigEnabled(_fallbackConfig_enabled);
    setModelService(value?.modelPredicate?.enabled ? "Proportion" : "ModelName")

    form.setFieldsValue({
      name,
      domains: domains?.length ? domains[0] : undefined,
      upstreams: value?.modelPredicate?.enabled ? upstreams[0].provider : upstreams,
      modelPredicate_prefix: value?.modelPredicate?.prefix || "",
      authConfig_enabled: _authConfig_enabled,
      authConfig_allowedConsumers: value?.authConfig?.allowedConsumers || "",
      fallbackConfig_enabled: _fallbackConfig_enabled,
      fallbackConfig_upstreams: value?.fallbackConfig?.upstreams ? value?.fallbackConfig?.upstreams[0].provider : undefined,
      fallbackConfig_strategy: value?.fallbackConfig?.strategy,
    })
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields();
    },
    handleSubmit: async () => {
      const values = await form.validateFields();
      const { upstreams = [] } = values;

      if (modelService === "ModelName") {
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
        modelPredicate_prefix = '',
        fallbackConfig_upstreams = '',
        fallbackConfig_strategy = '',
        authConfig_allowedConsumers = '',
      } = values;

      const isProportion = modelService === "Proportion";
      const payload = {
        name,
        domains: domains ? [domains] : [],


        modelPredicate: {
          enabled: isProportion,
        },

        upstreams: isProportion ? [{ provider: upstreams, weight: 100 }] : upstreams,

        fallbackConfig: {
          enabled: fallbackConfig_enabled,
        },

        authConfig: {
          enabled: authConfig_enabled,
        },
      };

      if (isProportion) {
        payload['modelPredicate']['prefix'] = modelPredicate_prefix;
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
            {
              domainsList.map((item) => {
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

      <div>{t("llmProvider.selectModelName")}</div>
      <Select
        onChange={async (e) => {
          await form.resetFields(["upstreams", "modelPredicate_prefix"]);
          setModelService(e);
        }}
        value={modelService}
        allowClear
        style={{ width: "100%", marginBottom: 24 }}
      >
        <Select.Option value="Proportion">{/* 按比例 */}{t("llmProvider.modelProportion")}</Select.Option>
        <Select.Option value="ModelName">{/* 按请求 Body 中的模型名称 */}{t("llmProvider.modelName")}</Select.Option>
      </Select>

      {
        modelService === "Proportion" ?
          <>
            <Space style={{ display: 'flex' }} align="start">
              <Form.Item
                required
                name="upstreams"
                style={{ marginBottom: 8 }}
                label={t('llmProvider.providerForm.label.aiName')}
                extra={(<HistoryButton text={t('llmProvider.providerForm.label.aiNameExtra')} path={"/ai/provider"} />)}
                rules={[
                  {
                    required: true,
                    message: t('llmProvider.providerForm.placeholder.aiName'),
                  },
                ]}
              >
                <Select style={{ width: "300px" }} placeholder={t('llmProvider.providerForm.placeholder.aiName')}>
                  {
                    llmList.map((item) => (
                      <Select.Option key={item.name} value={item.name}>
                        {item.name}
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>

              <Form.Item
                name="modelPredicate_prefix"
                label={t('llmProvider.providerForm.label.modelPredicatePrefix')}
                required
                rules={[
                  {
                    required: true,
                    message: t('llmProvider.providerForm.rules.modelPredicatePrefix'),
                  },
                ]}
              >
                <Input.TextArea
                  style={{ width: "300px" }}
                  placeholder={t('llmProvider.providerForm.placeholder.modelPredicatePrefix')}
                  rows={1}
                />
              </Form.Item>
            </Space>
          </> :
          <>
            {/* 目标AI服务 upstreams */}
            <Form.Item
              required
              style={{ marginBottom: 8 }}
              label={t('llmProvider.providerForm.label.aiName')}
              hasFeedback={upstreamsError}
              validateStatus={upstreamsError ? "error" : ''}
              help={upstreamsError ? t(`llmProvider.providerForm.placeholder.${upstreamsError}`) : null}
              extra={(<HistoryButton text={t('llmProvider.providerForm.label.aiNameExtra')} path={"/ai/provider"} />)}
            >
              <Form.List name="upstreams">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex' }} align="start">
                        <Form.Item
                          {...restField}
                          style={{ width: "100%" }}
                          name={[name, 'provider']}
                          rules={[
                            {
                              required: true,
                              message: t('llmProvider.providerForm.placeholder.aiName'),
                            },
                          ]}
                        >
                          <Select style={{ width: "280px" }} placeholder={t('llmProvider.providerForm.placeholder.aiName')}>
                            {
                              llmList.map((item) => {
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
                        <Form.Item
                          {...restField}
                          style={{ width: "100%" }}
                          name={[name, 'weight']}
                          rules={[
                            {
                              required: true,
                              message: t('llmProvider.providerForm.label.weight'),
                            },
                          ]}
                        >
                          <InputNumber
                            style={{ width: "280px" }}
                            min={0}
                            placeholder={t('llmProvider.providerForm.label.weight')}
                            max={100}
                            addonAfter="%"
                          />
                        </Form.Item>

                        <Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
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
                )}
              </Form.List>
            </Form.Item>
          </>
      }

      {/* 降级服务 */}
      <Form.Item
        name="fallbackConfig_enabled"
        label={t('llmProvider.providerForm.label.fallbackConfig')}
        valuePropName="checked"
        initialValue={false}
        extra={t('llmProvider.providerForm.label.fallbackConfigExtra')}
      >
        <Switch onChange={e => {
          setFallbackConfigEnabled(e)
          form.resetFields(["fallbackConfig_upstreams", "fallbackConfig_strategy"])
        }}
        />
      </Form.Item>

      {
        fallbackConfig_enabled ?
          <>
            {/* 降级服务列表 */}
            <div style={{ display: 'flex' }}>
              <Form.Item
                style={{ flex: 1, marginRight: '8px' }}
                label={t('llmProvider.providerForm.label.fallbackConfigList')}
                required
                name="fallbackConfig_upstreams"
                rules={[
                  {
                    required: true,
                    message: t('llmProvider.providerForm.placeholder.fallbackConfigList'),
                  },
                ]}
              >
                <Select allowClear placeholder={t('llmProvider.providerForm.placeholder.fallbackConfigList')}>
                  {
                    llmList.map((item) => (
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

      {/* 允许请求本路由的消费者名称列表 */}
      {authConfig_enabled ?
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
