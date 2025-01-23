import { Consumer } from '@/interfaces/consumer';
import { DEFAULT_DOMAIN, Domain } from '@/interfaces/domain';
import { LlmProvider } from '@/interfaces/llm-provider';
import FactorGroup from '@/pages/route/components/FactorGroup';
import { getGatewayDomains } from '@/services';
import { getConsumers } from '@/services/consumer';
import { getLlmProviders } from '@/services/llm-provider';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { AutoComplete, Button, Checkbox, Form, Input, InputNumber, Select, Space, Switch } from 'antd';
import { uniqueId } from "lodash";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { aiModelProviders } from '../../configs';
import { HistoryButton, RedoOutlinedBtn } from './Components';

const { Option } = Select;

const AiRouteForm: React.FC = forwardRef((props: { value: any }, ref) => {
  const { t } = useTranslation();
  const { value } = props;
  const [form] = Form.useForm();
  const [fallbackConfig_enabled, setFallbackConfigEnabled] = useState(false);
  const [authConfig_enabled, setAuthConfigEnabled] = useState(false);
  const [upstreamsError, setUpstreamsError] = useState<any>(false); // 目标AI服务错误提示
  const [modelService, setModelService] = useState('ByWeight');
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
  const [domainList, setDomainList] = useState<Domain[]>([]);
  const domainsResult = useRequest(getGatewayDomains, {
    manual: true,
    onSuccess: (result) => {
      const domains = (result || []) as Domain[];
      setDomainList(domains.filter(d => d.name !== DEFAULT_DOMAIN));
    },
  });

  useEffect(() => {
    llmResult.run();
    consumerResult.run();
    domainsResult.run();
    form.resetFields();
    initForm();
    return () => {
      setAuthConfigEnabled(false);
      setFallbackConfigEnabled(false);
    }
  }, []);

  const initForm = () => {
    const {
      name = "",
      domains,
      pathPredicate = { matchType: 'PRE', matchValue: '/', caseSensitive: false },
      headerPredicates = [],
      urlParamPredicates = [],
      upstreams = [{}],
      modelPredicates,
    } = (value || {});
    const _authConfig_enabled = value?.authConfig?.enabled || false;
    const _fallbackConfig_enabled = value?.fallbackConfig?.enabled || false;

    setAuthConfigEnabled(_authConfig_enabled);
    setFallbackConfigEnabled(_fallbackConfig_enabled);
    const fallbackInitValues = { fallbackConfig_enabled: _fallbackConfig_enabled };
    if (_fallbackConfig_enabled && value?.fallbackConfig?.upstreams) {
      fallbackInitValues['fallbackConfig_upstreams'] = value?.fallbackConfig?.upstreams?.[0]?.provider;
      try {
        fallbackInitValues['fallbackConfig_modelNames'] = value?.fallbackConfig?.upstreams?.[0]?.modelMapping['*'];
      } catch (err) {
        fallbackInitValues['fallbackConfig_modelNames'] = '';
      }
    }

    headerPredicates && headerPredicates.map((query) => {
      return { ...query, uid: uniqueId() };
    });
    urlParamPredicates && urlParamPredicates.map((header) => {
      return { ...header, uid: uniqueId() };
    });

    const initValues = {
      name,
      domains: domains?.length ? domains[0] : [],
      pathPredicate,
      headerPredicates,
      urlParamPredicates,
      upstreams,
      authConfig_enabled: _authConfig_enabled,
      authConfig_allowedConsumers: value?.authConfig?.allowedConsumers || "",
      ...fallbackInitValues,
    };

    if (modelPredicates) {
      setModelService("ModelName");
      initValues["modelPredicates"] = modelPredicates.map(item => ({
        ...item,
        provider: upstreams[0].provider,
      }));
    } else {
      setModelService("ByWeight");
      initValues["upstreams"] = upstreams.map((item) => {
        let obj = {
          provider: item.provider,
          weight: item.weight,
        };
        if (item.modelMapping) {
          obj["modelMapping"] = item.modelMapping["*"] || null;
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

      if (modelService === "ByWeight") {
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
        pathPredicate,
        headerPredicates,
        urlParamPredicates,
        fallbackConfig_upstreams = '',
        authConfig_allowedConsumers = '',
        fallbackConfig_modelNames = '',
        modelPredicates = [],
      } = values;

      const byWeight = modelService === "ByWeight";
      const payload = {
        name,
        domains: domains && !Array.isArray(domains) ? [domains] : domains,
        pathPredicate,
        headerPredicates,
        urlParamPredicates,
        fallbackConfig: {
          enabled: fallbackConfig_enabled,
        },
        authConfig: {
          enabled: authConfig_enabled,
        },
      }
      if (byWeight) {
        payload["upstreams"] = upstreams.map(({ provider, weight, modelMapping }) => {
          const obj = { provider, weight, modelMapping: {} };
          if (modelMapping) {
            obj["modelMapping"]["*"] = modelMapping;
          }
          return obj;
        });
      } else {
        payload["upstreams"] = upstreams.map(({ provider }) => ({ provider, weight: 100 }));
        payload["modelPredicates"] = modelPredicates.map(({ matchType, matchValue }) => ({ matchType, matchValue }));
      }
      if (fallbackConfig_enabled) {
        const _upstreams = {
          provider: fallbackConfig_upstreams,
          modelMapping: {},
        };
        _upstreams["modelMapping"][fallbackConfig_modelNames] = fallbackConfig_upstreams;
        payload['fallbackConfig']['upstreams'] = [_upstreams];
        payload['fallbackConfig']['strategy'] = "SEQ";
      }
      if (authConfig_enabled) {
        payload['authConfig']['allowedConsumers'] = authConfig_allowedConsumers && !Array.isArray(authConfig_allowedConsumers)
          ? [authConfig_allowedConsumers] : authConfig_allowedConsumers;
      }
      return payload;
    },
  }));

  const getOptionsForAi = (providerName) => {
    try { // 通过 【服务名称】 来筛查满足 【目标模型 预定义】 的下拉选项
      const _list = aiModelProviders.filter(item => item.value.toUpperCase().indexOf(providerName.toUpperCase()) !== -1);
      if (_list.length) {
        const _filterList = _list.map(item => item.targetModelList);
        return _filterList.flatMap(item => item)
      }
      return [];
    } catch (error) { return []; }
  }

  const getOptions = (index) => {
    if (modelService === "ModelName") {
      return []
    }
    try {
      const _upstreams = form.getFieldValue("upstreams"); // 查询 ui 全部Ai服务
      if (_upstreams[index]) { // 通过传递的 index 筛查出当前Ai服务的【服务名称】。
        if (_upstreams[index] && _upstreams[index].provider) return getOptionsForAi(_upstreams[index].provider);
      }
    } catch (err) { return []; }
    return [];
  };

  const canUseAsFallback = (provider): boolean => {
    // TODO
    return true;
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label={t('aiRoute.routeForm.label.name')} // {/* 名称 */}
        required
        name="name"
        rules={[
          {
            required: true,
            pattern: /^(?!-)[A-Za-z0-9-]{0,63}[A-Za-z0-9]$/,
            message: t('aiRoute.routeForm.rule.nameRequired'),
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={63}
          disabled={value}
          placeholder={t('aiRoute.routeForm.rule.nameRequired')}
        />
      </Form.Item>
      <div style={{ display: 'flex' }}>
        <Form.Item
          style={{ flex: 1, marginRight: '8px' }}
          label={t("aiRoute.routeForm.label.domain")} // {/* 域名 */}
          name="domains"
          extra={(<HistoryButton text={t("domain.createDomain")} path={"/domain"} />)}
        >
          <Select allowClear>
            {domainList.map((item) => (<Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>))}
          </Select>
        </Form.Item>
        <RedoOutlinedBtn getList={domainsResult} />
      </div>
      <Form.Item label={t('route.routeForm.path')} required>
        <Input.Group compact>
          <Form.Item
            name={['pathPredicate', 'matchType']}
            noStyle
            rules={[
              {
                required: true,
                message: t('route.routeForm.pathPredicatesRequired'),
              },
            ]}
          >
            <Select
              style={{ width: '20%' }}
              placeholder={t('route.routeForm.matchType')}
            >
              <Option value="PRE">{t('route.matchTypes.PRE')}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['pathPredicate', 'matchValue']}
            noStyle
            rules={[
              {
                required: true,
                message: t('route.routeForm.pathMatcherRequired'),
              },
            ]}
          >
            <Input style={{ width: '60%' }} placeholder={t('route.routeForm.pathMatcherPlacedholder')} />
          </Form.Item>
          <Form.Item
            name={['pathPredicate', 'ignoreCase']}
            noStyle
          >
            <Checkbox.Group
              options={[
                {
                  label: t('route.routeForm.caseInsensitive'), value: 'ignore',
                },
              ]}
              style={{ width: '18%', display: 'inline-flex', marginLeft: 12, marginTop: 4 }}
            />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item
        label={t('route.routeForm.header')}
        name="headerPredicates"
        tooltip={t('route.routeForm.headerTooltip')}
      >
        <FactorGroup />
      </Form.Item>
      <Form.Item
        label={t('route.routeForm.query')}
        name="urlParamPredicates"
        tooltip={t('route.routeForm.queryTooltip')}
      >
        <FactorGroup />
      </Form.Item>
      <Form.Item
        style={{ marginBottom: 10 }}
        label={t("aiRoute.routeForm.selectModelService")} // {/* 选择模型服务 */}
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
          <Select.Option value="ByWeight">{/* 按比例 */}{t("aiRoute.routeForm.byWeight")}</Select.Option>
          <Select.Option value="ModelName">{/* 按模型名称 */}{t("aiRoute.routeForm.byModelName")}</Select.Option>
        </Select>
      </Form.Item>

      {
        modelService === "ModelName" ?
          <>
            {/* 基于模型的路由匹配规则 */}
            <Form.List name="modelPredicates" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  <div className="ant-table ant-table-small">
                    <div className="ant-table-content">
                      <table style={{ tableLayout: "auto" }}>
                        <thead className="ant-table-thead">
                          <tr>
                            <th className="ant-table-cell">Key</th>
                            <th className="ant-table-cell">{t("aiRoute.routeForm.modelMatchType")}</th>{/* 模型匹配方式 */}
                            <th className="ant-table-cell">{t("aiRoute.routeForm.modelMatchValue")}</th>{/* 模型名称 */}
                            {fields.length > 1 ? <th className="ant-table-cell">{t("misc.action")}</th> : null}{/* 操作 */}
                          </tr>
                        </thead>
                        <tbody className="ant-table-tbody">
                          {fields.map(({ key, name, ...restField }, index) => (
                            <tr className="ant-table-row ant-table-row-level-0" key={key}>
                              <td className="ant-table-cell">
                                model
                              </td>
                              <td className="ant-table-cell">
                                <Form.Item
                                  name={[name, 'matchType']}
                                  noStyle
                                  rules={[{ required: true, message: t("aiRoute.routeForm.rule.matchTypeRequired") }]}
                                >
                                  <Select style={{ width: "200px" }}>
                                    {[
                                      { name: "EQUAL", label: t("route.matchTypes.EQUAL") }, // 精确匹配
                                      { name: "PRE", label: t("route.matchTypes.PRE") }, // 前缀匹配
                                    ].map((item) => (<Select.Option key={item.name} value={item.name}>{item.label} </Select.Option>))
                                    }
                                  </Select>
                                </Form.Item>
                              </td>
                              <td className="ant-table-cell">
                                <Form.Item
                                  {...restField}
                                  name={[name, 'matchValue']}
                                  noStyle
                                  rules={[{ required: true, message: t("aiRoute.routeForm.rule.matchValueRequired") }]}
                                >
                                  <Input style={{ width: "200px" }} />
                                </Form.Item>
                              </td>
                              {
                                fields.length > 1 &&
                                <td className="ant-table-cell">
                                  <MinusCircleOutlined onClick={() => remove(name)} />
                                </td>
                              }
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add()}>{t("aiRoute.routeForm.addModelPredicate")}</Button>
                  </div>
                </>)
              }
            </Form.List>

            <Form.List name="upstreams" initialValue={[null]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Form.Item
                      key={key}
                      label={t("aiRoute.routeForm.label.serviceName")}
                      {...restField}
                      name={[name, 'provider']}
                      rules={[{ required: true, message: t('aiRoute.routeForm.rule.targetServiceRequired') }]}
                    >
                      <Select>
                        {llmList.map((item) => (<Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>))}
                      </Select>
                    </Form.Item>
                  ))}
                </>
              )}
            </Form.List>
          </> :
          <>
            <Form.Item
              style={{ marginBottom: 8 }}
              label={t('aiRoute.routeForm.label.services')} // {/* 目标AI服务 upstreams */}
              hasFeedback={upstreamsError}
              validateStatus={upstreamsError ? "error" : ''}
              help={upstreamsError ? t(`aiRoute.routeForm.placeholder.${upstreamsError}`) : null}
              extra={(<HistoryButton text={t('llmProvider.create')} path={"/ai/provider"} />)}
            >
              <Form.List name="upstreams" initialValue={[null]}>
                {(fields, { add, remove }) => {
                  const baseStyle = { width: 190 };
                  const requiredStyle = { display: "inline-block", marginRight: "4px", color: "#ff4d4f" };
                  return (
                    <>
                      <Space style={{ display: 'flex', color: "#808080" }} align="start">
                        <div style={{ ...baseStyle }}><span style={requiredStyle}>*</span>{t("aiRoute.routeForm.label.serviceName")}</div>
                        <div style={{ ...baseStyle }}><span style={requiredStyle}>*</span>{t("aiRoute.routeForm.label.serviceWeight")}</div>
                        <div style={{ ...baseStyle }}>{t("aiRoute.routeForm.label.targetModel")}</div>
                      </Space>

                      {fields.map(({ key, name, ...restField }, index) => (
                        <Space key={key} style={{ display: 'flex' }} align="start">
                          <Form.Item
                            {...restField}
                            name={[name, 'provider']}
                            style={{ marginBottom: '0.5rem' }}
                            rules={[{ required: true, message: t('aiRoute.routeForm.rule.targetServiceRequired') }]}
                          >{/* 服务名称 */}
                            <Select
                              style={{ ...baseStyle }}
                            >
                              {llmList.map((item) => {
                                const selectArr = form.getFieldValue('upstreams').map(i => i && i.provider) || [];
                                return (
                                  <Select.Option key={item.name} value={item.name} disabled={!!selectArr.includes(item.name)}>
                                    {item.name}
                                  </Select.Option>)
                              })}
                            </Select>
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'weight']}
                            style={{ ...baseStyle }}
                            rules={[{ required: true, message: t('aiRoute.routeForm.rule.serviceWeightRequired') }]}
                          >{/* 请求比例 */}
                            <InputNumber
                              style={{ ...baseStyle }}
                              min={0}
                              max={100}
                              addonAfter="%"
                            />
                          </Form.Item>

                          <Form.Item {...restField} name={[name, 'modelMapping']} noStyle>{/* 模型名称 */}
                            <AutoComplete
                              style={{ ...baseStyle }}
                              options={getOptions(index)}
                              filterOption={(inputValue, option: any) => {
                                return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                              }}
                              allowClear
                            />
                          </Form.Item>
                          {
                            fields.length > 1 &&
                            <Form.Item noStyle>
                              <MinusCircleOutlined onClick={() => remove(name)} />
                            </Form.Item>
                          }
                        </Space>
                      ))}
                      <div>
                        <Button
                          type="dashed"
                          block
                          icon={<PlusOutlined />}
                          onClick={() => add()}
                        >
                          {/* 添加目标AI服务 */}{t("aiRoute.routeForm.addTargetService")}
                        </Button>
                      </div>
                    </>
                  )
                }}
              </Form.List>
            </Form.Item>
          </>
      }

      <Form.Item
        name="fallbackConfig_enabled"
        label={t('aiRoute.routeForm.label.fallbackConfig')} // {/* 降级服务 */}
        valuePropName="checked"
        initialValue={false}
        extra={t('aiRoute.routeForm.label.fallbackConfigExtra')}
        style={fallbackConfig_enabled ? { marginBottom: 0 } : null}
      >
        <Switch onChange={e => {
          setFallbackConfigEnabled(e)
          form.resetFields(["fallbackConfig_upstreams"])
        }}
        />
      </Form.Item>
      {fallbackConfig_enabled ?
        <>
          <div style={{ display: 'flex' }}>
            <Form.Item
              style={{ flex: 1, marginRight: '8px' }}
              required
              name="fallbackConfig_upstreams"
              label={t('aiRoute.routeForm.label.fallbackUpstream')} // {/* 降级服务列表 */}
              rules={[{ required: true, message: t('aiRoute.routeForm.rule.fallbackUpstreamRequired') }]}
            >
              <Select>
                {llmList.map((item) =>
                  (<Select.Option key={item.name} value={item.name} disabled={!canUseAsFallback(item)}>{item.name}</Select.Option>))}
              </Select>
            </Form.Item>
            <Form.Item
              required
              style={{ flex: 1 }}
              name={"fallbackConfig_modelNames"}
              label={t("aiRoute.routeForm.label.targetModel")}
              rules={[{ required: true, message: t('aiRoute.routeForm.rule.modelNameRequired') }]}
            >{/* 模型名称 */}
              <AutoComplete
                options={getOptionsForAi(form.getFieldValue("fallbackConfig_upstreams"))}
                filterOption={(inputValue, option: any) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                allowClear
              />
            </Form.Item>
          </div>
        </>
        : null
      }

      <Form.Item
        name="authConfig_enabled"
        label={t('aiRoute.routeForm.label.authConfig')} // {/* 请求认证设置 */}
        valuePropName="checked"
        initialValue={false}
        extra={t('aiRoute.routeForm.label.authConfigExtra')}
        style={authConfig_enabled ? { marginBottom: 0 } : null}
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
            required
            name="authConfig_allowedConsumers"
            label={t('aiRoute.routeForm.label.authConfigList')}
            rules={[{ required: true, message: t('aiRoute.routeForm.label.authConfigList') }]}
            extra={(<HistoryButton text={t('consumer.create')} path={"/consumer"} />)}
          >
            <Select allowClear mode="multiple" placeholder={t('aiRoute.routeForm.label.authConfigList')}>
              {consumerList.map((item) => (<Select.Option key={String(item.name)} value={item.name}>{item.name}</Select.Option>))}
            </Select>
          </Form.Item>
          <RedoOutlinedBtn getList={consumerResult} />
        </div>
        : null}
    </Form>
  );
});

export default AiRouteForm;
