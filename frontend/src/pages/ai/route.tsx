import i18n from "@/i18n";
import { AiRoute, AiUpstream } from '@/interfaces/ai-route';
import { fetchPluginsByRoute, RoutePredicate } from '@/interfaces/route';
import { WasmPluginData } from '@/interfaces/wasm-plugin';
import { getI18nValue } from "@/pages/plugin/utils";
import { getWasmPlugins } from '@/services';
import { addAiRoute, deleteAiRoute, getAiRoutes, updateAiRoute } from '@/services/ai-route';
import { ArrowRightOutlined, ExclamationCircleOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, Drawer, Form, FormProps, Input, message, Modal, Row, Select, Space, Table } from 'antd';
import { history } from 'ice';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ConsumerList from '../route/components/ConsumerList';
import RouteForm from './components/RouteForm';

interface FormRef {
  reset: () => void;
  handleSubmit: () => Promise<FormProps>;
}

const { Option } = Select;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const AiRouteList: React.FC = () => {
  const { t } = useTranslation();
  const columns = [
    {
      title: t('aiRoute.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: t('aiRoute.columns.domains'),
      dataIndex: 'domains',
      key: 'domains',
      render: (value) => {
        if (!Array.isArray(value) || !value.length) {
          return '-';
        }
        const elements: React.ReactNode[] = [];
        value.forEach((token, index) => {
          if (index > 0) {
            elements.push(<br key={`br-${index}`} />);
          }
          elements.push(<span key={`span-${index}`}>{token}</span>);
        });
        return elements;
      },
    },
    {
      title: t('aiRoute.columns.pathPredicate'),
      dataIndex: 'pathPredicate',
      key: 'pathPredicate',
      render: (value: RoutePredicate, record: AiRoute) => {
        return <div>{`${t(`route.matchTypes.${value.matchType}`)} ｜ ${value.matchValue}`}</div>;
      },
    },
    {
      title: t('aiRoute.columns.modelPredicates'),
      dataIndex: 'modelPredicates',
      key: 'modelPredicates',
      render: (value: RoutePredicate[], record: AiRoute) => {
        return (
          <div>
            {
              value && value.length ? value.map((v, i) => {
                return (
                  <span key={i}>{!!i && <br />}{`${t(`route.matchTypes.${v.matchType}`)} ｜ ${v.matchValue}`}</span>
                )
              }) : '-'
            }
          </div>
        );
      },
    },
    {
      title: t('aiRoute.columns.upstreams'),
      dataIndex: 'upstreams',
      key: 'upstreams',
      render: (value: AiUpstream[], record: AiRoute) => {
        if (!Array.isArray(value) || !value.length) {
          return '-';
        }
        const elements: any[] = [];
        if (value.length === 1) {
          elements.push(value[0].provider);
        } else {
          value.forEach(upstream => {
            elements.push(`${upstream.provider}: ${upstream.weight}%`);
          });
        }
        if (record.fallbackConfig?.enabled && record.fallbackConfig.upstreams && record.fallbackConfig.upstreams.length > 0) {
          const fallbackProviders = record.fallbackConfig.upstreams.map(u => u.provider).join(', ');
          elements.push((
            <>
              <ArrowRightOutlined style={{ marginRight: '5px' }} />
              {fallbackProviders}
            </>
          ));
        }
        const result: React.ReactNode[] = [];
        elements.forEach((ele, index) => {
          if (index > 0) {
            result.push(<br key={`br-${index}`} />);
          }
          result.push(<span key={`span-${index}`}>{ele}</span>);
        });
        return result;
      },
    },
    {
      title: t('aiRoute.columns.auth'),
      dataIndex: ['authConfig', 'allowedConsumers'],
      key: 'authConfig.allowedConsumers',
      width: 300,
      render: (value, record) => {
        const { authConfig } = record;
        if (!authConfig || !authConfig.enabled) {
          return t('aiRoute.authNotEnabled');
        }
        if (!Array.isArray(value) || !value.length) {
          return t('aiRoute.authEnabledWithoutConsumer');
        }
        return <ConsumerList consumers={value} />;
      },
    },
    {
      title: t('misc.actions'),
      dataIndex: 'action',
      key: 'action',
      width: 240,
      align: 'center' as const,
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => onUsageDrawer(record)}>{t('aiRoute.usage')}</a>
          <a onClick={() => onEditConfig(record)}>{t('misc.strategy')}</a>
          <a onClick={() => onEditDrawer(record)}>{t('misc.edit')}</a>
          <a onClick={() => onShowModal(record)}>{t('misc.delete')}</a>
        </Space>
      ),
    },
  ];

  const formRef = useRef<FormRef>(null);
  const routesRef = useRef<AiRoute[] | null>(null);
  const [dataSource, setDataSource] = useState<AiRoute[]>([]);
  const [currentAiRoute, setCurrentAiRoute] = useState<AiRoute | null>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [loadingapi, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [usageDrawer, setUsageDrawer] = useState(false)
  const [usageCommand, setUsageCommand] = useState<string>('')
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [pluginData, setPluginsData] = useState<Record<string, WasmPluginData[]>>({});
  const [pluginInfoList, setPluginInfoList] = useState<WasmPluginData[]>([]);

  // Filter state — Input 类（带 debounce）
  const [nameFilter, setNameFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [pathFilter, setPathFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [consumerFilter, setConsumerFilter] = useState('');
  const debouncedNameFilter = useDebounce(nameFilter, 300);
  const debouncedDomainFilter = useDebounce(domainFilter, 300);
  const debouncedPathFilter = useDebounce(pathFilter, 300);
  const debouncedProviderFilter = useDebounce(providerFilter, 300);
  const debouncedConsumerFilter = useDebounce(consumerFilter, 300);

  // Filter state — Select 多选类
  const [selectedAuthStates, setSelectedAuthStates] = useState<string[]>([]);

  const applyFilters = () => {
    let results = [...(routesRef.current || [])];

    // 1. 名称（子串，大小写不敏感）
    if (debouncedNameFilter) {
      const q = debouncedNameFilter.toLowerCase();
      results = results.filter(item => item.name?.toLowerCase().includes(q));
    }

    // 2. 域名（任一命中）
    if (debouncedDomainFilter) {
      const q = debouncedDomainFilter.toLowerCase();
      results = results.filter(item =>
        item.domains?.some(d => d.toLowerCase().includes(q)));
    }

    // 3. 路径（子串，大小写不敏感）
    if (debouncedPathFilter) {
      const q = debouncedPathFilter.toLowerCase();
      results = results.filter(item =>
        item.pathPredicate?.matchValue?.toLowerCase().includes(q));
    }

    // 4. Provider（任一命中）
    if (debouncedProviderFilter) {
      const q = debouncedProviderFilter.toLowerCase();
      results = results.filter(item =>
        item.upstreams?.some(u => u.provider?.toLowerCase().includes(q)));
    }

    // 5. 已授权消费者 ID（任一命中；未开启/无消费者路由被排除）
    if (debouncedConsumerFilter) {
      const q = debouncedConsumerFilter.toLowerCase();
      results = results.filter(item => {
        const { authConfig } = item;
        if (!authConfig?.enabled ||
            !Array.isArray(authConfig.allowedConsumers)) {
          return false;
        }
        return authConfig.allowedConsumers.some(c =>
          c.toLowerCase().includes(q));
      });
    }

    // 6. 认证状态（OR；3 种特殊值）
    if (selectedAuthStates.length > 0) {
      const set = new Set(selectedAuthStates);
      results = results.filter(item => {
        const { authConfig } = item;
        const notEnabled = !authConfig || !authConfig.enabled;
        const enabledNoConsumers = authConfig?.enabled &&
          (!Array.isArray(authConfig.allowedConsumers) ||
           authConfig.allowedConsumers.length === 0);
        const hasConsumers = authConfig?.enabled &&
          Array.isArray(authConfig.allowedConsumers) &&
          authConfig.allowedConsumers.length > 0;
        return (
          (set.has('__auth_disabled__') && notEnabled) ||
          (set.has('__no_consumers__') && enabledNoConsumers) ||
          (set.has('__auth_enabled__') && hasConsumers)
        );
      });
    }

    setDataSource(results);
  };

  const resetFilters = () => {
    setNameFilter('');
    setDomainFilter('');
    setPathFilter('');
    setProviderFilter('');
    setConsumerFilter('');
    setSelectedAuthStates([]);
    setDataSource([...(routesRef.current || [])]);
  };

  const { loading: wasmLoading, run: loadWasmPlugins } = useRequest(() => {
    return getWasmPlugins(i18n.language)
  }, {
    manual: true,
    onSuccess: (result = []) => {
      let plugins = result || [];
      setPluginInfoList(plugins);
    },
  });

  const { loading, run, refresh } = useRequest(getAiRoutes, {
    manual: true,
    onSuccess: (result) => {
      const aiRoutes = (result || []) as AiRoute[];
      aiRoutes.forEach(r => { r.key = r.name; });
      aiRoutes.sort((i1, i2) => {
        return i1.name.localeCompare(i2.name);
      })
      routesRef.current = aiRoutes;
      applyFilters();
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

  // 过滤状态变化时重新过滤
  useEffect(() => {
    if (routesRef.current) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedNameFilter,
    debouncedDomainFilter,
    debouncedPathFilter,
    debouncedProviderFilter,
    debouncedConsumerFilter,
    selectedAuthStates,
  ]);

  const buildUsageCommand = (aiRoute: AiRoute): string => {
    let command = `curl -sv http://<higress-gateway-ip>/v1/chat/completions \\
    -X POST \\
    -H 'Content-Type: application/json'`;
    if (aiRoute.domains && aiRoute.domains.length) {
      command += ` \\
    -H 'Host: ${aiRoute.domains[0]}'`;
    }
    command += ` \\
    -d \\
'{
  "model": "<model-name>",
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    }
  ]
}'`;
    return command;
  };

  const onUsageDrawer = (aiRoute: AiRoute) => {
    setUsageCommand(buildUsageCommand(aiRoute));
    setUsageDrawer(true);
  };

  const closeUsage = () => {
    setUsageCommand('');
    setUsageDrawer(false);
  }

  const onEditConfig = (aiRoute: AiRoute) => {
    history?.push(`/ai/route/config?type=aiRoute&name=${aiRoute.name}`);
  };

  const onEditDrawer = (aiRoute: AiRoute) => {
    setCurrentAiRoute(aiRoute);
    setOpenDrawer(true);
  };

  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentAiRoute(null);
  };

  const normalizeRoutePredicate = (predicate: RoutePredicate) => {
    predicate.caseSensitive = !predicate.ignoreCase || !predicate.ignoreCase.length;
  };

  const handleDrawerOK = async () => {
    setLoading(true);
    try {
      const values = formRef.current ? await formRef.current.handleSubmit() : {};
      if (!values) {
        return false;
      }

      const { pathPredicate, headerPredicates, urlParamPredicates } = values as AiRoute;
      pathPredicate && normalizeRoutePredicate(pathPredicate);
      headerPredicates && headerPredicates.forEach((h) => normalizeRoutePredicate(h));
      urlParamPredicates && urlParamPredicates.forEach((h) => normalizeRoutePredicate(h));

      if (currentAiRoute) {
        const params: AiRoute = { version: currentAiRoute.version, ...values };
        await updateAiRoute(params);
      } else {
        await addAiRoute(values as AiRoute);
      }

      setOpenDrawer(false);
      formRef.current && formRef.current.reset();
      refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerCancel = () => {
    setOpenDrawer(false);
    formRef.current && formRef.current.reset();
    setCurrentAiRoute(null);
  };

  const onShowModal = (aiRoute: AiRoute) => {
    setCurrentAiRoute(aiRoute);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    if (!currentAiRoute) {
      return;
    }
    setConfirmLoading(true);
    try {
      await deleteAiRoute(currentAiRoute.name);
    } catch (err) {
      handleModalCancel()
      setConfirmLoading(false);
      setOpenModal(false);
      refresh();
    }
    handleModalCancel();
    setConfirmLoading(false);
    setOpenModal(false);
    refresh();
  };

  const handleModalCancel = () => {
    setConfirmLoading(false);
    setOpenModal(false);
    setCurrentAiRoute(null);
  };

  const onShowStrategyList = async (record: AiRoute, expanded: boolean) => {
    if (expanded) {
      try {
        const routeResourceName = `ai-route-${record.name}.internal`;
        const plugins = await fetchPluginsByRoute({ name: routeResourceName } as any);
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

  return (
    <PageContainer>
      <Form
        style={{
          background: '#fff',
          padding: '16px 16px 24px',
          marginBottom: 16,
        }}
      >
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label={t('aiRoute.columns.name')}>
              <Input
                prefix={<SearchOutlined />}
                allowClear
                placeholder={t('aiRoute.search.name') || ''}
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('aiRoute.columns.domains')}>
              <Input
                prefix={<SearchOutlined />}
                allowClear
                placeholder={t('aiRoute.search.domain') || ''}
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('aiRoute.columns.upstreams')}>
              <Input
                prefix={<SearchOutlined />}
                allowClear
                placeholder={t('aiRoute.search.provider') || ''}
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('aiRoute.search.pathLabel')}>
              <Input
                prefix={<SearchOutlined />}
                allowClear
                placeholder={t('aiRoute.search.path') || ''}
                value={pathFilter}
                onChange={(e) => setPathFilter(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label={t('aiRoute.search.authState')}>
              <Select
                mode="multiple"
                allowClear
                placeholder={t('aiRoute.search.authState')}
                value={selectedAuthStates}
                onChange={setSelectedAuthStates}
                style={{ width: '100%' }}
              >
                <Option key="__auth_disabled__" value="__auth_disabled__">
                  {t('aiRoute.authNotEnabled')}
                </Option>
                <Option key="__no_consumers__" value="__no_consumers__">
                  {t('aiRoute.authEnabledWithoutConsumer')}
                </Option>
                <Option key="__auth_enabled__" value="__auth_enabled__">
                  {t('aiRoute.search.authEnabled')}
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('aiRoute.search.consumerLabel')}>
              <Input
                prefix={<SearchOutlined />}
                allowClear
                placeholder={t('aiRoute.search.consumer') || ''}
                value={consumerFilter}
                onChange={(e) => setConsumerFilter(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12} style={{ textAlign: 'right', paddingTop: 30 }}>
            <Button
              style={{ marginRight: 8 }}
              onClick={resetFilters}
            >
              {t('aiRoute.search.reset')}
            </Button>
            <Button
              style={{ marginRight: 8 }}
              type="primary"
              onClick={onShowDrawer}
            >
              {t('aiRoute.create')}
            </Button>
            <Button icon={<RedoOutlined />} onClick={refresh} />
          </Col>
        </Row>
      </Form>
      <Table
        loading={loading}
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
      <Drawer
        title={t(currentAiRoute ? "aiRoute.edit" : "aiRoute.create")}
        placement="right"
        width={660}
        destroyOnClose
        onClose={handleDrawerCancel}
        open={openDrawer}
        extra={
          <Space>
            <Button onClick={handleDrawerCancel}>{t('misc.cancel')}</Button>
            <Button type="primary" onClick={handleDrawerOK} loading={loadingapi}>
              {t('misc.confirm')}
            </Button>
          </Space>
        }
      >
        <RouteForm ref={formRef} value={currentAiRoute} />
      </Drawer>
      <Modal
        title={t("aiRoute.aiRouteUsage")}
        open={usageDrawer}
        onOk={closeUsage}
        onCancel={closeUsage}
        footer={[
          <Button key="submit" type="primary" onClick={closeUsage}>
            OK
          </Button>,
        ]}
      >
        {t("aiRoute.aiRouteUsageContent")}
        <SyntaxHighlighter language="shell">
          {usageCommand}
        </SyntaxHighlighter>
      </Modal>
      <Modal
        title={<div><ExclamationCircleOutlined style={{ color: '#ffde5c', marginRight: 8 }} />{t('misc.delete')}</div>}
        open={openModal}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
        cancelText={t('misc.cancel')}
        okText={t('misc.confirm')}
      >
        <p>
          <Trans t={t} i18nKey="aiRoute.deleteConfirmation">
            确定删除 <span style={{ color: '#0070cc' }}>{{ currentRouteName: (currentAiRoute && currentAiRoute.name) || '' }}</span> 吗？
          </Trans>
        </p>
      </Modal>
    </PageContainer>
  );
};

export default AiRouteList;
