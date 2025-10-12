/**
 * AI 路由列表页面组件
 * 提供 AI 路由的管理功能，包括创建、编辑、删除、搜索等操作
 * 支持路由配置的详细设置和 curl 命令生成
 */

// 导入 AI 路由相关的类型定义
import { AiRoute, AiUpstream } from '@/interfaces/ai-route';
import { RoutePredicate } from '@/interfaces/route';

// 导入 AI 路由服务
import { addAiRoute, deleteAiRoute, getAiRoutes, updateAiRoute } from '@/services/ai-route';

// 导入 Ant Design 图标
import { ArrowRightOutlined, ExclamationCircleOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';

// 导入 Ant Design Pro 布局组件
import { PageContainer } from '@ant-design/pro-layout';

// 导入数据请求 Hook
import { useRequest } from 'ahooks';

// 导入 Ant Design 组件
import { Button, Col, Drawer, Form, FormProps, Input, Modal, Row, Space, Table } from 'antd';

// 导入路由管理
import { history } from 'ice';

// 导入 React Hook
import React, { useEffect, useRef, useState } from 'react';

// 导入国际化
import { Trans, useTranslation } from 'react-i18next';

// 导入语法高亮组件
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// 导入路由表单组件
import RouteForm from './components/RouteForm';

/**
 * 表单引用接口
 * 定义了表单组件暴露给父组件的方法
 */
interface FormRef {
  reset: () => void;                                    // 重置表单
  handleSubmit: () => Promise<FormProps>;              // 提交表单并返回数据
}

/**
 * AI 路由列表页面组件
 * 提供完整的 AI 路由管理功能
 */
const AiRouteList: React.FC = () => {
  // 获取国际化翻译函数
  const { t } = useTranslation();

  /**
   * 表格列配置
   * 定义了 AI 路由列表的显示列
   */
  const columns = [
    {
      title: t('aiRoute.columns.name'),      // 路由名称
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,                        // 超出部分省略
    },
    {
      title: t('aiRoute.columns.domains'),   // 域名列表
      dataIndex: 'domains',
      key: 'domains',
      render: (value) => {
        if (!Array.isArray(value) || !value.length) {
          return '-';
        }
        return value.map((token) => <span>{token}</span>).reduce((prev, curr) => [prev, <br />, curr]);
      },
    },
    {
      title: t('aiRoute.columns.pathPredicate'), // 路径匹配规则
      dataIndex: 'pathPredicate',
      key: 'pathPredicate',
      render: (value: RoutePredicate, record: AiRoute) => {
        return <div>{`${t(`route.matchTypes.${value.matchType}`)} ｜ ${value.matchValue}`}</div>;
      },
    },
    {
      title: t('aiRoute.columns.modelPredicates'), // 模型匹配规则
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
      title: t('aiRoute.columns.upstreams'), // 上游服务
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
        if (record.fallbackUpstream?.provider) {
          elements.push((
            <>
              <ArrowRightOutlined style={{ marginRight: '5px' }} />
              {record.fallbackUpstream.provider}
            </>
          ))
        }
        return elements.map((ele) => <span>{ele}</span>).reduce((prev, curr) => [prev, <br />, curr]);
      },
    },
    {
      title: t('aiRoute.columns.auth'), // 认证配置
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
        return value.map((consumer) => <span>{consumer}</span>).reduce((prev, curr) => [prev, <br />, curr]);
      },
    },
    {
      title: t('misc.actions'), // 操作列
      dataIndex: 'action',
      key: 'action',
      width: 240,
      align: 'center',
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

  // 表单相关状态
  const [form] = Form.useForm();
  const formRef = useRef<FormRef>(null);
  const routesRef = useRef<AiRoute[] | null>(null);
  const [dataSource, setDataSource] = useState<AiRoute[]>([]);
  const [currentAiRoute, setCurrentAiRoute] = useState<AiRoute | null>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [loadingapi, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [usageDrawer, setUsageDrawer] = useState(false)
  const [usageCommand, setUsageCommand] = useState('')

  /**
   * 获取 AI 路由列表数据
   * 使用 ahooks 的 useRequest 管理数据请求状态
   */
  const { loading, run, refresh } = useRequest(getAiRoutes, {
    manual: true, // 手动触发请求
    onSuccess: (result) => {
      const aiRoutes = (result || []) as AiRoute[];
      
      // 为每个路由添加 key 属性，用于表格渲染
      aiRoutes.forEach(r => { r.key = r.name; });
      
      // 按名称排序
      aiRoutes.sort((i1, i2) => {
        return i1.name.localeCompare(i2.name);
      })
      
      routesRef.current = aiRoutes;
      onSearch(); // 执行搜索过滤
    },
  });

  /**
   * 组件挂载时加载数据
   */
  useEffect(() => {
    run();
  }, []);

  /**
   * 生成 curl 使用命令
   * 根据 AI 路由配置生成测试用的 curl 命令
   * 
   * @param aiRoute - AI 路由配置
   * @returns 返回 curl 命令字符串
   */
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

  /**
   * 显示使用说明抽屉
   * 生成并显示 curl 命令示例
   */
  const onUsageDrawer = (aiRoute: AiRoute) => {
    setUsageCommand(buildUsageCommand(aiRoute));
    setUsageDrawer(true);
  };

  /**
   * 关闭使用说明
   */
  const closeUsage = () => {
    setUsageCommand(null);
    setUsageDrawer(false);
  }

  /**
   * 编辑路由配置
   * 跳转到配置编辑页面
   */
  const onEditConfig = (aiRoute: AiRoute) => {
    history?.push(`/ai/route/config?type=aiRoute&name=${aiRoute.name}`);
  };

  /**
   * 编辑路由
   * 打开编辑抽屉
   */
  const onEditDrawer = (aiRoute: AiRoute) => {
    setCurrentAiRoute(aiRoute);
    setOpenDrawer(true);
  };

  /**
   * 创建新路由
   * 打开创建抽屉
   */
  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentAiRoute(null);
  };

  /**
   * 搜索过滤功能
   * 根据搜索关键词过滤路由列表
   */
  const onSearch = () => {
    setIsLoading(true);
    let _dataSource: AiRoute[] = routesRef.current as AiRoute[];
    const { searchVal } = form.getFieldsValue();
    if (searchVal) {
      _dataSource = _dataSource.filter((item) => {
        const nameMatch = item.name?.includes(searchVal);
        const domainsMatch = item.domains?.some(domain => domain.includes(searchVal));
        const pathMatch = item.pathPredicate?.matchValue?.includes(searchVal);
        const upstreamsMatch = item.upstreams?.some(upstream => upstream.provider?.includes(searchVal));
        return nameMatch || domainsMatch || pathMatch || upstreamsMatch;
      });
    }
    setDataSource(_dataSource);
    setIsLoading(false);
  };

  /**
   * 标准化路由谓词
   * 处理路由匹配规则的大小写敏感设置
   */
  const normalizeRoutePredicate = (predicate: RoutePredicate) => {
    predicate.caseSensitive = !predicate.ignoreCase || !predicate.ignoreCase.length;
  };

  /**
   * 处理抽屉确认按钮
   * 提交表单数据，创建或更新路由
   */
  const handleDrawerOK = async () => {
    setLoading(true);
    try {
      const values = formRef.current ? await formRef.current.handleSubmit() : {};
      if (!values) {
        return false;
      }

      // 标准化路由谓词
      const { pathPredicate, headerPredicates, urlParamPredicates } = values as AiRoute;
      pathPredicate && normalizeRoutePredicate(pathPredicate);
      headerPredicates && headerPredicates.forEach((h) => normalizeRoutePredicate(h));
      urlParamPredicates && urlParamPredicates.forEach((h) => normalizeRoutePredicate(h));

      if (currentAiRoute) {
        // 更新现有路由
        const params: AiRoute = { version: currentAiRoute.version, ...values };
        await updateAiRoute(params);
      } else {
        // 创建新路由
        await addAiRoute(values as AiRoute);
      }

      setOpenDrawer(false);
      formRef.current && formRef.current.reset();
      refresh(); // 刷新数据
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理抽屉取消按钮
   */
  const handleDrawerCancel = () => {
    setOpenDrawer(false);
    formRef.current && formRef.current.reset();
    setCurrentAiRoute(null);
  };

  /**
   * 显示删除确认对话框
   */
  const onShowModal = (aiRoute: AiRoute) => {
    setCurrentAiRoute(aiRoute);
    setOpenModal(true);
  };

  /**
   * 处理删除确认
   */
  const handleModalOk = async () => {
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

  /**
   * 处理删除取消
   */
  const handleModalCancel = () => {
    setConfirmLoading(false);
    setOpenModal(false);
    setCurrentAiRoute(null);
  };

  return (
    <PageContainer>
      {/* 搜索表单 */}
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
                placeholder={t('aiRoute.searchPlaceholder') || ''}
                prefix={<SearchOutlined />}
                onChange={onSearch}
              />
            </Form.Item>
          </Col>
          <Col span={10} style={{ textAlign: 'right' }}>
            <Button
              style={{ margin: '0 8px' }}
              type="primary"
              onClick={onShowDrawer}
            >
              {t('aiRoute.create')}
            </Button>
            <Button icon={<RedoOutlined />} onClick={refresh} />
          </Col>
        </Row>
      </Form>
      
      {/* 路由列表表格 */}
      <Table
        loading={loading || isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      
      {/* 编辑/创建抽屉 */}
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
      
      {/* 使用说明模态框 */}
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
      
      {/* 删除确认模态框 */}
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