import i18n from "@/i18n";
import {
  fetchPluginsByRoute,
  KeyedRoutePredicate,
  Route,
  RoutePredicate,
  RouteResponse,
  UpstreamService,
  upstreamServiceToString,
} from '@/interfaces/route';
import { WasmPluginData } from '@/interfaces/wasm-plugin';
import { getI18nValue } from "@/pages/plugin/utils";
import { addGatewayRoute, deleteGatewayRoute, getGatewayRoutes, getWasmPlugins, updateGatewayRoute } from '@/services';
import store from '@/store';
import switches from '@/switches';
import { isInternalResource } from '@/utils';
import { ExclamationCircleOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Alert, Button, Col, Drawer, Form, Input, message, Modal, Row, Space, Table, Typography, Select } from 'antd';
import { history } from 'ice';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import RouteForm from './components/RouteForm';

const { Text } = Typography;
const { Option } = Select;

interface RouteFormProps {
  name: string;
  domains: string[];
  headers: KeyedRoutePredicate[];
  methods: string[];
  path: RoutePredicate;
  urlParams: KeyedRoutePredicate[];
  services: string[];
  customConfigs: {
    [key: string]: string;
  };
}

const RouteList: React.FC = () => {
  const { t } = useTranslation();

  const [systemState] = store.useModel('system');
  const routeManagementSupported = !(systemState && systemState.capabilities && systemState.capabilities.indexOf('config.ingress.v1') === -1);

  const columns = [
    {
      title: t('route.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: t('route.columns.domains'),
      dataIndex: 'domains',
      key: 'domains',
      render: (value) => {
        if (!Array.isArray(value) || !value.length) {
          return '-';
        }
        return value.map((token: string, index: number) => {
          return (
            <span key={token}>
              {index !== 0 && (<br />)}
              {token}
            </span>
          );
        });
      },
    },
    {
      title: t('route.columns.routePredicates'),
      dataIndex: 'path',
      key: 'path',
      render: (value: RoutePredicate) => {
        return <div>{`${t(`route.matchTypes.${value.matchType}`)} ｜ ${value.matchValue}`}</div>;
      },
    },
    {
      title: t('route.columns.services'),
      dataIndex: 'services',
      key: 'services',
      ellipsis: true,
      render: (value: UpstreamService[]) => {
        return (
          value &&
          value.map((service: UpstreamService, index: number) => {
            const name = upstreamServiceToString(service);
            return (
              <span key={service.name}>
                {index !== 0 && (<br />)}
                {name}
              </span>
            );
          })
        );
      },
    },
    {
      title: t('aiRoute.columns.auth'),
      dataIndex: ['authConfig', 'allowedConsumers'],
      key: 'authConfig.allowedConsumers',
      render: (value, record) => {
        const { authConfig } = record;
        if (!authConfig || !authConfig.enabled) {
          return t('aiRoute.authNotEnabled')
        }
        if (!Array.isArray(value) || !value.length) {
          return t('aiRoute.authEnabledWithoutConsumer')
        }
        return value.map((consumer: string, index: number) => {
          return (
            <span key={consumer}>
              {index !== 0 && (<br />)}
              {consumer}
            </span>
          );
        });
      },
    },
    {
      title: t('route.columns.action'),
      dataIndex: 'action',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => {
        return !record.internal && routeManagementSupported && (
          <Space size="small">
            <a onClick={() => onEditConfig(record)}>{t('misc.strategy')}</a>
            <a onClick={() => onEditDrawer(record)}>{t('misc.edit')}</a>
            <a onClick={() => onShowModal(record)}>{t('misc.delete')}</a>
          </Space>
        ) || (<></>)
      },
    },
  ];

  const [dataSource, setDataSource] = useState<Route[]>([]);
  const [originalDataSource, setOriginalDataSource] = useState<Route[]>([]);
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<Route | null>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [pluginData, setPluginsData] = useState<Record<string, WasmPluginData[]>>({});

  // 存储选中的state
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [domainSelectedNames, setDomainSelectedNames] = useState<string[]>([]);
  const [selectedPathMatchTypes, setSelectedPathMatchTypes] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAllowedConsumers, setSelectedAllowedConsumers] = useState<string[]>([]);

  // 使用useRef保持最新状态以便在事件处理器外访问
  const selectedNamesRef = useRef(selectedNames);
  const domainSelectNamesRef = useRef(domainSelectedNames);
  const selectedPathMatchTypesRef = useRef(selectedPathMatchTypes);
  const selectedServicesRef = useRef(selectedServices);
  const selectedAllowedConsumersRef = useRef(selectedAllowedConsumers);


  const getRouteList = async (factor): Promise<RouteResponse> => getGatewayRoutes(factor);
  const [pluginInfoList, setPluginInfoList] = useState<WasmPluginData[]>([]);
  const { loading: wasmLoading, run: loadWasmPlugins } = useRequest(() => {
    return getWasmPlugins(i18n.language)
  }, {
    manual: true,
    onSuccess: (result = []) => {
      let plugins = result || [];
      setPluginInfoList(plugins);
    },
  });

  const { loading, run, refresh } = useRequest(getRouteList, {
    manual: true,
    onSuccess: (result: Route[], params) => {
      result = result || [];
      result.forEach((i) => {
        i.key || (i.key = i.id ? `${i.id}` : i.name);
        i.internal = isInternalResource(i.name);
      });
      if (!switches.SHOW_INTERNAL_ROUTES) {
        result = result.filter(r => !r.internal);
      }
      result.sort((i1, i2) => {
        if (i1.internal !== i2.internal) {
          return i1.internal ? 1 : -1
        }
        return i1.name.localeCompare(i2.name);
      })
      // 清空筛选框中的内容
      form.setFieldsValue({
        name: [],
        domains: [],
        routePredicates: [],
        services: [],
        auth: [],
      });
      setOriginalDataSource(result);
      handleSearch(searchValue, result);
    },
  });

  useEffect(() => {
    run({});
    loadWasmPlugins();

    const handleLanguageChange = () => loadWasmPlugins();
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const onEditDrawer = (route: Route) => {
    setCurrentRoute(route);
    setOpenDrawer(true);
  };

  const onEditConfig = (route: Route) => {
    history?.push(`/route/config?name=${route.name}&type=route`);
  };

  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentRoute(null);
  };

  const normalizeRoutePredicate = (predicate: RoutePredicate) => {
    predicate.caseSensitive = !predicate.ignoreCase || !predicate.ignoreCase.length;
  };

  const handleDrawerOK = async () => {
    try {
      const values: RouteFormProps = formRef.current && (await formRef.current.handleSubmit());
      const { name, domains, headers, methods, urlParams, path, services, customConfigs, authConfig } = values;
      path && normalizeRoutePredicate(path);
      headers && headers.forEach((h) => normalizeRoutePredicate(h));
      urlParams && urlParams.forEach((h) => normalizeRoutePredicate(h));
      const route: Route = {
        name,
        domains,
        headers,
        methods,
        path,
        urlParams,
        customConfigs,
        authConfig,
        services: services.map((service) => {
          return {
            name: service,
          };
        }),
      };
      if (currentRoute) {
        route.version = currentRoute.version;
        await updateGatewayRoute({
          ...currentRoute,
          ...route,
        });
      } else {
        await addGatewayRoute(route);
      }
      setOpenDrawer(false);
      refresh();
      currentRoute ? setCurrentRoute(null) : formRef.current.reset();
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.log('Save failed:', errInfo);
    }
  };

  const handleDrawerCancel = () => {
    setOpenDrawer(false);
    setCurrentRoute(null);
  };

  const onShowModal = (route: Route) => {
    setCurrentRoute(route);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    if (!currentRoute) {
      return;
    }
    setConfirmLoading(true);
    await deleteGatewayRoute(currentRoute.name);
    setConfirmLoading(false);
    setOpenModal(false);
    // 重新刷新
    refresh();
  };

  const handleModalCancel = () => {
    setOpenModal(false);
    setCurrentRoute(null);
  };

  const onShowStrategyList = async (record: Route, expanded: boolean) => {
    if (expanded) {
      try {
        const plugins = await fetchPluginsByRoute(record);
        const mergedPlugins = plugins.map((plugin) => {
          const pluginInfo = pluginInfoList.find(
            info => info.name === plugin.name && !plugin.internal,
          );
          return {
            ...plugin,
            title: pluginInfo?.title || plugin.title || '',
            description: pluginInfo?.description || plugin.description || '',
          };
        })
        setPluginsData((prev) => ({
          ...prev,
          [record.name]: mergedPlugins,
        }));
      } catch (error) {
        message.error('Failed to fetch strategies, error:', error);
        setExpandedKeys((prev) => prev.filter((key) => key !== record.name));
      }
    } else {
      setExpandedKeys((prev) =>
        prev.filter((key) => key !== record.name));
    }
  };

  const handleSearch = (value: string | null, result: Route[] | null) => {
    value = value != null ? value : searchValue;
    result = result != null ? result : originalDataSource;
    if (!value) {
      setDataSource(result);
      return;
    }
    setIsLoading(true);
    const filteredData = result.filter((item) => {
      const nameMatch = item.name?.includes(value);
      const domainsMatch = item.domains?.some(domain => domain.includes(value));
      const pathMatch = item.path?.matchValue?.includes(value);
      const servicesMatch = item.services?.some(service => service.name?.includes(value));
      return nameMatch || domainsMatch || pathMatch || servicesMatch;
    });
    setDataSource(filteredData);
    setIsLoading(false);
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    handleSearch(value, originalDataSource);
  };

  const applyFilters = () => {
    let results = [...originalDataSource];
    if (selectedNamesRef.current.length > 0) {
      results = results.filter((item) => selectedNamesRef.current!.includes(item.name));
    }

    // 应用域名筛选
    if (domainSelectNamesRef.current.length > 0) {
      results = results.filter(item =>
        item.domains?.some(domain => domainSelectNamesRef.current!.includes(domain)));
    }
    // 应用路径匹配类型筛选
    if (selectedPathMatchTypesRef.current.length > 0) {
      results = results.filter(item =>
        selectedPathMatchTypesRef.current.includes(item.path?.matchType));
    }

    // 应用目标服务筛选
    if (selectedServicesRef.current.length > 0) {
      results = results.filter(item =>
        item.services?.some(service => selectedServicesRef.current.includes(service.name)));
    }

    // 应用请求授权筛选
    if (selectedAllowedConsumersRef.current.length > 0) {
      results = results.filter(item => {
        // 处理“未开启认证”的情况
        if (selectedAllowedConsumersRef.current.includes("__auth_disabled__")) {
          if (!item.authConfig || !item.authConfig.enabled) {
            return true;
          }
        }

        // 处理“未授权任何人访问”的情况
        if (selectedAllowedConsumersRef.current.includes("__no_consumers__")) {
          if (item.authConfig?.enabled && (!item.authConfig.allowedConsumers || item.authConfig.allowedConsumers.length === 0)) {
            return true;
          }
        }

        // 处理普通消费者的匹配
        return item.authConfig?.enabled &&
          item.authConfig.allowedConsumers?.some(consumer =>
            selectedAllowedConsumersRef.current.includes(consumer));
      });
    }

    setDataSource(results);
  };
  // @ts-ignore
  return (
    <PageContainer>
      {
        routeManagementSupported || (
          <Alert
            description={t('route.unsupported')}
            type="error"
            showIcon
            style={{
              marginBottom: 16,
            }}
          />
        )
      }
      <Form
        form={form}
        style={{
          background: '#fff',
          height: 128,
          paddingTop: 16,
          marginBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <Row gutter={24}>
          {/* 路由名称 */}
          <Col span={6}>
            <Form.Item label={t('route.columns.name')} name="name">
              <Select
                mode="multiple"
                allowClear
                placeholder={t('route.search.name') || ''}
                value={selectedNames}
                onChange={(values) => {
                  setSelectedNames(values as string[]);
                  selectedNamesRef.current = values;
                  applyFilters();
                }}
                style={{ width: "100%" }}
              >
                xx{[...new Set(originalDataSource.map(item => item.name))].map(name => (<Option key={name} value={name}>{name}</Option>))}
              </Select>
            </Form.Item>
          </Col>
          {/* 域名 */}
          <Col span={6}>
            <Form.Item label={t('route.columns.domains')} name="domains">
              <Select
                mode="multiple"
                allowClear
                placeholder={t('route.search.domain') || ''}
                value={domainSelectedNames}
                onChange={(values) => {
                  setDomainSelectedNames(values as string[]);
                  domainSelectNamesRef.current = values;
                  applyFilters();
                }}
                style={{ width: "100%" }}
              >
                {[...new Set(originalDataSource.flatMap(item => item.domains || []))].map(name => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {/* 匹配类型 */}
          <Col span={6}>
            <Form.Item label={t('route.columns.routePredicates')} name="routePredicates">
              <Select
                mode="multiple"
                allowClear
                placeholder={t('route.search.routePredicates') || ''}
                value={selectedPathMatchTypes}
                onChange={(values) => {
                  setSelectedPathMatchTypes(values as string[]);
                  selectedPathMatchTypesRef.current = values;
                  applyFilters();
                }}
                style={{ width: "100%" }}
              >
                <Option value="PRE">{t('route.matchTypes.PRE')}</Option>
                <Option value="EQUAL">{t('route.matchTypes.EQUAL')}</Option>
                <Option value="REGULAR">{t('route.matchTypes.REGULAR')}</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* 目标服务 */}
          <Col span={6}>
            <Form.Item label={t('route.columns.services')} name="services">
              <Select
                mode="multiple"
                allowClear
                placeholder={t('route.search.services') || ''}
                value={selectedServices}
                onChange={(values) => {
                  setSelectedServices(values as string[]);
                  selectedServicesRef.current = values;
                  applyFilters();
                }}
                style={{ width: "100%" }}
              >
                {/* 动态生成所有可用的服务名称作为选项 */}
                {[...new Set(originalDataSource.flatMap(item => item.services?.map(svc => svc.name) || []))].map(serviceName => (
                  <Option key={serviceName} value={serviceName}>
                    {serviceName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>


        </Row>
        <Row gutter={24}>
          {/* 请求授权 */}
          <Col span={6}>
            <Form.Item label={t('aiRoute.columns.auth')} name="auth">
              <Select
                mode="multiple"
                allowClear
                placeholder={t('route.search.auth') || ''}
                value={selectedAllowedConsumers}
                onChange={(values) => {
                  setSelectedAllowedConsumers(values as string[]);
                  selectedAllowedConsumersRef.current = values;
                  applyFilters();
                }}
                style={{ width: "100%" }}
              >
                {/* 手动添加特殊选项 */}
                <Option key="__no_consumers__" value="__no_consumers__">
                  {t('aiRoute.authNotEnabled')}
                </Option>
                <Option key="__auth_disabled__" value="__auth_disabled__">
                  {t('aiRoute.authEnabledWithoutConsumer')}
                </Option>

                {/* 提取所有的唯一allowedConsumers值 */}
                {[...new Set(originalDataSource.flatMap(item =>
                  item.authConfig?.allowedConsumers || []))].map(consumer => (<Option key={consumer} value={consumer}>{consumer}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={18} style={{ textAlign: 'right' }} >
            <Button
              style={{ margin: '0 8px' }}
              type="primary"
              onClick={onShowDrawer}
              disabled={!routeManagementSupported}
            >
              {t('route.createRoute')}
            </Button>
            <Button icon={<RedoOutlined />} onClick={refresh} />
          </Col>
        </Row>
      </Form>
      <Table
        loading={loading || isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpand: async (expanded, record) => {
            if (expanded) {
              setExpandedKeys([...expandedKeys, record.name]);
            } else {
              setExpandedKeys(expandedKeys.filter(key => key !== record.name));
            }
            await onShowStrategyList(record, expanded);
          },
          expandedRowRender: (record) => {
            const plugins = (pluginData[record.name] || []).filter(plugin => plugin.enabled);
            return (
              <Table
                dataSource={plugins}
                columns={[
                  {
                    title: t('plugins.title'),
                    render: (_, plugin) => {
                      return getI18nValue(plugin, 'title');
                    },
                    key: 'title',
                  },
                  {
                    title: t('plugins.description'),
                    render: (_, plugin) => {
                      return getI18nValue(plugin, 'description');
                    },
                    key: 'description',
                  },
                ]}
                pagination={false}
                rowKey={(plugin) => `${plugin.name}-${plugin.internal}`}
              />
            );
          },
        }}
      />
      {!loading && (
        <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
          <Text>{t('route.noCustomIngresses')}</Text>
        </Space>
      )}
      <Modal
        title={
          <div>
            <ExclamationCircleOutlined style={{ color: '#ffde5c', marginRight: 8 }} />
            {t('misc.delete')}
          </div>
        }
        open={openModal}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
      >
        <p>
          <Trans t={t} i18nKey="route.deleteConfirmation">
            确定删除
            <span style={{ color: '#0070cc' }}>{{ currentRouteName: (currentRoute && currentRoute.name) || '' }}</span>
            吗？
          </Trans>
        </p>
      </Modal>
      <Drawer
        title={t(currentRoute ? 'route.editRoute' : 'route.createRoute')}
        placement="right"
        width={660}
        onClose={handleDrawerCancel}
        open={openDrawer}
        extra={
          <Space>
            <Button onClick={handleDrawerCancel}>{t('misc.cancel')}</Button>
            <Button type="primary" onClick={handleDrawerOK}>
              {t('misc.confirm')}
            </Button>
          </Space>
        }
      >
        <RouteForm ref={formRef} value={currentRoute} />
      </Drawer>
    </PageContainer>
  );
};

export default RouteList;
