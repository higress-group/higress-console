import { OptionItem } from '@/interfaces/common';
import { ProxyServer } from '@/interfaces/proxy-server';
import { getProxyServers } from '@/services/proxy-server';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Empty, Form, Input, InputNumber, Modal, Select, Switch, Typography } from 'antd';
import { useRequest } from 'ice';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { aiModelProviders } from '../../configs';

const { TextArea } = Input;
const { Text, Link } = Typography;

const protocolList = [
  { label: "openai/v1", value: "openai/v1" },
];

const ProviderForm: React.FC = forwardRef((props: { value: any }, ref) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [failoverEnabled, setFailoverEnabled] = useState(false);
  const [secretRefModalVisible, setSecretRefModalVisible] = useState(false);
  const [providerType, setProviderType] = useState<string | null>();
  const [openaiServerType, setOpenaiServerType] = useState<string | null>();
  const [providerConfig, setProviderConfig] = useState<object | null>();
  const [proxyServerOptions, setProxyServerOptions] = useState<OptionItem[] | null>();
  const proxyServersResult = useRequest(getProxyServers, {
    manual: true,
    onSuccess: (proxyServers: ProxyServer[]) => {
      proxyServers = proxyServers || [];
      const options = [{ label: t('serviceSource.serviceSourceForm.proxyServerNone'), value: '' }];
      proxyServers.sort((a, b) => a.name.localeCompare(b.name));
      options.push(...proxyServers.map(proxyServer => ({ label: proxyServer.name, value: proxyServer.name })));
      setProxyServerOptions(options);
    },
  });

  const resetForm = () => {
    form.resetFields();
    form.setFieldsValue({
      tokens: [""],
      proxyName: '',
    });
    setFailoverEnabled(false);
    setProviderType(null);
    onProviderTypeChanged(null);
    setProviderConfig(null);
    setOpenaiServerType(null);
    onOpenaiServerTypeChanged(null)
  };

  useEffect(() => {
    form.resetFields();
    if (proxyServerOptions == null) {
      proxyServersResult.run();
    }
    if (props.value) {
      const {
        name,
        type,
        protocol,
        tokens,
        tokenFailoverConfig = {},
        proxyName = '',
        rawConfigs = {},
      } = props.value;
      const {
        failureThreshold,
        successThreshold,
        healthCheckInterval,
        healthCheckTimeout,
        healthCheckModel,
      } = tokenFailoverConfig ?? {};

      // providerConfig cannot be used here directly because it is not updated yet
      const newProviderConfig = getProviderConfigByType(type);
      if (newProviderConfig && typeof newProviderConfig.parseRawConfigs === 'function' && rawConfigs) {
        newProviderConfig.parseRawConfigs(rawConfigs);
      }

      const localFailoverEnabled = !!tokenFailoverConfig?.enabled;
      setFailoverEnabled(localFailoverEnabled);

      if (type === 'openai') {
        let openaiServerTypeValue = 'official';

        rawConfigs.openaiCustomUrls = [];
        if (rawConfigs && rawConfigs.openaiCustomUrl) {
          openaiServerTypeValue = 'custom';
          rawConfigs.openaiCustomUrls.push(rawConfigs.openaiCustomUrl);
          if (Array.isArray(rawConfigs.openaiExtraCustomUrls)) {
            rawConfigs.openaiCustomUrls.push(...rawConfigs.openaiExtraCustomUrls);
          }
        }
        if (rawConfigs.openaiCustomUrls.length === 0) {
          rawConfigs.openaiCustomUrls.push('');
        }

        form.setFieldValue('openaiServerType', openaiServerTypeValue);
        onOpenaiServerTypeChanged(openaiServerTypeValue)
      }

      onProviderTypeChanged(type);

      form.setFieldsValue({
        name,
        type,
        protocol,
        tokens: tokens && tokens.length && tokens || [""],
        failoverEnabled: localFailoverEnabled,
        failureThreshold: failureThreshold || 1,
        successThreshold: successThreshold || 1,
        healthCheckInterval: healthCheckInterval || 5000,
        healthCheckTimeout: healthCheckTimeout || 10000,
        healthCheckModel,
        proxyName: proxyName || '',
        rawConfigs,
      });
    }

    return () => {
      resetForm();
    }
  }, [props.value]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      resetForm();
    },
    handleSubmit: async () => {
      const values = await form.validateFields();

      if (providerConfig && typeof providerConfig.normalizeRawConfigs === 'function' && values.rawConfigs) {
        providerConfig.normalizeRawConfigs(values.rawConfigs);
      }

      const result = {
        type: values.type,
        name: values.name,
        tokens: values.tokens ? values.tokens.filter(v => v) : null,
        version: 0,
        protocol: values.protocol,
        tokenFailoverConfig: {
          enabled: values.failoverEnabled,
          failureThreshold: values.failureThreshold,
          successThreshold: values.successThreshold,
          healthCheckInterval: values.healthCheckInterval,
          healthCheckTimeout: values.healthCheckTimeout,
          healthCheckModel: values.healthCheckModel,
        },
        proxyName: values.proxyName,
        rawConfigs: values.rawConfigs,
      };

      return result;
    },
  }));

  function onOpenaiServerTypeChanged(value: string | null) {
    setOpenaiServerType(value);
  }

  function onProviderTypeChanged(value: string | null) {
    setProviderType(value);
    setProviderConfig(getProviderConfigByType(value));
  }

  function getProviderConfigByType(type: string | null) {
    return aiModelProviders.find(p => p.value === type) || null;
  }

  function openSecretRefModal() {
    setSecretRefModalVisible(true);
  }

  function closeSecretRefModal() {
    setSecretRefModalVisible(false);
  }

  return (
    <Form
      form={form}
      layout="vertical"
    >
      {/* 大模型供应商 */}
      <Form.Item
        label={t('llmProvider.providerForm.label.type')}
        required
        name="type"
        rules={[
          {
            required: true,
            message: t('llmProvider.providerForm.rules.typeRequired'),
          },
        ]}
      >
        <Select
          disabled={props.value}
          onChange={onProviderTypeChanged}
        >
          {
            aiModelProviders.filter(item => item.enabled !== false).map((item) => {
              const key = `llmProvider.providerTypes.${item.value}`;
              let text = t(key);
              text = text !== key ? text : item.label;
              return (
                <Select.Option
                  key={item.value}
                  value={item.value}
                >
                  {text}
                </Select.Option>
              )
            })
          }
        </Select>
      </Form.Item>

      {/* 服务名称 */}
      <Form.Item
        label={t('llmProvider.providerForm.label.serviceName')}
        required
        name="name"
        rules={[
          {
            required: true,
            message: t('llmProvider.providerForm.rules.serviceNameRequired'),
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={200}
          disabled={props.value}
        />
      </Form.Item>

      {/* 协议 */}
      <Form.Item
        label={t('llmProvider.providerForm.label.protocol')}
        required
        name="protocol"
        initialValue={protocolList[0].value}
      >
        <Select
          placeholder={t('llmProvider.providerForm.rules.protocol')}
        >
          {protocolList.map(item => (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* 凭证 */}
      {
        providerConfig && !providerConfig.useCustomCredentials &&
        <Form.List name="tokens" initialValue={[null]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {!fields.length ?
                <div
                  style={{ marginBottom: '8px' }}
                >
                  {t('llmProvider.columns.tokens')}
                </div> : null
              }

              {fields.map((field, index) => (
                <Form.Item
                  label={index === 0 ? t('llmProvider.columns.tokens') : ''}
                  required={false}
                  key={field.key}
                  style={{ marginBottom: '0.5rem' }}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        validator(rule, value) {
                          if (value) {
                            return Promise.resolve();
                          }
                          if (providerConfig) {
                            if (providerConfig.tokenRequired === false) {
                              return Promise.resolve();
                            }
                            if (typeof providerConfig.isTokenRequired === 'function' && !providerConfig.isTokenRequired(form.getFieldsValue())) {
                              return Promise.resolve();
                            }
                          }
                          return Promise.reject(t('llmProvider.providerForm.rules.tokenRequired'));
                        },
                      },
                    ]}
                    noStyle
                  >
                    <Input
                      style={{ width: '94%' }}
                    />
                  </Form.Item>
                  {/* 删除按钮 */}
                  <div style={{ display: "inline-block", width: '6%', textAlign: 'right' }}>
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
                <div style={{ marginTop: '1rem' }}>
                  <Link onClick={openSecretRefModal}>{t("llmProvider.providerForm.secretRefModal.entry")}</Link>
                </div>
              </Form.Item>
            </>
          )}
        </Form.List>
      }

      {
        providerType === 'openai' && (
          <>
            <Form.Item
              label={t('llmProvider.providerForm.label.openaiServerType')}
              required
              name="openaiServerType"
              initialValue="official"
            >
              <Select
                onChange={onOpenaiServerTypeChanged}
              >
                <Select.Option value="official">{t("llmProvider.providerForm.openaiServerType.official")}</Select.Option>
                <Select.Option value="custom">{t("llmProvider.providerForm.openaiServerType.custom")}</Select.Option>
              </Select>
            </Form.Item>
            {
              openaiServerType === "custom" && (
                <Form.List
                  name={["rawConfigs", "openaiCustomUrls"]}
                  initialValue={[null]}
                  rules={[
                    {
                      validator(rule, value) {
                        let protocol = '';
                        let contextPath = '';
                        for (const item of value) {
                          if (!item) {
                            continue;
                          }
                          let url;
                          try {
                            url = new URL(item);
                          } catch (e) {
                            return Promise.reject(t('llmProvider.providerForm.rules.invalidOpenaiCustomUrl') + item)
                          }
                          if (value.length > 1
                            && !/^(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(url.hostname)) {
                            return Promise.reject(t('llmProvider.providerForm.rules.openaiCustomUrlMultipleValuesWithIpOnly'))
                          }
                          if (protocol && url.protocol !== protocol) {
                            return Promise.reject(t('llmProvider.providerForm.rules.openaiCustomUrlInconsistentProtocols'))
                          }
                          protocol = url.protocol;
                          if (contextPath && url.pathname !== contextPath) {
                            return Promise.reject(t('llmProvider.providerForm.rules.openaiCustomUrlInconsistentContextPaths'))
                          }
                          contextPath = url.pathname;
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {!fields.length ?
                        <div
                          style={{ marginBottom: '8px' }}
                        >
                          {t('llmProvider.providerForm.label.openaiCustomUrl')}
                        </div> : null
                      }

                      {fields.map((field, index) => (
                        <Form.Item
                          label={index === 0 ? t('llmProvider.providerForm.label.openaiCustomUrl') : ''}
                          required
                          key={index}
                          style={{ marginBottom: '0.5rem' }}
                        >
                          <Form.Item
                            {...field}
                            noStyle
                            rules={[
                              {
                                required: true,
                                pattern: /http(s)?:\/\/.+/,
                                message: t('llmProvider.providerForm.rules.openaiCustomUrlRequired') || '',
                              },
                            ]}
                          >
                            <Input
                              allowClear
                              type="url"
                              style={{ width: '94%' }}
                              placeholder={t('llmProvider.providerForm.placeholder.openaiCustomUrlPlaceholder') || ''}
                            />
                          </Form.Item>
                          <div style={{ display: "inline-block", width: '6%', textAlign: 'right' }}>
                            <Button
                              type="dashed"
                              disabled={!(fields.length > 1)}
                              onClick={() => remove(field.name)}
                              icon={<MinusCircleOutlined />}
                            />
                          </div>
                        </Form.Item>
                      ))}
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
              )
            }
          </>
        )
      }

      {
        providerType === 'azure' && (
          <>
            <Form.Item
              label={t('llmProvider.providerForm.label.azureServiceUrl')}
              required
              name={["rawConfigs", "azureServiceUrl"]}
              rules={[
                {
                  required: true,
                  message: t('llmProvider.providerForm.rules.azureServiceUrlRequired'),
                },
              ]}
            >
              <Input
                allowClear
                type="url"
                placeholder={t('llmProvider.providerForm.placeholder.azureServiceUrlPlaceholder')}
              />
            </Form.Item>
          </>
        )
      }

      {
        providerType === 'ollama' && (
          <>
            <Form.Item
              label={t('llmProvider.providerForm.label.ollamaServerHost')}
              required
              name={["rawConfigs", "ollamaServerHost"]}
              rules={[
                {
                  required: true,
                  message: t('llmProvider.providerForm.rules.ollamaServerHostRequired'),
                },
              ]}
            >
              <Input
                showCount
                allowClear
                maxLength={256}
                placeholder={t('llmProvider.providerForm.placeholder.ollamaServerHostPlaceholder')}
              />
            </Form.Item>
            <Form.Item
              label={t('llmProvider.providerForm.label.ollamaServerPort')}
              required
              name={["rawConfigs", "ollamaServerPort"]}
              rules={[
                {
                  required: true,
                  message: t('llmProvider.providerForm.rules.ollamaServerPortRequired'),
                },
              ]}
            >
              <Input
                allowClear
                type="number"
                min={1}
                max={65535}
              />
            </Form.Item>
          </>
        )
      }

      {
        providerType === 'bedrock' && (
          <>
            <Form.Item
              label={t('llmProvider.providerForm.label.awsRegion')}
              required
              name={["rawConfigs", "awsRegion"]}
              rules={[
                {
                  required: true,
                  message: t('llmProvider.providerForm.rules.awsRegionRequired'),
                },
              ]}
            >
              <AutoComplete
                options={providerConfig.availableRegions.map(r => ({ label: r, value: r }))}
                filterOption={(inputValue, option: any) => {
                  return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }}
                allowClear
              />
            </Form.Item>
            <Form.Item
              label={t('llmProvider.providerForm.label.awsAccessKey')}
              required
              name={["rawConfigs", "awsAccessKey"]}
              rules={[
                {
                  required: true,
                  message: t('llmProvider.providerForm.rules.awsAccessKeyRequired'),
                },
              ]}
            >
              <Input
                showCount
                allowClear
                maxLength={256}
              />
            </Form.Item>
            <Form.Item
              label={t('llmProvider.providerForm.label.awsSecretKey')}
              required
              name={["rawConfigs", "awsSecretKey"]}
              rules={[
                {
                  required: true,
                  message: t('llmProvider.providerForm.rules.awsSecretKeyRequired'),
                },
              ]}
            >
              <Input
                showCount
                allowClear
                maxLength={256}
              />
            </Form.Item>
          </>
        )
      }

      {
        providerType === 'vertex' && (
          <>
            <Form.Item
              label={t('llmProvider.providerForm.label.vertexRegion')}
              required
              name={["rawConfigs", "vertexRegion"]}
              rules={[
                {
                  required: true,
                  message: t('llmProvider.providerForm.rules.vertexRegionRequired'),
                },
              ]}
            >
              <AutoComplete
                options={providerConfig.availableRegions.map(r => ({ label: r, value: r }))}
                filterOption={(inputValue, option: any) => {
                  return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }}
                allowClear
                maxLength={64}
              />
            </Form.Item>
            <Form.Item
              label={t('llmProvider.providerForm.label.vertexProjectId')}
              required
              name={["rawConfigs", "vertexProjectId"]}
              rules={[
                {
                  required: true,
                  message: t('llmProvider.providerForm.rules.vertexProjectIdRequired'),
                },
              ]}
            >
              <Input
                showCount
                allowClear
                maxLength={256}
              />
            </Form.Item>
            <Form.Item
              label={t('llmProvider.providerForm.label.vertexAuthKey')}
              tooltip={t('llmProvider.providerForm.label.vertexAuthKeyTooltip')}
              required
            >
              <Form.Item
                name={["rawConfigs", "vertexAuthKey"]}
                noStyle
                rules={[
                  {
                    validator(rule, value) {
                      if (!value) {
                        return Promise.reject(t('llmProvider.providerForm.rules.vertexAuthKeyRequired'));
                      }
                      try {
                        const authKeyObj = JSON.parse(value);
                        if (typeof authKeyObj !== 'object') {
                          return Promise.reject(t('llmProvider.providerForm.rules.vertexAuthKeyBadFormat'));
                        }
                        for (const key of ['client_email', 'private_key_id', 'private_key', 'token_uri']) {
                          if (!authKeyObj[key] || typeof authKeyObj[key] !== 'string' || !authKeyObj[key].trim()) {
                            return Promise.reject(t('llmProvider.providerForm.rules.vertexAuthKeyBadRequiredProperty', { key }));
                          }
                        }
                        return Promise.resolve();
                      } catch (e) {
                        return Promise.reject(t('llmProvider.providerForm.rules.vertexAuthKeyBadFormat'));
                      }
                    },
                  },
                ]}
              >
                <TextArea rows={15} />
              </Form.Item>
              <div style={{ marginTop: '1rem' }}>
                <Link onClick={openSecretRefModal}>{t("llmProvider.providerForm.secretRefModal.entry")}</Link>
              </div>
            </Form.Item>
            <Form.Item
              label={t('llmProvider.providerForm.label.vertexTokenRefreshAhead')}
              tooltip={t('llmProvider.providerForm.tooltips.vertexTokenRefreshAheadTooltip')}
              name={["rawConfigs", "vertexTokenRefreshAhead"]}
            >
              <InputNumber
                min={1}
                max={1800}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item label={t('llmProvider.providerForm.label.geminiSafetySettings')}>
              <Form.List name={["rawConfigs", "parsed", "geminiSafetySettings"]} initialValue={[]}>
                {(fields, { add, remove }) => (
                  <>
                    <div className="ant-table ant-table-small">
                      <div className="ant-table-content">
                        <table style={{ tableLayout: "auto" }}>
                          <thead className="ant-table-thead">
                            <tr>
                              <th className="ant-table-cell">{t("llmProvider.providerForm.label.geminiSafetyCategory")}</th>
                              <th className="ant-table-cell">{t("llmProvider.providerForm.label.geminiSafetyThreshold")}</th>
                              <th className="ant-table-cell">{t("misc.action")}</th>
                            </tr>
                          </thead>
                          <tbody className="ant-table-tbody">
                            {
                              fields.length && fields.map(({ key, name, ...restField }, index) => (
                                <tr className="ant-table-row ant-table-row-level-0" key={index}>
                                  <td className="ant-table-cell">
                                    <Form.Item
                                      name={[name, 'category']}
                                      noStyle
                                      rules={[
                                        {
                                          validator(rule, value) {
                                            if (!value) {
                                              return Promise.reject(t("llmProvider.providerForm.rules.geminiSafetyCategoryRequired"));
                                            }
                                            for (let i = 0; i < index; ++i) {
                                              const prevValue = form.getFieldValue([
                                                'rawConfigs',
                                                'parsed',
                                                'geminiSafetySettings',
                                                i,
                                                'category',
                                              ]);
                                              if (prevValue === value) {
                                                return Promise.reject(t("llmProvider.providerForm.rules.geminiSafetyCategoryDuplicated"));
                                              }
                                            }
                                            return Promise.resolve();
                                          },
                                        },
                                      ]}
                                    >
                                      <AutoComplete
                                        options={providerConfig.safetySettings.categories.map(r => ({ label: r, value: r }))}
                                        filterOption={(inputValue, option: any) => {
                                          return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }}
                                        style={{ width: "250px" }}
                                        allowClear
                                      />
                                    </Form.Item>
                                  </td>
                                  <td className="ant-table-cell">
                                    <Form.Item
                                      name={[name, 'threshold']}
                                      noStyle
                                      rules={[{ required: true, message: t("llmProvider.providerForm.rules.geminiSafetyThresholdRequired") || '' }]}
                                    >
                                      <AutoComplete
                                        options={providerConfig.safetySettings.thresholds.map(r => ({ label: r, value: r }))}
                                        filterOption={(inputValue, option: any) => {
                                          return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }}
                                        style={{ width: "250px" }}
                                        allowClear
                                      />
                                    </Form.Item>
                                  </td>
                                  <td className="ant-table-cell">
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                  </td>
                                </tr>
                              )) || (
                                <tr className="ant-table-row ant-table-row-level-0">
                                  <td className="ant-table-cell" colSpan={4}>
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: 0 }} />
                                  </td>
                                </tr>
                              )
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div>
                      <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add()}>
                        {t("llmProvider.providerForm.addGeminiSafetySetting")}
                      </Button>
                    </div>
                  </>)
                }
              </Form.List>
            </Form.Item>
          </>
        )
      }

      {/* 令牌降级 */}
      <Form.Item
        name="failoverEnabled"
        initialValue={false}
        label={t('llmProvider.providerForm.label.failoverEnabled')}
        valuePropName="checked"
        extra={t('llmProvider.providerForm.label.failoverEnabledExtra')}
      >
        <Switch onChange={e => setFailoverEnabled(e)} />
      </Form.Item>

      {
        failoverEnabled ?
          <>
            {/* 令牌不可用时需满足的最小连续请求失败次数 */}
            <Form.Item
              name="failureThreshold"
              label={t('llmProvider.providerForm.label.failureThreshold')}
              rules={[
                { required: true, message: t("llmProvider.providerForm.rules.failureThresholdRequired") },
              ]}
              initialValue={1}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            {/* 令牌可用时需满足的最小连续健康检测成功次数 */}
            <Form.Item
              name="successThreshold"
              label={t('llmProvider.providerForm.label.successThreshold')}
              rules={[
                { required: true, message: t("llmProvider.providerForm.rules.successThresholdRequired") },
              ]}
              initialValue={1}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            {/* 健康检测请求发起间隔 */}
            <Form.Item
              name="healthCheckInterval"
              label={t('llmProvider.providerForm.label.healthCheckInterval')}
              rules={[
                { required: true, message: t("llmProvider.providerForm.rules.healthCheckIntervalRequired") },
              ]}
              initialValue={5000}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            {/* 健康检测请求超时时间 */}
            <Form.Item
              name="healthCheckTimeout"
              label={t('llmProvider.providerForm.label.healthCheckTimeout')}
              rules={[
                { required: true, message: t("llmProvider.providerForm.rules.healthCheckTimeoutRequired") },
              ]}
              initialValue={10000}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            {/* 健康检测请求使用的模型名称 */}
            <Form.Item
              name="healthCheckModel"
              label={t('llmProvider.providerForm.label.healthCheckModel')}
              rules={[
                { required: true, message: t("llmProvider.providerForm.rules.healthCheckModelRequired") },
              ]}
            >
              <Input />
            </Form.Item>
          </>
          : null
      }

      <Form.Item
        label={t('serviceSource.serviceSourceForm.proxyName')}
        initialValue={''}
        style={{ flex: 1, marginRight: '8px' }}
      >
        <Form.Item name="proxyName" noStyle>
          <Select
            options={proxyServerOptions || []}
          />
        </Form.Item>
        <div>{t('serviceSource.serviceSourceForm.proxyServerLimitations')}</div>
      </Form.Item>

      <Modal
        title={t("llmProvider.providerForm.secretRefModal.title")}
        open={secretRefModalVisible}
        onOk={closeSecretRefModal}
        onCancel={closeSecretRefModal}
        footer={[
          <Button key="submit" type="primary" onClick={closeSecretRefModal}>
            OK
          </Button>,
        ]}
      >
        {t("llmProvider.providerForm.secretRefModal.content_brief")}
        <ul style={{ margin: '1rem 0' }}>
          <li>
            {t("llmProvider.providerForm.secretRefModal.content_sameNs")}
            <br />
            <Text code>{'${secret.secret-name.field-name}'}</Text>
            <br />
            {t("llmProvider.providerForm.secretRefModal.example")}
            <Text code>{'${secret.my-token-secret.openai-token}'}</Text>
          </li>
          <li>
            {t("llmProvider.providerForm.secretRefModal.content_diffNs")}
            <br />
            <Text code>{'${secret.ns-name/secret-name.field-name}'}</Text>
            <br />
            {t("llmProvider.providerForm.secretRefModal.example")}
            <Text code>{'${secret.ai-ns/my-token-secret.openai-token}'}</Text>
          </li>
        </ul>
        {t("llmProvider.providerForm.secretRefModal.roleConfig")}
      </Modal>
    </Form>
  );
});

export default ProviderForm;
