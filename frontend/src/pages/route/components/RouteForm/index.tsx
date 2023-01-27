import { DomainResponse } from '@/interfaces/domain';
import { OptionItem } from '@/interfaces/service';
import { getGatewayDomain, getGatewayServices } from '@/services';
import { useRequest } from 'ahooks';
import { Checkbox, Form, Input, Select } from 'antd';
import { uniqueId } from "lodash";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FactorGroup from '../FactorGroup';

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
  const servicesRef = useRef(new Map());
  const { data: _services = [] } = useRequest(getGatewayServices);
  const { data: _response = { list: [] } } = useRequest(getGatewayDomain);

  useEffect(() => {
    form.resetFields();
    const _serviceOptions: OptionItem[] = [];
    _services && _services.forEach(service => {
      const { name } = service;
      _serviceOptions.push({ label: name, value: name });
      servicesRef.current.set(name, service);
    });
    setServiceOptions(_serviceOptions);
    const _domainOptions: OptionItem[] = [];
    const { list: _domain } = _response as DomainResponse;
    _domain && _domain.forEach(domain => {
      const { name } = domain;
      _domainOptions.push({ label: name, value: name });
    });
    setDomainOptions(_domainOptions);

    if (value) {
      const { name, domainList, routePredicates, services } = value;
      const { pathPredicates, methodPredicates, headerPredicates, queryPredicates } = routePredicates;
      const { type, path, ignoreCase } = pathPredicates;
      const [service] = services;
      const { name: _name } = service;
      const _headerPredicates = headerPredicates && headerPredicates.map((header) => {
        return { ...header, uid: uniqueId() };
      });
      const _queryPredicates = queryPredicates && queryPredicates.map((query) => {
        return { ...query, uid: uniqueId() };
      });
      form.setFieldsValue({
        name,
        domainList,
        pathPredicates: { type, path, ignoreCase: ignoreCase === true ? ['ignore'] : [] },
        methodPredicates,
        headerPredicates: _headerPredicates,
        queryPredicates: _queryPredicates,
        services: _name,
      });
    }
  }, [_services, _response, value]);

  useImperativeHandle(ref, () => ({
    reset: () => form.resetFields(),
    handleSubmit: () => (form.validateFields()),
  }));

  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        label={t('route.routeForm.routeName')}
        required
        name='name'
        tooltip={t('route.routeForm.routeNameTip')}
        rules={[
          {
            required: true,
            message: t('route.routeForm.routeNameRequired')
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
        required
        name='domainList'
        rules={[
          {
            required: true,
            message: t('route.routeForm.domainRequired')
          }
        ]}
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
        label={t('route.routeForm.fitType')}
        required
        tooltip={t('route.routeForm.fitTypeTooltip')}
      >
        <Form.Item label={t('route.routeForm.path')} required>
          <Input.Group compact>
            <Form.Item
              name={['pathPredicates', 'type']}
              noStyle
              rules={[
                {
                  required: true,
                  message: t('route.routeForm.pathPredicatesRequired')
                }
              ]}
            >
              <Select
                style={{ width: '20%' }}
                placeholder={t('route.routeForm.fitType')}
              >
                <Option value="PRE">{t('route.fitTypes.PRE')}</Option>
                <Option value="EQUAL">{t('route.fitTypes.EQUAL')}</Option>
                <Option value="REGULAR">{t('route.fitTypes.REGULAR')}</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={['pathPredicates', 'path']}
              noStyle
              rules={[
                {
                  required: true,
                  message: t('route.routeForm.pathMatcherRequired')
                }
              ]}
            >
              <Input style={{ width: '60%' }} placeholder={t('route.routeForm.pathMatcherPlacedholder')} />
            </Form.Item>
            <Form.Item
              name={['pathPredicates', 'ignoreCase']}
              noStyle
            >
              <Checkbox.Group
                options={[
                  {
                    label: t('route.routeForm.caseInsensitive'), value: 'ignore'
                  }
                ]}
                style={{ width: '18%', display: 'inline-flex', marginLeft: 12, marginTop: 4 }}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item
          label={t('route.routeForm.method')}
          name='methodPredicates'
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
          name='headerPredicates'
          tooltip={t('route.routeForm.headerTooltip')}
        >
          <FactorGroup />
        </Form.Item>
        <Form.Item
          label={t('route.routeForm.query')}
          name='queryPredicates'
          tooltip={t('route.routeForm.queryTooltip')}
        >
          <FactorGroup />
        </Form.Item>
        <Form.Item
          label={t('route.routeForm.targetService')}
          required
          name='services'
          rules={[
            {
              required: true,
              message: t('route.routeForm.targetServiceRequired')
            }
          ]}
        >
          <Select
            showSearch
            allowClear
            placeholder={t('route.routeForm.targetServiceNamedPlaceholder')}
            options={serviceOptions}
          />
        </Form.Item>
      </Form.Item>
    </Form>
  );
});

export default RouteForm;
