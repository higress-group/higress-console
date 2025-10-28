import i18n, { lngs } from '@/i18n';
import { OptionItem } from '@/interfaces/common';
import { Consumer, CredentialType } from '@/interfaces/consumer';
import { DEFAULT_DOMAIN, Domain } from '@/interfaces/domain';
import { upstreamServiceToString } from '@/interfaces/route';
import { getGatewayDomains, getGatewayServices } from '@/services';
import { getConsumers } from '@/services/consumer';
import { QuestionCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Checkbox, Form, Input, Select, Switch, Tooltip, Button, Modal } from 'antd';
import { uniqueId } from "lodash";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FactorGroup from '../FactorGroup';
import KeyValueGroup from '../KeyValueGroup';
import { HistoryButton } from '@/pages/ai/components/RouteForm/Components';
import DubboConfigForm from '../DubboConfigForm';

const { Option } = Select;

const MethodOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
  { label: "OPTIONS", value: "OPTIONS" },
  { label: "HEAD", value: "HEAD" },
  { label: "PATCH", value: "PATCH" },
  { label: "TRACE", value: "TRACE" },
  { label: "CONNECT", value: "CONNECT" },
];

const RouteForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();

  const { value } = props;
  const [form] = Form.useForm();
  const [serviceOptions, setServiceOptions] = useState<OptionItem[]>([]);
  const [domainOptions, setDomainOptions] = useState<OptionItem[]>([]);
  const [authConfig_enabled, setAuthConfigEnabled] = useState(false);
  const [dubboConfig_enabled, setDubboConfigEnabled] = useState(false);
  const [dubboConfigModalVisible, setDubboConfigModalVisible] = useState(false);
  const [dubboConfig, setDubboConfig] = useState<DubboConfig | undefined>();
  const servicesRef = useRef(new Map());
  const { data: _services = [] } = useRequest(getGatewayServices);
  const { data: _domains = [] } = useRequest(getGatewayDomains);

  const [consumerList, setConsumerList] = useState<Consumer[]>([]);
  const consumerResult = useRequest(getConsumers, {
    onSuccess: (result) => {
      const consumers = (result || []) as Consumer[];
      setConsumerList(consumers);
    },
  });

  useEffect(() => {
    form.resetFields();
    const _serviceOptions: OptionItem[] = [];
    const serviceKeys = new Set<string>()
    _services && _services.forEach(service => {
      const text = upstreamServiceToString(service);
      if (serviceKeys.has(text)) {
        // Ignore duplicated keys to avoid UI refresh issues.
        return;
      }
      serviceKeys.add(text)
      _serviceOptions.push({ label: text, value: text });
      servicesRef.current.set(text, service);
    });
    setServiceOptions(_serviceOptions);
    const _domainOptions: OptionItem[] = [];
    const domains = _domains as Domain[];
    domains && domains.forEach(domain => {
      const { name } = domain;
      name !== DEFAULT_DOMAIN && _domainOptions.push({ label: name, value: name });
    });
    setDomainOptions(_domainOptions);

    if (value) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { name, domains, path, headers, methods, urlParams, services, customConfigs, authConfig, dubboConfig } = value;
      headers && headers.map((header) => {
        return { ...header, uid: uniqueId() };
      });
      urlParams && urlParams.map((query) => {
        return { ...query, uid: uniqueId() };
      });
      const customConfigArray = customConfigs ? Object.keys(customConfigs).map((key) => {
        return { uid: uniqueId(), key, value: customConfigs[key] };
      }) : [];
      const _authConfig_enabled = !!authConfig?.enabled;
      const _authConfig_allowedConsumers = authConfig?.allowedConsumers || [];
      const _dubboConfig_enabled = !!dubboConfig?.enabled;
      form.setFieldsValue({
        name,
        domains: (Array.isArray(domains) ? domains : [domains]).filter(d => !!d),
        path: Object.assign({ ...path }, { ignoreCase: path.caseSensitive === false ? ['ignore'] : [] }),
        methods: methods || [],
        headers: headers || [],
        urlParams: urlParams || [],
        services: services ? services.map(upstreamServiceToString) : null,
        authConfig_enabled: _authConfig_enabled,
        authConfig_allowedConsumers: _authConfig_allowedConsumers,
        dubboConfig_enabled: _dubboConfig_enabled,
        customConfigs: customConfigArray,
      });
      setAuthConfigEnabled(_authConfig_enabled);
      setDubboConfigEnabled(_dubboConfig_enabled);
      setDubboConfig(dubboConfig);
      // form.setFieldsValue({
      //   authConfig_allowedConsumers: _authConfig_allowedConsumers,
      // })
    }

    return () => {
      setAuthConfigEnabled(false);
      setDubboConfigEnabled(false);
    }
  }, [_services, _domains, value]);

  useImperativeHandle(ref, () => ({
    reset: () => form.resetFields(),
    handleSubmit: async () => {
      const values = await form.validateFields();
      if (values.domains && !Array.isArray(values.domains)) {
        values.domains = [values.domains];
      }
      if (values.customConfigs) {
        const customConfigsObj = {};
        for (const config of values.customConfigs) {
          if (config.key) {
            customConfigsObj[config.key] = config.value || '';
          }
        }
        values.customConfigs = customConfigsObj;
      }
      const authConfig = { enabled: authConfig_enabled, allowedConsumers: null };
      const allowdConsumers = values.authConfig_allowedConsumers;
      authConfig.allowedConsumers = allowdConsumers && !Array.isArray(allowdConsumers) ? [allowdConsumers] : allowdConsumers;
      values.authConfig = authConfig;

      const finalDubboConfig = { enabled: dubboConfig_enabled, ...dubboConfig };
      values.dubboConfig = finalDubboConfig;

      return values;
    },
  }));

  const lang = i18n.language;
  const langConfig = lngs.find(l => l.code === lang);
  const officialSiteLang = langConfig?.officialSiteCode || lang.toLowerCase();

  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        label={t('route.routeForm.routeName')}
        required
        name="name"
        tooltip={t('route.routeForm.routeNameTip')}
        rules={[
          {
            required: true,
            pattern: /^[a-z0-9][a-z0-9.-]*$/,
            message: t('route.routeForm.routeNameRequired'),
          },
        ]}
      >
        <Input
          showCount
          allowClear
          disabled={value}
          maxLength={63}
          placeholder={t('route.routeForm.routeNamePlaceholder')}
        />
      </Form.Item>
      <Form.Item
        label={t('route.routeForm.domain')}
        name="domains"
      >
        <Select
          showSearch
          allowClear
          mode="multiple"
          placeholder={t('route.routeForm.domainSearchPlaceholder')}
          options={domainOptions}
        />
      </Form.Item>
      <Form.Item
        label={t('route.routeForm.matchType')}
        required
        tooltip={t('route.routeForm.matchTypeTooltip')}
      >
        <Form.Item label={t('route.routeForm.path')} required>
          <Input.Group compact>
            <Form.Item
              name={['path', 'matchType']}
              noStyle
              rules={[
                {
                  required: true,
                  message: t('route.routeForm.pathPredicateRequired'),
                },
              ]}
            >
              <Select
                style={{ width: '20%' }}
                placeholder={t('route.routeForm.matchType')}
              >
                <Option value="PRE">{t('route.matchTypes.PRE')}</Option>
                <Option value="EQUAL">{t('route.matchTypes.EQUAL')}</Option>
                <Option value="REGULAR">{t('route.matchTypes.REGULAR')}</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={['path', 'matchValue']}
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
              name={['path', 'ignoreCase']}
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
          label={t('route.routeForm.method')}
          name="methods"
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder={t('route.routeForm.methodMatcherPlaceholder')}
            options={MethodOptions}
          />
        </Form.Item>
        <Form.Item
          label={t('route.routeForm.header')}
          name="headers"
          tooltip={t('route.routeForm.headerTooltip')}
        >
          <FactorGroup />
        </Form.Item>
        <Form.Item
          label={t('route.routeForm.query')}
          name="urlParams"
          tooltip={t('route.routeForm.queryTooltip')}
        >
          <FactorGroup />
        </Form.Item>
        <Form.Item
          name="authConfig_enabled"
          label={t('aiRoute.routeForm.label.authConfig')} // {/* 请求认证设置 */}
          valuePropName="checked"
          initialValue={false}
          extra={t('aiRoute.routeForm.label.authConfigExtra')}
        >
          <Switch onChange={e => {
            setAuthConfigEnabled(e)
          }}
          />
        </Form.Item>
        <Form.Item
          label={t('misc.authType')}
          name="authType"
          initialValue={CredentialType.KEY_AUTH.key}
          extra={t('misc.keyAuthOnlyTip')}
        >
          <Select disabled>
            {
              Object.values(CredentialType).filter(ct => !!ct.enabled).map(ct => (
                <Select.Option key={ct.key} value={ct.key}>{ct.displayName}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          label={t('aiRoute.routeForm.label.authConfigList')}
          extra={(<HistoryButton text={t('consumer.create')} path={"/consumer"} />)}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Item
              name="authConfig_allowedConsumers"
              noStyle
            >
              <Select
                allowClear
                mode="multiple"
                placeholder={t('aiRoute.routeForm.label.authConfigList')}
                style={{ flex: 1 }}
              >
                {consumerList.map((item) => (
                  <Select.Option key={String(item.name)} value={item.name}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => consumerResult.run()}
              icon={<RedoOutlined />}
            />
          </div>
        </Form.Item>
        <Form.Item
          label={
            <>
              {t('route.routeForm.customConfigs')}
              <Tooltip title={t('route.routeForm.customConfigsTip')}>
                <a href={`https://higress.io/${officialSiteLang}/docs/user/annotation-use-case`} target="_blank">
                  <QuestionCircleOutlined className="ant-form-item-tooltip" />
                </a>
              </Tooltip>
            </>
          }
          name="customConfigs"
        >
          <KeyValueGroup />
        </Form.Item>

        <Form.Item
          name="dubboConfig_enabled"
          label={t('dubbo.protocolConversion')}
          valuePropName="checked"
          initialValue={false}
          extra={t('dubbo.protocolConversionExtra')}
        >
          {<Switch onChange={(e) => {
            setDubboConfigEnabled(e);
            if (e) {
              setDubboConfigModalVisible(true);
            }
          }}
          />
          }
        </Form.Item>

        {dubboConfig_enabled && (
          <Form.Item>
            <Button
              type="link"
              onClick={() => setDubboConfigModalVisible(true)}
            >
              {t('dubbo.configureDubbo')}
            </Button>
          </Form.Item>
        )}

        <Form.Item
          label={t('route.routeForm.targetService')}
          required
          name="services"
          rules={[
            {
              required: true,
              message: t('route.routeForm.targetServiceRequired') || '',
            },
          ]}
        >
          <Select
            mode="multiple"
            showSearch
            allowClear
            placeholder={t('route.routeForm.targetServiceNamedPlaceholder')}
            options={serviceOptions}
          />
        </Form.Item>
      </Form.Item>

      <Modal
        title={t('dubbo.configTitle')}
        open={dubboConfigModalVisible}
        onOk={() => setDubboConfigModalVisible(false)}
        onCancel={() => setDubboConfigModalVisible(false)}
        width={1100}
      >
        <DubboConfigForm
          value={dubboConfig}
          onChange={(config) => setDubboConfig(config)}
        />
      </Modal>
    </Form>
  );
});

RouteForm.displayName = 'RouteForm';

export default RouteForm;
