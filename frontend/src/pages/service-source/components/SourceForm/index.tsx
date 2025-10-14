/* eslint-disable max-lines */
import { OptionItem } from '@/interfaces/common';
import { ProxyServer } from '@/interfaces/proxy-server';
import { Route } from '@/interfaces/route';
import { getServiceSourceTypeConfig, isNacosType, ServiceProtocols, ServiceSourceTypeConfig, ServiceSourceTypes } from '@/interfaces/service-source';
import { getGatewayRoutes } from '@/services';
import { getProxyServers } from '@/services/proxy-server';
import { DeleteOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, Select, Tooltip } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useRequest } from 'ice';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const STATIC_SERVICE_PORT = 80;

const SourceForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { value } = props;
  const [form] = Form.useForm();
  const [sourceType, setSourceType] = useState<string | null>();
  const [sourceTypeConfig, setSourceTypeConfig] = useState<ServiceSourceTypeConfig | null>();
  const [authEnabled, setAuthEnabled] = useState<boolean>();
  const [initAuthEnabled, setInitAuthEnabled] = useState<boolean>();
  const [mcpEnabled, setMcpEnabled] = useState<boolean>();
  const [vportEnabled, setVportEnabled] = useState<boolean>();
  const [protocol, setProtocol] = useState<string | null>();
  const [usingTlsProtocol, setUsingTlsProtocol] = useState<boolean>();

  const [domainOptions, setDomainOptions] = useState<OptionItem[]>();
  const domainsResult = useRequest(getGatewayRoutes, {
    manual: true,
    onSuccess: (routes: Route[]) => {
      const domainsWithRoute = new Set<string>();
      routes && routes.forEach(route => {
        const { domains } = route;
        domains && domains.forEach(domain => domainsWithRoute.add(domain));
      });
      setDomainOptions([...domainsWithRoute.values()].map(domain => ({ label: domain, value: domain })));
    },
  });
  const [proxyServerOptions, setProxyServerOptions] = useState<OptionItem[]>();
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

  const resetFields = () => {
    form.resetFields();

    if (value) {
      setSourceType(value.type);
      setSourceTypeConfig(getServiceSourceTypeConfig(value.type));
      if ([ServiceSourceTypes.static.key, ServiceSourceTypes.dns.key].indexOf(value.type) !== -1) {
        value.domainForEdit = value.domain ? value.domain.replaceAll(',', '\n') : '';
      }
      const authEnabledLocal = value.authN && value.authN.enabled;
      setInitAuthEnabled(authEnabledLocal);
      setAuthEnabled(authEnabledLocal);
      const mcpEnabledLocal = !!value.properties.enableMCPServer;
      setMcpEnabled(mcpEnabledLocal);
      const vportEnabledLocal = !!(value.vport && (
        value.vport.defaultValue
        || value.vport.default
        || (value.vport.servicesVport && value.vport.servicesVport.length > 0)
        || (value.vport.vportServices && value.vport.vportServices.length > 0)
      ));
      setVportEnabled(vportEnabledLocal);
      setProtocol(value.protocol);
    } else {
      setSourceType(null);
      setSourceTypeConfig(null)
      setInitAuthEnabled(false);
      setAuthEnabled(false);
      setUsingTlsProtocol(false);
      setProtocol(null);
      setMcpEnabled(false);
      setVportEnabled(false);
    }

    const valueToSet = value || {};
    // normalize vport structure for edit mode
    const existingVport = valueToSet.vport || {};
    if (existingVport) {
      // Normalize legacy shapes to { servicesVport: [{ name, value }] }
      const legacyArray = existingVport.servicesVport || existingVport.vportServices || existingVport.services;
      if (Array.isArray(legacyArray) && legacyArray.length > 0) {
        const first = legacyArray[0];
        if (first && typeof first === 'object' && !('name' in first) && Object.keys(first).length === 1) {
          const normalized = legacyArray
            .map((obj) => Object.entries(obj)[0])
            .filter(Boolean)
            .map(([name, port]) => ({ name, value: Number(port as any) }));
          existingVport.servicesVport = normalized;
        } else if (first && typeof first === 'object' && 'name' in first && 'value' in first) {
          existingVport.servicesVport = legacyArray;
        }
      }
      if ('default' in existingVport && !('defaultValue' in existingVport)) {
        existingVport.defaultValue = existingVport.default;
        delete existingVport.default;
      }
      // Build helper list for form list
      valueToSet.vportFormServices = (existingVport.servicesVport || []).map((s) => ({ name: s.name, port: s.value }));
    }
    valueToSet.authN = Object.assign({ enabled: false }, valueToSet.authN);
    valueToSet.authN.enabled = valueToSet.authN.enabled || false;
    valueToSet.properties = Object.assign({ enableMCPServer: false }, valueToSet.properties);
    valueToSet.properties.enableMCPServer = valueToSet.properties.enableMCPServer || false;
    valueToSet.properties.mcpServerBaseUrl = valueToSet.properties.mcpServerBaseUrl || '/mcp';
    valueToSet.protocol = valueToSet.protocol || ServiceProtocols.unspecified.key;
    valueToSet.proxyName = valueToSet.proxyName || '';
    // Set vportEnabled based on whether vport configuration exists
    const hasVportConfig = !!(
      existingVport
      && (
        existingVport.defaultValue
        || existingVport.default
        || (existingVport.servicesVport && existingVport.servicesVport.length > 0)
        || (existingVport.vportServices && existingVport.vportServices.length > 0)
      )
    );
    valueToSet.vportEnabled = hasVportConfig;
    updateProtocol(valueToSet.protocol);
    form.setFieldsValue(valueToSet);
  };

  useEffect(() => {
    resetFields();
    if (domainOptions == null) {
      domainsResult.run();
    }
    if (proxyServerOptions == null) {
      proxyServersResult.run();
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      resetFields();
    },
    handleSubmit: async () => {
      const values = await form.validateFields();
      if ([ServiceSourceTypes.static.key, ServiceSourceTypes.dns.key].indexOf(values.type) !== -1) {
        if (values.domainForEdit) {
          values.domain = values.domainForEdit.split('\n').map(d => d.trim()).filter(d => d).join(',');
        } else {
          values.domain = '';
        }

        if (values.type === ServiceSourceTypes.static.key) {
          values.port = STATIC_SERVICE_PORT;
        }
      } else {
        values.protocol = null;
      }
      if (!isTlsProtocol(values.protocol)) {
        values.sni = null;
      }
      // Build vport payload only for nacos/eureka and when vport is enabled
      if ((isNacosType(values.type) || values.type === ServiceSourceTypes.eureka.key) && vportEnabled) {
        const defaultVport = values.vport && (values.vport.defaultValue ?? values.vport.default);
        const servicePairs = values.vportFormServices || [];
        const servicesArray = (servicePairs || [])
          .filter((p) => p && p.name && p.port)
          .map((p) => ({ name: p.name, value: Number(p.port) }));
        const parsedDefault = Number(defaultVport);
        const hasDefault = Number.isFinite(parsedDefault) && parsedDefault >= 1 && parsedDefault <= 65535;
        const hasServices = servicesArray && servicesArray.length > 0;
        if (hasDefault || hasServices) {
          values.vport = Object.assign({}, values.vport, {
            defaultValue: hasDefault ? parsedDefault : undefined,
            servicesVport: hasServices ? servicesArray : undefined,
          });
          // Ensure keys are removed if any existed
          delete values.vport.default;
          delete values.vport.services;
        } else {
          delete values.vport;
        }
        delete values.vportFormServices;
      } else {
        delete values.vport;
        delete values.vportFormServices;
      }
      return values;
    },
  }));

  function selectServiceSourceType(type) {
    setSourceType(type)
    setSourceTypeConfig(getServiceSourceTypeConfig(type));
    if (isNacosType(type)) {
      const groups = form.getFieldValue(["properties", "nacosGroups"]);
      if (!groups || !groups.length) {
        form.setFieldValue(["properties", "nacosGroups"], ["DEFAULT_GROUP"]);
      }
    } else if (type === ServiceSourceTypes.consul.key) {
      const dc = form.getFieldValue(["properties", "consulDatacenter"]);
      if (!dc) {
        form.setFieldValue(["properties", "consulDatacenter"], "dc1");
      }
    }
    let newProtocol: string | null = null;
    if ([ServiceSourceTypes.static.key, ServiceSourceTypes.dns.key].indexOf(type) !== -1) {
      newProtocol = form.getFieldValue("protocol") || ServiceProtocols.unspecified.key;
    }
    form.setFieldValue("protocol", newProtocol);
    updateProtocol(newProtocol);
  }

  function updateProtocol(newProtocol: string | null) {
    setProtocol(newProtocol);
    setUsingTlsProtocol(isTlsProtocol(newProtocol));
  }

  function isTlsProtocol(newProtocol: string | null) {
    const protocolObj = newProtocol && ServiceProtocols[newProtocol];
    return protocolObj && protocolObj.tlsEnabled;
  }

  function isProxyApplicable(serviceSourceType: string | null, serviceProtocol: string | null) {
    switch (serviceSourceType) {
      case ServiceSourceTypes.dns.key:
        break;
      default:
        return false;
    }
    switch (serviceProtocol) {
      case ServiceProtocols.https.key:
        break;
      default:
        return false;
    }
    return true;
  }

  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        label={t('serviceSource.serviceSourceForm.type')}
        required
        name="type"
        tooltip={t('serviceSource.serviceSourceForm.typeTooltip')}
      >
        <Select
          allowClear
          disabled={value}
          placeholder={t('serviceSource.serviceSourceForm.typePlaceholder')}
          onChange={(v) => selectServiceSourceType(v)}
        >
          {
            // eslint-disable-next-line @iceworks/best-practices/recommend-polyfill
            Object.entries(ServiceSourceTypes).map(([k, v]) =>
              v.enabled && (<Option key={v.key} value={v.key}>{v.i18n ? t(v.name) : v.name}</Option>))
          }
        </Select>
      </Form.Item>
      <Form.Item
        label={t('serviceSource.serviceSourceForm.name')}
        required
        name="name"
        rules={[
          {
            required: true,
            pattern: /^(?!-)[A-Za-z0-9-]{0,62}[A-Za-z0-9]$/,
            message: t('serviceSource.serviceSourceForm.nameRequired'),
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={63}
          disabled={value}
          placeholder={t('serviceSource.serviceSourceForm.namePlaceholder')}
        />
      </Form.Item>
      {
        sourceType && [ServiceSourceTypes.static.key, ServiceSourceTypes.dns.key].indexOf(sourceType || '') === -1 &&
        (
          <>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.domain')}
              required
              name="domain"
              tooltip={t('serviceSource.serviceSourceForm.domainTooltip')}
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.domainRequired'),
                },
              ]}
            >
              <Input
                showCount
                allowClear
                maxLength={256}
                placeholder={t('serviceSource.serviceSourceForm.domainPlaceholder')}
              />
            </Form.Item>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.port')}
              required
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.portRequired'),
                },
              ]}
            >
              <Form.Item name="port" noStyle>
                <Input
                  allowClear
                  type="number"
                  min={1}
                  max={65535}
                  placeholder={t('serviceSource.serviceSourceForm.portPlaceholder')}
                />
              </Form.Item>
              {
                [ServiceSourceTypes.nacos2.key, ServiceSourceTypes.nacos3.key].indexOf(sourceType) !== -1 &&
                (
                  <div>{t('serviceSource.serviceSourceForm.nacos2PortNote')}</div>
                )
              }
            </Form.Item>
            {
              sourceTypeConfig && sourceTypeConfig.customVportSupported && (
                <>
                  <Form.Item
                    label={t('serviceSource.serviceSourceForm.vportEnabled')}
                    tooltip={t('serviceSource.serviceSourceForm.vportTooltip')}
                    name="vportEnabled"
                  >
                    <Select
                      onChange={(v) => setVportEnabled(v)}
                    >
                      {/* eslint-disable-next-line react/jsx-boolean-value */}
                      <Option key={0} value={false}>{t('misc.no')}</Option>
                      {/* eslint-disable-next-line react/jsx-boolean-value */}
                      <Option key={1} value={true}>{t('misc.yes')}</Option>
                    </Select>
                  </Form.Item>
                  {
                    vportEnabled && (
                      <>
                        <Form.Item
                          name={['vport', 'defaultValue']}
                          label={t('serviceSource.serviceSourceForm.vport')}
                          tooltip={t('serviceSource.serviceSourceForm.vportDefaultTooltip')}
                          rules={[
                            {
                              validator: (_, val) => {
                                if (val) {
                                  const port = parseInt(val);
                                  if (isNaN(port) || port <= 0 || port > 65535) {
                                    return Promise.reject(t('serviceSource.serviceSourceForm.vportServicePortInvalid'));
                                  }
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <Input
                            allowClear
                            type="number"
                            min={1}
                            max={65535}
                            placeholder={t('serviceSource.serviceSourceForm.vportDefaultPlaceholder')}
                          />
                        </Form.Item>
                        <Form.List name="vportFormServices">
                          {(fields, { add, remove }) => (
                            <div style={{ marginBottom: 24 }}>
                              <div style={{
                                border: 'none',
                                borderRadius: '0',
                                backgroundColor: 'transparent',
                              }}
                              >
                                {/* Table Header */}
                                <div style={{
                                  display: 'flex',
                                  padding: '12px 0',
                                  borderBottom: '1px solid #f0f0f0',
                                  backgroundColor: 'transparent',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  color: '#262626',
                                }}
                                >
                                  <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRight: '1px solid #f0f0f0',
                                    paddingRight: '16px',
                                  }}
                                  >
                                    <label>{t('serviceSource.serviceSourceForm.vportServiceName')}</label>
                                    <Tooltip title={t('serviceSource.serviceSourceForm.vportServiceNamePlaceholder')}>
                                      <Button
                                        type="text"
                                        size="small"
                                        icon={<QuestionCircleOutlined />}
                                        style={{
                                          color: '#8c8c8c',
                                          minWidth: 'auto',
                                          width: '16px',
                                          height: '16px',
                                          marginLeft: '4px',
                                        }}
                                      />
                                    </Tooltip>
                                  </div>
                                  <div style={{
                                    width: '150px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRight: '1px solid #f0f0f0',
                                    paddingLeft: '16px',
                                    paddingRight: '16px',
                                  }}
                                  >
                                    <label>{t('serviceSource.serviceSourceForm.vportServicePort')}</label>
                                    <Tooltip title="1-65535">
                                      <Button
                                        type="text"
                                        size="small"
                                        icon={<QuestionCircleOutlined />}
                                        style={{
                                          color: '#8c8c8c',
                                          minWidth: 'auto',
                                          width: '16px',
                                          height: '16px',
                                          marginLeft: '4px',
                                        }}
                                      />
                                    </Tooltip>
                                  </div>
                                  <div style={{
                                    width: '60px',
                                    textAlign: 'center',
                                    paddingLeft: '16px',
                                  }}
                                  >
                                    <label>{t('serviceSource.serviceSourceForm.vportServiceAction')}</label>
                                  </div>
                                </div>

                                {/* Table Content */}
                                {fields.length > 0 ? (
                                  fields.map((field, fieldIndex) => (
                                    <div
                                      key={`serviceLevelVportEntry_${field.name}`}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderBottom: fieldIndex === fields.length - 1 ? 'none' : '1px solid #f0f0f0',
                                      }}
                                    >
                                      <Form.Item
                                        {...field}
                                        name={[field.name, 'name']}
                                        key={`serviceLevelVportEntry_${field.name}_name`}
                                        rules={[
                                          {
                                            required: true,
                                            message: t('serviceSource.serviceSourceForm.vportServiceNameRequired'),
                                          },
                                          {
                                            validator: (_, val) => {
                                              if (!val) {
                                                return Promise.resolve();
                                              }
                                              const currentFormValues = form.getFieldsValue();
                                              const vportFormServices = currentFormValues.vportFormServices || [];
                                              const duplicateCount = vportFormServices.filter(
                                                (service, serviceIndex) => {
                                                  return service && service.name === val && serviceIndex !== field.name;
                                                },
                                              ).length;
                                              if (duplicateCount > 0) {
                                                return Promise.reject(t('serviceSource.serviceSourceForm.vportServiceDupError'));
                                              }
                                              return Promise.resolve();
                                            },
                                          },
                                        ]}
                                        style={{
                                          flex: 1,
                                          margin: 0,
                                          paddingRight: '16px',
                                        }}
                                      >
                                        <Input
                                          placeholder={t('serviceSource.serviceSourceForm.vportServiceNamePlaceholder')}
                                        />
                                      </Form.Item>
                                      <Form.Item
                                        {...field}
                                        key={`serviceLevelVportEntry_${field.name}_port`}
                                        name={[field.name, 'port']}
                                        style={{
                                          width: '150px',
                                          margin: 0,
                                          paddingLeft: '16px',
                                          paddingRight: '16px',
                                        }}
                                        rules={[
                                          {
                                            validator: (_, val) => {
                                              if (!val) {
                                                return Promise.reject(t('serviceSource.serviceSourceForm.vportServicePortRequired'));
                                              }
                                              const port = parseInt(val);
                                              if (isNaN(port) || port <= 0 || port > 65535) {
                                                return Promise.reject(t('serviceSource.serviceSourceForm.vportServicePortInvalid'));
                                              }
                                              return Promise.resolve();
                                            },
                                          },
                                        ]}
                                      >
                                        <Input
                                          type="number"
                                          min={1}
                                          max={65535}
                                          placeholder={t('serviceSource.serviceSourceForm.vportServicePortPlaceholder')}
                                        />
                                      </Form.Item>
                                      <div
                                        key={`serviceLevelVportEntry_${field.name}_operations`}
                                        style={{
                                          width: '60px',
                                          textAlign: 'center',
                                          paddingLeft: '16px',
                                        }}
                                      >
                                        <Tooltip title={t('serviceSource.serviceSourceForm.vportRemove')}>
                                          <Button
                                            type="text"
                                            onClick={() => remove(field.name)}
                                            icon={<DeleteOutlined />}
                                            style={{ color: '#000000' }}
                                          />
                                        </Tooltip>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div style={{
                                    padding: '20px 0',
                                    borderLeft: 'none',
                                    borderRight: 'none',
                                  }}
                                  >
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                  </div>
                                )}
                              </div>

                              <Button
                                type="link"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                                style={{
                                  color: '#1890ff',
                                  padding: '4px 0',
                                  height: 'auto',
                                  fontSize: '14px',
                                  marginTop: '8px',
                                }}
                              >
                                {t('serviceSource.serviceSourceForm.vportAdd')}
                              </Button>
                            </div>
                          )}
                        </Form.List>
                      </>
                    )
                  }
                </>
              )
            }
          </>
        )
      }
      {
        sourceType === ServiceSourceTypes.zookeeper.key && (
          <>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.zkServicesPath')}
              name={['properties', 'zkServicesPath']}
              tooltip={t('serviceSource.serviceSourceForm.zkServicesPathTooltip')}
            >
              <Select
                allowClear
                mode="tags"
                placeholder={t('serviceSource.serviceSourceForm.zkServicesPathPlaceholder')}
              />
            </Form.Item>
          </>
        )
      }
      {
        isNacosType(sourceType || '') && (
          <>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.authEnabled')}
              name={['authN', 'enabled']}
            >
              <Select
                onChange={(v) => setAuthEnabled(v)}
              >
                {/* eslint-disable-next-line react/jsx-boolean-value */}
                <Option key={0} value={false}>{t('misc.no')}</Option>
                {/* eslint-disable-next-line react/jsx-boolean-value */}
                <Option key={1} value={true}>{t('misc.yes')}</Option>
              </Select>
            </Form.Item>
            {
              authEnabled && (
                <>
                  {
                    initAuthEnabled && (
                      <Form.Item>
                        <span className="ant-form-text">{t('serviceSource.serviceSourceForm.leaveAuthUnchanged')}</span>
                      </Form.Item>
                    )
                  }
                  <Form.Item
                    label={t('serviceSource.serviceSourceForm.nacosUsername')}
                    name={['authN', 'properties', 'nacosUsername']}
                    rules={[
                      {
                        required: !initAuthEnabled,
                        message: t('serviceSource.serviceSourceForm.nacosUsernameRequired'),
                      },
                    ]}
                  >
                    <Input
                      allowClear
                      maxLength={256}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t('serviceSource.serviceSourceForm.nacosPassword')}
                    name={['authN', 'properties', 'nacosPassword']}
                    rules={[
                      {
                        required: !initAuthEnabled,
                        message: t('serviceSource.serviceSourceForm.nacosPasswordRequired'),
                      },
                    ]}
                  >
                    <Input
                      allowClear
                      type="password"
                      maxLength={256}
                    />
                  </Form.Item>
                </>
              )
            }
            {
              <>
                <Form.Item
                  label={t('serviceSource.serviceSourceForm.nacosNamespaceId')}
                  name={['properties', 'nacosNamespaceId']}
                  rules={[
                    {
                      message: t('serviceSource.serviceSourceForm.nacosNamespaceIdRequired'),
                    },
                  ]}
                >
                  <Input
                    showCount
                    allowClear
                    maxLength={256}
                    placeholder={t('serviceSource.serviceSourceForm.nacosNamespaceIdPlaceholder')}
                  />
                </Form.Item>
                <Form.Item
                  label={t('serviceSource.serviceSourceForm.nacosGroups')}
                  name={['properties', 'nacosGroups']}
                  rules={[
                    {
                      required: true,
                      message: t('serviceSource.serviceSourceForm.nacosGroupsRequired'),
                    },
                  ]}
                >
                  <Select
                    mode="tags"
                    allowClear
                    placeholder={t('serviceSource.serviceSourceForm.nacosGroupsPlaceholder')}
                    options={[{ value: "DEFAULT_GROUP" }]}
                  />
                </Form.Item>
              </>
            }
          </>)
      }
      {
        sourceType === ServiceSourceTypes.consul.key && (
          <>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.consulDatacenter')}
              name={['properties', 'consulDatacenter']}
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.consulDatacenterRequired'),
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
              label={t('serviceSource.serviceSourceForm.consulServiceTag')}
              name={['properties', 'consulServiceTag']}
              tooltip={t('serviceSource.serviceSourceForm.consulServiceTagTooltip')}
            >
              <Input
                showCount
                allowClear
                maxLength={256}
                placeholder={t('serviceSource.serviceSourceForm.consulServiceTagPlaceholder')}
              />
            </Form.Item>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.authEnabled')}
              name={['authN', 'enabled']}
            >
              <Select
                onChange={(v) => setAuthEnabled(v)}
              >
                {/* eslint-disable-next-line react/jsx-boolean-value */}
                <Option key={0} value={false}>{t('misc.no')}</Option>
                {/* eslint-disable-next-line react/jsx-boolean-value */}
                <Option key={1} value={true}>{t('misc.yes')}</Option>
              </Select>
            </Form.Item>
            {
              authEnabled && (
                <>
                  {
                    initAuthEnabled && (
                      <Form.Item>
                        <span className="ant-form-text">{t('serviceSource.serviceSourceForm.leaveAuthUnchanged')}</span>
                      </Form.Item>
                    )
                  }
                  <Form.Item
                    label={t('serviceSource.serviceSourceForm.consulToken')}
                    name={['authN', 'properties', 'consulToken']}
                    rules={[
                      {
                        required: !initAuthEnabled,
                        message: t('serviceSource.serviceSourceForm.consulTokenRequired'),
                      },
                    ]}
                  >
                    <Input
                      allowClear
                      maxLength={256}
                    />
                  </Form.Item>
                </>
              )
            }
          </>
        )
      }
      {
        sourceType === ServiceSourceTypes.static.key && (
          <>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.servicePort')}
            >
              <span className="ant-form-text">{STATIC_SERVICE_PORT}</span>
            </Form.Item>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.serviceStaticAddresses')}
              name={['domainForEdit']}
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.serviceStaticAddressesRequired'),
                },
              ]}
            >
              <TextArea
                showCount
                allowClear
                maxLength={4096}
                rows={10}
                placeholder={t('serviceSource.serviceSourceForm.serviceStaticAddressesPlaceholder')}
              />
            </Form.Item>
          </>
        )
      }
      {
        sourceType === ServiceSourceTypes.dns.key && (
          <>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.servicePort')}
              required
              name="port"
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.servicePortRequired'),
                },
              ]}
            >
              <Input
                allowClear
                type="number"
                min={1}
                max={65535}
                placeholder={t('serviceSource.serviceSourceForm.servicePortPlaceholder')}
              />
            </Form.Item>
            <Form.Item
              label={t('serviceSource.serviceSourceForm.serviceDomains')}
              name={['domainForEdit']}
              rules={[
                {
                  required: true,
                  message: t('serviceSource.serviceSourceForm.serviceDomainsRequired'),
                },
              ]}
            >
              <TextArea
                showCount
                allowClear
                maxLength={4096}
                rows={5}
                placeholder={t('serviceSource.serviceSourceForm.serviceDomainsPlaceholder')}
              />
            </Form.Item>
          </>
        )
      }
      {
        (sourceType === ServiceSourceTypes.static.key || sourceType === ServiceSourceTypes.dns.key) && (
          <Form.Item
            label={t('serviceSource.serviceSourceForm.protocol')}
            name="protocol"
          >
            <Select
              onChange={(v) => updateProtocol(v)}
            >
              {
                // eslint-disable-next-line @iceworks/best-practices/recommend-polyfill
                Object.entries(ServiceProtocols).map(([k, v]) =>
                  (<Option key={k} value={v.key}>{v.i18n ? t(v.name) : v.name}</Option>))
              }
            </Select>
          </Form.Item>
        )
      }
      {
        usingTlsProtocol && (
          <Form.Item
            label={t('serviceSource.serviceSourceForm.sni')}
            name="sni"
          >
            <Input
              allowClear
              maxLength={256}
              placeholder={form.getFieldValue('type') === ServiceSourceTypes.dns.key
                && t('serviceSource.serviceSourceForm.sniPlaceholderForDns') || ''}
            />
          </Form.Item>
        )
      }
      {
        isProxyApplicable(sourceType, protocol) && (
          <Form.Item
            label={t('serviceSource.serviceSourceForm.proxyName')}
            style={{ flex: 1, marginRight: '8px' }}
          >
            <Form.Item name="proxyName" noStyle>
              <Select
                options={proxyServerOptions || []}
              />
            </Form.Item>
            <div>{t('serviceSource.serviceSourceForm.proxyServerLimitations')}</div>
          </Form.Item>
        )
      }
      {
        sourceTypeConfig && sourceTypeConfig.mcpSupported &&
        <>
          <Form.Item
            label={t('serviceSource.serviceSourceForm.mcpServerEnabled')}
            name={['properties', 'enableMCPServer']}
          >
            <Select
              onChange={(v) => setMcpEnabled(v)}
            >
              {/* eslint-disable-next-line react/jsx-boolean-value */}
              <Option key={0} value={false}>{t('misc.no')}</Option>
              {/* eslint-disable-next-line react/jsx-boolean-value */}
              <Option key={1} value={true}>{t('misc.yes')}</Option>
            </Select>
          </Form.Item>
          {
            mcpEnabled && (
              <>
                <Form.Item
                  label={t('serviceSource.serviceSourceForm.mcpServerBaseUrl')}
                  name={['properties', 'mcpServerBaseUrl']}
                  rules={[
                    {
                      required: true,
                      message: t('serviceSource.serviceSourceForm.mcpServerBaseUrlRequired'),
                    },
                    {
                      pattern: /^\/[^?]*$/,
                      message: t('serviceSource.serviceSourceForm.mcpServerBaseUrlBadFormat'),
                    },
                  ]}
                >
                  <Input
                    allowClear
                    maxLength={256}
                  />
                </Form.Item>
                <div style={{ display: 'flex' }}>
                  <Form.Item
                    label={t('serviceSource.serviceSourceForm.mcpServerExportDomains')}
                    name={['properties', 'mcpServerExportDomains']}
                    style={{ flex: 1, marginRight: '8px' }}
                    extra={t("serviceSource.serviceSourceForm.mcpServerExportDomainsOnlyDomainsWithRoute")}
                  >
                    <Select
                      showSearch
                      allowClear
                      mode="multiple"
                      placeholder={t('serviceSource.serviceSourceForm.mcpServerExportDomainsPlaceholder')}
                      options={domainOptions || []}
                    />
                  </Form.Item>
                </div>
              </>
            )
          }
          {
            mcpEnabled && sourceType === ServiceSourceTypes.nacos3.key &&
            <div>
              {t('serviceSource.serviceSourceForm.mcpServerNacos3NoteUrl')}
              <ul>
                <li>
                  {
                    `http://{${t('serviceSource.serviceSourceForm.mcpServerExportDomains')}}`
                    + `/{${t('serviceSource.serviceSourceForm.mcpServerBaseUrl')}}`
                    + `/${t('serviceSource.serviceSourceForm.mcpServerNacos3McpServerName')}` +
                    `/${t('serviceSource.serviceSourceForm.mcpServerNacos3McpServerPath')}`
                  }
                </li>
                <li>{t('serviceSource.serviceSourceForm.mcpServerNacos3NoteSse')}</li>
              </ul>
              {t('serviceSource.serviceSourceForm.mcpServerNacos3NoteRoute')}
            </div>
          }
        </>
      }
    </Form>
  );
});

export default SourceForm;
