import { CustomComponentHandles } from '@/interfaces/service-source';
import { Form, Input, Select, Switch, Button } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { LlmProvider } from '@/interfaces/llm-provider';
import { getLlmProviders } from '@/services/llm-provider';
import { Domain } from '@/interfaces/domain';
import { getConsumers } from '@/services/consumer';
import { Consumer } from '@/interfaces/consumer';
import { useRequest } from 'ahooks';
import { getGatewayDomains } from '@/services';
import { RedoOutlinedBtn, HistoryButton, UpstreamsTable } from './Components';


const ConsumerForm: React.FC = forwardRef((props: { value: any }, ref) => {
  const { t } = useTranslation();
  const { value } = props;
  const [form] = Form.useForm();
  const [modelPredicate_enabled, setModelPredicateEnabled] = useState(false);
  const [fallbackConfig_enabled, setFallbackConfigEnabled] = useState(false);
  const [authConfig_enabled, setAuthConfigEnabled] = useState(false);
  // 目标AI服务错误提示
  const [upstreamsError, setUpstreamsError] = useState(false);
  const upstreamsRef = useRef<CustomComponentHandles>(null);

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
      setModelPredicateEnabled(false);
    }
  }, []);

  const initForm = () => {
    const { name = "", domains, upstreams = [] } = value;
    if (upstreams?.length) {
      upstreamsRef.current?.setDataSource(upstreams);
    }

    const _modelPredicate_enabled = value?.modelPredicate?.enabled || false;
    const _authConfig_enabled = value?.authConfig?.enabled || false;
    const _fallbackConfig_enabled = value?.fallbackConfig?.enabled || false;

    setAuthConfigEnabled(_authConfig_enabled);
    setFallbackConfigEnabled(_fallbackConfig_enabled);
    setModelPredicateEnabled(_modelPredicate_enabled);

    form.setFieldsValue({
      name,
      domains: domains?.length ? domains[0] : undefined,
      upstreams,
      modelPredicate_enabled: _modelPredicate_enabled,
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
      const upstreams = upstreamsRef.current?.getList();

      if (!upstreams?.length) {
        setUpstreamsError(true);
        return false;
      }

      const {
        name = '',
        domains = [],
        modelPredicate_prefix = '',
        fallbackConfig_upstreams = '',
        fallbackConfig_strategy = '',
        authConfig_allowedConsumers = '',
      } = values;

      const payload = {
        name,
        domains: domains ? [domains] : [],


        modelPredicate: {
          enabled: values?.modelPredicate_enabled,
        },

        upstreams,

        fallbackConfig: {
          enabled: fallbackConfig_enabled,
        },

        authConfig: {
          enabled: authConfig_enabled,
        },
      };

      if (values?.modelPredicate_enabled) {
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
          required
          name="domains"
          rules={[
            {
              required: true,
              message: t("llmProvider.providerForm.placeholder.domain"),
            },
          ]}
          extra={(<HistoryButton text={t("llmProvider.providerForm.creatDomain")} path={"/domain"} />)}
        >
          <Select
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


      {/* 是否启用基于模型的路由匹配规则 */}
      <Form.Item
        name="modelPredicate_enabled"
        label={t('llmProvider.providerForm.label.modelPredicate')}
        valuePropName="checked"
        initialValue={false}
        extra={t('llmProvider.providerForm.label.extra')}
      >
        <Switch onChange={e => setModelPredicateEnabled(e)} />
      </Form.Item>

      {/* 匹配本路由所需的模型名称前缀（不包含结尾的“/”） */}
      {
        modelPredicate_enabled ?
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
              placeholder={t('llmProvider.providerForm.placeholder.modelPredicatePrefix')}
              rows={2}
            />
          </Form.Item> : null
      }

      {/* 目标AI服务 upstreams */}
      <div style={{ display: 'flex' }}>
        <Form.Item
          style={{ flex: 1, marginRight: '8px' }}
          label={t('llmProvider.providerForm.label.aiName')}
          required
          hasFeedback={upstreamsError}
          validateStatus={upstreamsError ? "error" : ''}
          help={upstreamsError ? t('llmProvider.providerForm.placeholder.aiName') : null}
          name="upstreams_target"
          extra={(<HistoryButton text={t('llmProvider.providerForm.label.aiNameExtra')} path={"/ai/provider"} />)}
        >
          <Select placeholder={t('llmProvider.providerForm.placeholder.aiName')}>
            {
              llmList.map((item) => {
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

        <Form.Item label="&nbsp;">
          <Button
            style={{ marginRight: '8px' }}
            onClick={() => {
              const upstreams_target = form.getFieldValue('upstreams_target');

              if (upstreams_target) {
                const target_item = llmList.find(i => i.name === upstreams_target) ?? {};
                upstreamsRef.current?.addItem(target_item);

                form.resetFields(["upstreams_target"]);
                setUpstreamsError(false);
              }
            }}
            icon={<PlusOutlined />}
          />
        </Form.Item>
        <RedoOutlinedBtn getList={llmResult} />
      </div>
      <Form.Item
        hasFeedback={upstreamsError}
        validateStatus={upstreamsError ? "error" : ''}
        help={upstreamsError ? t('llmProvider.providerForm.placeholder.aiName') : null}
      >
        <UpstreamsTable ref={upstreamsRef} />
      </Form.Item>

      {/* 降级服务 */}
      <Form.Item
        name="fallbackConfig_enabled"
        label={t('llmProvider.providerForm.label.fallbackConfig')}
        valuePropName="checked"
        initialValue={false}
        extra={t('llmProvider.providerForm.label.fallbackConfigExtra')}
      >
        <Switch onChange={e => setFallbackConfigEnabled(e)} />
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
                <Select
                  placeholder={t('llmProvider.providerForm.placeholder.fallbackConfigList')}
                >
                  {
                    llmList.map((item) => {
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
              <Select placeholder={t('llmProvider.providerForm.label.routeStrategy')}>
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
        <Switch onChange={e => setAuthConfigEnabled(e)} />
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
            <Select
              placeholder={t('llmProvider.providerForm.label.authConfigList')}
            >
              {
                consumerList.map((item) => {
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

          <RedoOutlinedBtn getList={consumerResult} />
        </div>
        : null}
    </Form>
  );
});

export default ConsumerForm;
