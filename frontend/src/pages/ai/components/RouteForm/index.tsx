import { Form, Input, Select, Switch, Button, Space, InputNumber, AutoComplete } from 'antd';
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
import { aiModelproviders } from './const';

const ConsumerForm: React.FC = forwardRef((props: { value: any }, ref) => {
  const { t } = useTranslation();
  const { value } = props;
  const [form] = Form.useForm();
  const [fallbackConfig_enabled, setFallbackConfigEnabled] = useState(false);
  const [authConfig_enabled, setAuthConfigEnabled] = useState(false);
  const [upstreamsError, setUpstreamsError] = useState<any>(false); // 目标AI服务错误提示
  const [modelService, setModelService] = useState('Proportion');
  const [modelName, setModelName] = useState(''); // 勿删 用于更新UI
  const [providerIndex, setProviderIndex] = useState(''); // 勿删 用于更新UI
  const [dataSource, setDataSource] = useState([]); // 勿删 用于更新UI
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
    const initfallback = { fallbackConfig_enabled: _fallbackConfig_enabled };
    if (_fallbackConfig_enabled && value?.fallbackConfig?.upstreams) {
      initfallback['fallbackConfig_upstreams'] = value?.fallbackConfig?.upstreams?.[0]?.provider;
      try {
        initfallback['fallbackConfig_modelNames'] = Object.keys(value?.fallbackConfig?.upstreams?.[0]?.modelMapping)[0];
      } catch (err) {
        initfallback['fallbackConfig_modelNames'] = '';
      }
    }
    const initValues = {
      name,
      domains: domains?.length ? domains[0] : [],
      upstreams,
      authConfig_enabled: _authConfig_enabled,
      authConfig_allowedConsumers: value?.authConfig?.allowedConsumers || "",
      ...initfallback,
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
        authConfig_allowedConsumers = '',
        fallbackConfig_modelNames = '',
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
        payload['authConfig']['allowedConsumers'] = authConfig_allowedConsumers ? [authConfig_allowedConsumers] : [];
      }
      return payload;
    },
  }));

  const getOptionsForAi = (providerName) => {
    try { // 通过 【服务名称】 来筛查满足 【目标模型 预定义】 的下拉选项
      const _list = aiModelproviders.filter(item => item.value.toUpperCase().indexOf(providerName.toUpperCase()) !== -1);
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

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label={t('llmProvider.providerForm.label.name')} // {/* 名称 */}
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
      <div style={{ display: 'flex' }}>
        <Form.Item
          style={{ flex: 1, marginRight: '8px' }}
          label={t("llmProvider.providerForm.label.domain")} // {/* 域名 */}
          name="domains"
          extra={(<HistoryButton text={t("llmProvider.providerForm.creatDomain")} path={"/domain"} />)}
        >
          <Select allowClear placeholder={t("serviceSource.serviceSourceForm.domainRequired")}>
            { domainsList.map((item) => (<Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>))}
          </Select>
        </Form.Item>
        <RedoOutlinedBtn getList={domainsResult} />
      </div>
      <Form.Item
        style={{ marginBottom: 10 }}
        label={t("llmProvider.selectModelName")} // {/* 选择模型服务 */}
        tooltip={modelService === "ModelName" ? t("llmProvider.modelNameTips") : null}
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
                  <div className="ant-table ant-table-small">
                    <div className="ant-table-content">
                      <table style={{ tableLayout: "auto" }}>
                        <thead className="ant-table-thead">
                          <tr>
                            <th className="ant-table-cell">Key</th>
                            <th className="ant-table-cell">{t("llmProvider.modelMatchingType")}</th>{/* 模型匹配方式 */}
                            <th className="ant-table-cell">{t("llmProvider.modelNames")}</th>{/* 模型名称 */}
                            {fields.length > 1 ? <th className="ant-table-cell">{t("llmProvider.operation")}</th> : null}{/* 操作 */}
                          </tr>
                        </thead>
                        <tbody className="ant-table-tbody">
                          {fields.map(({ key, name, ...restField }, index) => (
                            <tr className="ant-table-row ant-table-row-level-0" key={key}>
                              <td className="ant-table-cell">
                                <Form.Item><Input style={{ width: 100 }} readOnly value="model" /></Form.Item>
                              </td>
                              <td className="ant-table-cell">
                                <Form.Item name={[name, 'matchType']} rules={[{ required: true, message: t("llmProvider.pleaseSelect") }]}>
                                  <Select style={{ width: "200px" }} placeholder={t("llmProvider.pleaseSelect")}>
                                    {[
                                      { name: "EQUAL", label: t("llmProvider.exactMatch") }, // 精确匹配
                                      { name: "PRE", label: t("llmProvider.prefixMatch") }, // 前缀匹配
                                    ].map((item) => (<Select.Option key={item.name} value={item.name}>{item.label} </Select.Option>))
                                    }
                                  </Select>
                                </Form.Item>
                              </td>
                              <td className="ant-table-cell">
                                <Form.Item
                                  {...restField}
                                  name={[name, 'matchValue']}
                                  rules={[{ required: true, message: t("llmProvider.pleaseEnter") }]}
                                >
                                  <Input.TextArea style={{ width: "200px" }} placeholder={t("llmProvider.pleaseEnter")} rows={1} />
                                </Form.Item>
                              </td>
                              {fields.length > 1 ?
                                <td className="ant-table-cell">
                                  {index ? <Form.Item><MinusCircleOutlined onClick={() => remove(name)} /></Form.Item> : null}
                                </td> : null}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <Button type="dashed" block icon={<PlusOutlined />} onClick={add}>{t("llmProvider.addTargetServer")}</Button>
                  </div>
                </>)
              }
            </Form.List>

            <Form.List name="upstreams" initialValue={[null]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Form.Item
                      label={t("llmProvider.serviceName")}
                      {...restField}
                      name={[name, 'provider']}
                      rules={[{ required: true, message: t('llmProvider.providerForm.placeholder.aiName') }]}
                    >
                      <Select placeholder={t('llmProvider.providerForm.placeholder.aiName')}>
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
              label={t('llmProvider.providerForm.label.aiName')} // {/* 目标AI服务 upstreams */}
              hasFeedback={upstreamsError}
              validateStatus={upstreamsError ? "error" : ''}
              help={upstreamsError ? t(`llmProvider.providerForm.placeholder.${upstreamsError}`) : null}
              extra={(<HistoryButton text={t('llmProvider.providerForm.label.aiNameExtra')} path={"/ai/provider"} />)}
            >
              <Form.List name="upstreams" initialValue={[null]}>
                {(fields, { add, remove }) => {
                  const baseStyle = { width: 190 };
                  const requiredStyle = { display: "inline-block", marginRight: "4px", color: "#ff4d4f", fontFamily: "SimSun, sans-serif" };
                  return (
                    <>
                      <Space style={{ display: 'flex', color: "#808080" }} align="start">
                        <div style={{ ...baseStyle }}><span style={requiredStyle}>*</span>{t("llmProvider.serviceName")}</div>{/* 服务名称 */}
                        <div style={{ ...baseStyle }}><span style={requiredStyle}>*</span>{t("llmProvider.requestPercentage")}</div>{/* 请求比例 */}
                        <div style={{ ...baseStyle }}>{t("llmProvider.targetModel")}</div>{/* 目标模型 */}
                      </Space>

                      {fields.map(({ key, name, ...restField }, index) => (
                        <Space key={key} style={{ display: 'flex' }} align="start">
                          <Form.Item
                            {...restField}
                            name={[name, 'provider']}
                            rules={[{ required: true, message: t('llmProvider.providerForm.placeholder.aiName') }]}
                          >{/* 服务名称 */}
                            <Select
                              style={{ ...baseStyle }}
                              placeholder={t('llmProvider.providerForm.placeholder.aiName')}
                              onChange={text => setProviderIndex(text)}
                            >
                              { llmList.map((item) => {
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
                            rules={[{ required: true, message: t('llmProvider.providerForm.label.weight') }]}
                          >{/* 请求比例 */}
                            <InputNumber
                              style={{ ...baseStyle }}
                              min={0}
                              max={100}
                              addonAfter="%"
                              placeholder={t('llmProvider.providerForm.label.weight')}
                            />
                          </Form.Item>

                          <Form.Item {...restField} name={[name, 'modelMapping']}>{/* 模型名称 */}
                            <AutoComplete
                              style={{ ...baseStyle }}
                              options={getOptions(index)}
                              onSearch={text => setModelName(text)}
                              filterOption={(inputValue, option: any) => {
                                return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                              }}
                              allowClear
                              placeholder={t("llmProvider.pleaseEnter")}
                            />
                          </Form.Item>
                          <Form.Item>
                            {index ? <MinusCircleOutlined onClick={() => remove(name)} /> : null}
                          </Form.Item>
                        </Space>
                      ))}
                      <div>
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
        label={t('llmProvider.providerForm.label.fallbackConfig')} // {/* 降级服务 */}
        valuePropName="checked"
        initialValue={false}
        extra={t('llmProvider.providerForm.label.fallbackConfigExtra')}
        style={{ marginBottom: 0 }}
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
              label={t('llmProvider.providerForm.label.fallbackConfigList')} // {/* 降级服务列表 */}
              rules={[{ required: true, message: t('llmProvider.providerForm.placeholder.fallbackConfigList') }]}
            >
              <Select allowClear placeholder={t('llmProvider.providerForm.placeholder.fallbackConfigList')} onChange={text => setProviderIndex(text)}>
                { llmList.map((item) => (<Select.Option key={item.name} value={item.name}> {item.name} </Select.Option>))}
              </Select>
            </Form.Item>
            <Form.Item
              required
              style={{ flex: 1 }}
              name={"fallbackConfig_modelNames"}
              label={t("llmProvider.targetModel")}
              rules={[{ required: true, message: t('llmProvider.pleaseEnter') }]}
            >{/* 模型名称 */}
              <AutoComplete
                options={getOptionsForAi(form.getFieldValue("fallbackConfig_upstreams"))}
                onSearch={text => setModelName(text)}
                filterOption={(inputValue, option: any) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                allowClear
                placeholder={t("llmProvider.pleaseEnter")}
              />
            </Form.Item>
          </div>
        </>
        : null
      }

      <Form.Item
        name="authConfig_enabled"
        label={t('llmProvider.providerForm.label.authConfig')} // {/* 请求认证设置 */}
        valuePropName="checked"
        initialValue={false}
        extra={t('llmProvider.providerForm.label.authConfigExtra')}
        style={{ marginBottom: 0 }}
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
            label={t('llmProvider.providerForm.label.authConfigList')}
            rules={[{ required: true, message: t('llmProvider.providerForm.label.authConfigList') }]}
            extra={(<HistoryButton text={t('consumer.create')} path={"/consumer"} />)}
          >
            <Select allowClear placeholder={t('llmProvider.providerForm.label.authConfigList')}>
              { consumerList.map((item) => (<Select.Option key={String(item.name)} value={item.name}>{item.name}</Select.Option>)) }
            </Select>
          </Form.Item>
          <RedoOutlinedBtn getList={consumerResult} />
        </div>
        : null}
    </Form>
  );
});

export default ConsumerForm;
