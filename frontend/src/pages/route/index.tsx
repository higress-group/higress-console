import {
  KeyedRoutePredicate,
  Route,
  RoutePredicate,
  RouteResponse,
  UpstreamService,
  upstreamServiceToString,
} from '@/interfaces/route';
import { addGatewayRoute, deleteGatewayRoute, getGatewayRoutes, updateGatewayRoute } from '@/services';
import store from '@/store';
import { ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Alert, Button, Col, Drawer, Form, Modal, Row, Space, Table, Typography } from 'antd';
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
  const routeManagementSupported = systemState && systemState.capabilities && systemState.capabilities.indexOf('config.ingress.v1') !== -1;

  const columns = [
    {
      title: t('route.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
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
      title: t('route.columns.action'),
      dataIndex: 'action',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => {
        return routeManagementSupported && (
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
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<Route | null>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const formRef = useRef(null);

  const getRouteList = async (factor): Promise<RouteResponse> => getGatewayRoutes(factor);

  const { loading, run, refresh } = useRequest(getRouteList, {
    manual: true,
    onSuccess: (result: Route[], params) => {
      result &&
        result.forEach((i) => {
          i.key || (i.key = i.id ? `${i.id}` : i.name);
        });
      setDataSource(result || []);
    },
  });

  useEffect(() => {
    run({});
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
      const { name, domains, headers, methods, urlParams, path, services, customConfigs } = values;
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
          <Col span={4}>
            <Button type="primary" onClick={onShowDrawer} disabled={!routeManagementSupported}>
              {t('route.createRoute')}
            </Button>
          </Col>
          <Col span={20} style={{ textAlign: 'right' }}>
            <Button icon={<RedoOutlined />} onClick={refresh} />
          </Col>
        </Row>
      </Form>
      <Table loading={loading} dataSource={dataSource} columns={columns} pagination={false} />
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
