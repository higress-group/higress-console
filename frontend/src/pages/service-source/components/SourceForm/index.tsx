import { OptionItem } from '@/interfaces/common';
import { Route } from '@/interfaces/route';
import { getServiceSourceTypeConfig, isNacosType, ServiceProtocols, ServiceSourceTypeConfig, ServiceSourceTypes } from '@/interfaces/service-source';
import { getGatewayRoutes } from '@/services';
import { Form, Input, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useRequest } from 'ice';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const SourceForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { value } = props;
  const [form] = Form.useForm();
  const [sourceType, setSourceType] = useState<string | null>();
  const [sourceTypeConfig, setSourceTypeConfig] = useState<ServiceSourceTypeConfig | null>();
  const [authEnabled, setAuthEnabled] = useState<boolean>();
  const [initAuthEnabled, setInitAuthEnabled] = useState<boolean>();
  const [mcpEnabled, setMcpEnabled] = useState<boolean>();
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
    } else {
      setSourceType(null);
      setSourceTypeConfig(null)
      setInitAuthEnabled(false);
      setAuthEnabled(false);
      setUsingTlsProtocol(false);
      setMcpEnabled(false);
    }

    const valueToSet = value || {};
    valueToSet.authN = Object.assign({ enabled: false }, valueToSet.authN);
    valueToSet.authN.enabled = valueToSet.authN.enabled || false;
    valueToSet.properties = Object.assign({ enableMCPServer: false }, valueToSet.properties);
    valueToSet.properties.enableMCPServer = valueToSet.properties.enableMCPServer || false;
    valueToSet.properties.mcpServerBaseUrl = valueToSet.properties.mcpServerBaseUrl || '/mcp';
    valueToSet.protocol = valueToSet.protocol || ServiceProtocols.unspecified.key;
    updateUsingTlsProtocol(valueToSet.protocol);
    form.setFieldsValue(valueToSet);
  };

  useEffect(() => {
    resetFields();
    if (domainOptions == null) {
      domainsResult.run();
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
          values.port = 80;
        }
      } else {
        values.protocol = null;
      }
      updateUsingTlsProtocol(values.protocol);
      if (!usingTlsProtocol) {
        values.sni = null;
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
    let protocol: string | null = null;
    if ([ServiceSourceTypes.static.key, ServiceSourceTypes.dns.key].indexOf(type) !== -1) {
      protocol = form.getFieldValue("protocol") || ServiceProtocols.unspecified.key;
    }
    form.setFieldValue("protocol", protocol);
    updateUsingTlsProtocol(protocol);
  }

  function updateUsingTlsProtocol(protocol: string | null) {
    const protocolObj = protocol && ServiceProtocols[protocol];
    setUsingTlsProtocol(protocolObj && protocolObj.tlsEnabled);
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
              name="port"
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
              onChange={(v) => updateUsingTlsProtocol(v)}
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
    </Form >
  );
});

export default SourceForm;