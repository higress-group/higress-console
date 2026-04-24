import ServiceWeightTable, { WeightedService } from '@/components/ServiceWeightTable';
import { OptionItem } from '@/interfaces/common';
import { Consumer, CredentialType } from '@/interfaces/consumer';
import { DEFAULT_DOMAIN, Domain } from '@/interfaces/domain';
import { stringToUpstreamService, upstreamServiceToString } from '@/interfaces/route';
import { HistoryButton } from '@/pages/ai/components/RouteForm/Components';
import { getGatewayDomains, getGatewayServices } from '@/services';
import { getConsumers } from '@/services/consumer';
import { getOfficialSiteLink } from '@/utils';
import { QuestionCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Checkbox, Form, Input, Select, Switch, Tooltip } from 'antd';
import { uniqueId } from "lodash";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FactorGroup from '../FactorGroup';
import KeyValueGroup from '../KeyValueGroup';

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
  const servicesRef = useRef(new Map());
  const { data: _services = [], refresh: refreshServices } = useRequest(getGatewayServices);
  const { data: _domains = [], refresh: refreshDomains } = useRequest(getGatewayDomains);

  const [consumerList, setConsumerList] = useState<Consumer[]>([]);
  const [weightedServices, setWeightedServices] = useState<WeightedService[]>([]);
  const [editMode, setEditMode] = useState(false);

  const consumerResult = useRequest(getConsumers, {
    onSuccess: (result) => {
      const consumers = (result || []) as Consumer[];
      setConsumerList(consumers);
    },
  });

  useEffect(() => {
    form.resetFields();

    // Build service options
    const _serviceOptions: OptionItem[] = [];
    const serviceKeys = new Set<string>();
    _services && _services.forEach(service => {
      const text = upstreamServiceToString(service);
      if (serviceKeys.has(text)) {
        // Ignore duplicated keys to avoid UI refresh issues.
        return;
      }
      serviceKeys.add(text);
      _serviceOptions.push({ label: text, value: text });
      servicesRef.current.set(text, service);
    });
    setServiceOptions(_serviceOptions);

    // Build domain options
    const _domainOptions: OptionItem[] = [];
    _domains && (_domains as Domain[]).forEach(domain => {
      const { name } = domain;
      name !== DEFAULT_DOMAIN && _domainOptions.push({ label: name, value: name });
    });
    setDomainOptions(_domainOptions);

    if (value) {
      const { name, domains, path, headers, methods, urlParams, services, customConfigs, authConfig } = value;

      // Use explicit version check for edit mode detection
      const isEditing = value.version != null;
      setEditMode(isEditing);

      // Initialize weighted services from value
      const initialWeighted: WeightedService[] = services ? services.map((s, index) => ({
        id: uniqueId(`ws-${s.name}-${index}-`),
        name: upstreamServiceToString(s),
        weight: s.weight ?? 0,
      })) : [];
      setWeightedServices(initialWeighted);

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
        customConfigs: customConfigArray,
      });
      setAuthConfigEnabled(_authConfig_enabled);
    } else {
      // Reset when creating new route
      setWeightedServices([]);
      setEditMode(false);
    }

    return () => {
      setAuthConfigEnabled(false);
    };
  }, [_services, _domains, value, form]);

  // Handle service selection changes from Select component
  const handleServicesChange = (selectedServiceNames: string[]) => {
    const existingMap = new Map(weightedServices.map(s => [s.name, s]));

    const newServices: WeightedService[] = selectedServiceNames.map((name, index) => {
      if (existingMap.has(name)) {
        // Preserve existing service with its weight
        const existing = existingMap.get(name)!;
        return { ...existing };
      } else {
        // New service
        return {
          id: uniqueId(`ws-${name}-${index}-`),
          name,
          weight: 0, // Default weight, Table component will handle auto-distribution if in auto mode
        };
      }
    });

    setWeightedServices(newServices);
  };

  // Sync weightedServices changes back to form services field
  // This ensures that when services are deleted from the weight table,
  // they are also removed from the Select component
  useEffect(() => {
    const currentFormServices = form.getFieldValue('services') || [];
    const weightedServiceNames = weightedServices.map(s => s.name);

    // Check if the arrays are different
    const hasChanges = currentFormServices.length !== weightedServiceNames.length ||
      currentFormServices.some((name: string) => !weightedServiceNames.includes(name)) ||
      weightedServiceNames.some((name: string) => !currentFormServices.includes(name));

    if (hasChanges) {
      form.setFieldsValue({ services: weightedServiceNames });
    }
  }, [weightedServices, form]);

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

      // Convert weighted services back to UpstreamService format
      values.services = weightedServices.map(ws => stringToUpstreamService(ws.name, ws.weight));

      return values;
    },
  }));

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
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Item
            name="domains"
            noStyle
          >
            <Select
              showSearch
              allowClear
              mode="multiple"
              placeholder={t('route.routeForm.domainSearchPlaceholder')}
              options={domainOptions}
              style={{ flex: 1 }}
            />
          </Form.Item>
          <Button
            style={{ marginLeft: 8 }}
            onClick={refreshDomains}
            icon={<RedoOutlined />}
            aria-label={t('route.routeForm.refreshDomains')}
          />
        </div>
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
                <a href={`${getOfficialSiteLink("/docs/latest/user/annotation-use-case")}`} target="_blank">
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
          label={t('route.routeForm.targetService')}
          required
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Item
              name="services"
              noStyle
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
                onChange={handleServicesChange}
                style={{ flex: 1 }}
              />
            </Form.Item>
            <Button
              style={{ marginLeft: 8 }}
              onClick={refreshServices}
              icon={<RedoOutlined />}
              aria-label={t('route.routeForm.refreshServices')}
            />
          </div>
        </Form.Item>
        {
          weightedServices.length > 0 && (
            <Form.Item
              label={t('route.routeForm.weightConfig')}
              required
            >
              <ServiceWeightTable
                value={weightedServices}
                onChange={setWeightedServices}
                disabled={false}
                autoMode={!editMode}
              />
            </Form.Item>
          )
        }
      </Form.Item>
    </Form>
  );
});

RouteForm.displayName = 'RouteForm';

export default RouteForm;
