import { RouteItem, RouteResponse } from '@/interfaces/route';
import { addGatewayRoute, deleteGatewayRoute, getGatewayRoute, updateGatewayRoute } from '@/services';
import { ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, Drawer, Form, Modal, Row, Space, Table } from 'antd';
import { uniqueId } from "lodash";
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import RouteForm from './components/RouteForm';

interface PathProps {
  type: string,
  path: string,
  ignoreCase: Array<string> | undefined,
}

interface RouteFormProps {
  name: string,
  domainList: Array<string>,
  headerPredicates: Array<any>,
  methodPredicates: Array<string>,
  pathPredicates: PathProps,
  queryPredicates: Array<any>,
  services: string,
}

const RouteList: React.FC = () => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('route.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: t('route.columns.routePredicates'),
      dataIndex: 'routePredicates',
      key: 'routePredicates',
      render: (value) => {
        const _pathPredicates = value["pathPredicates"];
        const { type, path } = _pathPredicates;
        return (
          <div>
            {`${t('route.fitTypes.' + type)} ｜ ${path}`}
          </div>
        );
      },
    },
    {
      title: t('route.columns.services'),
      dataIndex: 'services',
      key: 'services',
      ellipsis: true,
      render: (value) => {
        return value && value.map(service => {
          const { name } = service;
          return (<div key={name}>{name}</div>);
        });
      },
    },
    {
      title: t('route.columns.action'),
      dataIndex: 'action',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => onEditDrawer(record)}>{t('misc.edit')}</a>
          <a onClick={() => onShowModal(record)}>{t('misc.delete')}</a>
        </Space>
      ),
    },
  ];

  const [dataSource, setDataSource] = useState<RouteItem[]>([]);
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteItem | null>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const formRef = useRef(null);

  const getRouteList = async (factor): Promise<RouteResponse> => (getGatewayRoute(factor));

  const { loading, run, refresh } = useRequest(getRouteList, {
    manual: true,
    onSuccess: (result, params) => {
      const { list: _dataSource } = result;
      _dataSource.forEach(i => {
        i.key || (i.key = i.id ? i.id + '' : i.name);
      });
      setDataSource(_dataSource);
    },
  });

  useEffect(() => {
    run({});
  }, []);

  const onEditDrawer = (route: RouteItem) => {
    setCurrentRoute(route);
    setOpenDrawer(true);
  };

  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentRoute(null);
  }

  const handleDrawerOK = async () => {
    try {
      const values: RouteFormProps = formRef.current && await formRef.current.handleSubmit();
      const routePredicates = {};
      const {
        name,
        domainList,
        headerPredicates = [],
        methodPredicates = [],
        queryPredicates = [],
        pathPredicates = {},
        services,
      } = values;
      Object.assign(routePredicates, { headerPredicates, methodPredicates, queryPredicates });
      const { ignoreCase = [], type, path } = pathPredicates as PathProps;
      const _ignoreCase = ignoreCase.includes("ignore");
      Object.assign(routePredicates, { pathPredicates: { ignoreCase: _ignoreCase, type, path } });
      const data = {};
      Object.assign(data, { name, domainList, routePredicates, services: [{ name: services }] })
      if (currentRoute) {
        const _id = currentRoute.id || parseInt(uniqueId(), 10);
        await updateGatewayRoute({ id: _id, ...data } as RouteItem);
      } else {
        await addGatewayRoute(data as RouteItem);
      }
      setOpenDrawer(false);
      refresh();

    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const handleDrawerCancel = () => {
    setOpenDrawer(false);
    setCurrentRoute(null);
  };

  const onShowModal = (route: RouteItem) => {
    setCurrentRoute(route);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    setConfirmLoading(true);
    await deleteGatewayRoute({ name: currentRoute?.name });
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
            <Button
              type="primary"
              onClick={onShowDrawer}
            >
              {t('route.createRoute')}
            </Button>
          </Col>
          <Col span={20} style={{ textAlign: 'right' }}>
            <Button
              icon={<RedoOutlined />}
              onClick={refresh}
            />
          </Col>
        </Row>
      </Form>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <Modal
        title={<div><ExclamationCircleOutlined style={{ color: '#ffde5c', marginRight: 8 }} />{t('misc.delete')}</div>}
        open={openModal}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
      >
        <p>
          <Trans t={t} i18nKey="route.deleteConfirmation">
            确定删除 <span style={{ color: '#0070cc' }}>{{ currentRouteName: (currentRoute && currentRoute.name) || '' }}</span> 吗？
          </Trans>
        </p>
      </Modal>
      <Drawer
        title={t(currentRoute ? "route.editRoute" : "route.createRoute")}
        placement='right'
        width={660}
        onClose={handleDrawerCancel}
        open={openDrawer}
        extra={
          <Space>
            <Button onClick={handleDrawerCancel}>取消</Button>
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


