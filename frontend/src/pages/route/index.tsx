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
import {
  addGatewayRoute,
  deleteGatewayRoute,
  getGatewayRoutes,
  getWasmPlugins,
  updateGatewayRoute,
  batchImportRoutes,
  batchExportRoutes,
  createDubboConfig,
  updateDubboConfig,
  deleteDubboConfig,
} from '@/services';
import store from '@/store';
import switches from '@/switches';
import { isInternalResource } from '@/utils';
import { ExclamationCircleOutlined, RedoOutlined, SearchOutlined, UploadOutlined, DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Alert, Button, Col, Drawer, Form, Input, message, Modal, Row, Space, Table, Typography, Upload, Progress } from 'antd';
import { history } from 'ice';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import RouteForm from './components/RouteForm';

const { Text } = Typography;

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
  const routeManagementSupported = !(
    systemState &&
    systemState.capabilities &&
    systemState.capabilities.indexOf('config.ingress.v1') === -1
  );

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
      render: (value): React.ReactNode => {
        if (!Array.isArray(value) || !value.length) {
          return '-';
        }
        return value.join(', ');
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
      render: (value, record): React.ReactNode => {
        const { authConfig } = record;
        if (!authConfig || !authConfig.enabled) {
          return t('aiRoute.authNotEnabled')
        }
        if (!Array.isArray(value) || !value.length) {
          return t('aiRoute.authEnabledWithoutConsumer')
        }
        return value.join(', ');
      },
    },
    {
      title: t('route.columns.action'),
      dataIndex: 'action',
      key: 'action',
      width: 200,
      align: 'center' as const,
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
  const [importProgress, setImportProgress] = useState<number>(0);
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false);

  const getRouteList = async (): Promise<Route[]> => getGatewayRoutes();
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
      const routes = result || [];
      routes.forEach((i) => {
        i.key || (i.key = i.id ? `${i.id}` : i.name);
        i.internal = isInternalResource(i.name);
      });
      let filteredRoutes = routes;
      if (!switches.SHOW_INTERNAL_ROUTES) {
        filteredRoutes = routes.filter(r => !r.internal);
      }
      filteredRoutes.sort((i1, i2) => {
        if (i1.internal !== i2.internal) {
          return i1.internal ? 1 : -1
        }
        return i1.name.localeCompare(i2.name);
      })
      setOriginalDataSource(filteredRoutes);
      handleSearch(searchValue, filteredRoutes);
    },
  });

  useEffect(() => {
    run();
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
      const values: RouteFormProps & { authConfig?: any; dubboConfig?: any } = formRef.current ? (await (formRef.current as any).handleSubmit()) : {};
      const { name, domains, headers, methods, urlParams, path, services, customConfigs, authConfig, dubboConfig } = values;
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

      // 处理Dubbo配置
      if (dubboConfig && dubboConfig.enabled) {
        try {
          if (currentRoute) {
            await updateDubboConfig(name, dubboConfig);
          } else {
            await createDubboConfig(name, dubboConfig);
          }
        } catch (dubboError) {
          // console.error('Dubbo config deployment failed:', dubboError);
          message.error('Dubbo配置部署失败，请检查配置是否正确');
        }
      } else if (currentRoute && currentRoute.dubboConfig?.enabled) {
        // 如果之前启用了Dubbo配置，现在禁用了，则删除配置
        try {
          await deleteDubboConfig(name);
        } catch (dubboError) {
          // console.error('Dubbo config deletion failed:', dubboError);
          message.error('Dubbo配置删除失败');
        }
      }

      setOpenDrawer(false);
      refresh();
      currentRoute ? setCurrentRoute(null) : (formRef.current as any)?.reset();
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      // console.log('Save failed:', errInfo);
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

  // 批量导入处理
  const handleBatchImport = async (file: File) => {
    try {
      setImportProgress(0);
      setImportModalVisible(true);

      const result = await batchImportRoutes(file);
      message.success(`${t('route.batchImportSuccess')}，成功：${result.success}，失败：${result.failed}`);

      if (result.errors && result.errors.length > 0) {
        // console.error('导入错误详情:', data.errors);
      }

      // 刷新路由列表
      refresh();
    } catch (error) {
      // console.error('批量导入错误:', error);
      message.error(t('route.batchImportFailed'));
    } finally {
      setImportModalVisible(false);
      setImportProgress(0);
    }
  };

  // 批量导出处理
  const handleBatchExport = async () => {
    try {
      const blob = await batchExportRoutes();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `routes-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success(t('route.batchExportSuccess'));
    } catch (error) {
      // console.error('批量导出错误:', error);
      message.error(t('route.batchExportFailed'));
    }
  };

  // 导出模板处理
  const handleExportTemplate = () => {
    try {
      // 直接下载public目录下的模板文件
      const link = document.createElement('a');
      link.href = '/template.md';
      link.download = 'route-template.md';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success(t('route.templateExportSuccess'));
    } catch (error) {
      // console.error('导出模板错误:', error);
      message.error(t('route.templateExportFailed'));
    }
  };

  // 文件上传配置
  const uploadProps = {
    beforeUpload: (file: File) => {
      const isJson = file.type === 'application/json' || file.name.endsWith('.json');
      if (!isJson) {
        message.error(t('route.fileFormatError'));
        return false;
      }
      handleBatchImport(file);
      return false; // 阻止自动上传
    },
    showUploadList: false,
  };

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
          height: 64,
          paddingTop: 16,
          marginBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <Row gutter={24}>
          <Col span={14}>
            <Form.Item name="searchVal">
              <Input
                allowClear
                placeholder={t('route.routeSearchPlaceholder') || ''}
                prefix={<SearchOutlined />}
                onChange={onSearchChange}
              />
            </Form.Item>
          </Col>
          <Col span={10} style={{ textAlign: 'right' }}>
            <Space>
              <Upload {...uploadProps}>
                <Button
                  icon={<UploadOutlined />}
                  disabled={!routeManagementSupported}
                >
                  {t('route.batchImport')}
                </Button>
              </Upload>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleBatchExport}
                disabled={!routeManagementSupported}
              >
                {t('route.batchExport')}
              </Button>
              <Button
                icon={<FileTextOutlined />}
                onClick={handleExportTemplate}
                disabled={!routeManagementSupported}
              >
                {t('route.exportTemplate')}
              </Button>
              <Button
                type="primary"
                onClick={onShowDrawer}
                disabled={!routeManagementSupported}
              >
                {t('route.createRoute')}
              </Button>
              <Button icon={<RedoOutlined />} onClick={refresh} />
            </Space>
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
            <span style={{ color: '#0070cc' }}>{currentRoute?.name || ''}</span>
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

      {/* 导入进度模态框 */}
      <Modal
        title={t('route.importProgress')}
        open={importModalVisible}
        footer={null}
        closable={false}
        maskClosable={false}
      >
        <Progress percent={importProgress} status="active" />
        <p style={{ textAlign: 'center', marginTop: 16 }}>
          {t('route.importProgress')}...
        </p>
      </Modal>
    </PageContainer>
  );
};

export default RouteList;
