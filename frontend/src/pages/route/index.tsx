import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Col, Form, Input, Row, Select, Button, Modal, Space, Drawer } from 'antd';
import { getGatewayRoute, addGatewayRoute, deleteGatewayRoute } from '@/services';
import { RouteResponse, RouteItem } from '@/interfaces/route';
import { useRequest } from 'ahooks';
import { RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import RouteForm from './components/RouteForm';

interface PathProps {
  type: string,
  path: string,
  ignoreCase: Array<string> | undefined,
}

interface RouteFormProps {
  name: string,
  headerPredicates: Array<any>,
  methodPredicates: Array<string>,
  pathPredicates: PathProps,
  queryPredicates: Array<any>,
  services: string,
}

const FitType = {
  PRE: '前缀匹配',
  EQUAL: '精确匹配',
  ERGULAR: '正则匹配',
};

const RouteTableList: React.FC = () => {
  const columns = [
    {
      title: '路由名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '路由条件',
      dataIndex: 'routePredicates',
      key: 'routePredicates',
      render: (value) => {
        const _pathPredicates = value["pathPredicates"];
        const { type, path } = _pathPredicates;
        return (
          <div>
            {`${FitType[type]} ｜ ${path}`}
          </div>
        );
      },
    },
    {
      title: '目标服务',
      dataIndex: 'services',
      key: 'services',
      ellipsis: true,
      render: (value) => {
        return value && value.map(service => {
          const { name } = service;
          return (<div>{ name }</div>);
        });
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          {/* <a>编辑</a> */}
          <a onClick={() => onShowModal(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const [dataSource, setDataSource] = useState<RouteItem[]>([]);
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteItem>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const formRef = useRef(null);

  
  const getRouteList = async (factor): Promise<RouteResponse> => (getGatewayRoute(factor));

  const { loading, run } = useRequest(getRouteList, {
    manual: true,
    onSuccess: (result, params) => {
      const { list: _dataSource } = result;
      setDataSource(_dataSource);
    },
  });

  useEffect(() => {
    run({ });
  }, []);

  const onRefresh = () => run({ });



  const onShowDrawer = () => setOpenDrawer(true);

  const handleDrawerOK = async () => {
    try {
      const values: RouteFormProps = formRef.current && await formRef.current.handleSubmit();
      const routePredicates = {};
      const {
        name,
        headerPredicates = [], 
        methodPredicates = [], 
        queryPredicates = [],
        pathPredicates = {},
        services,
      } = values;
      Object.assign(routePredicates, { headerPredicates, methodPredicates, queryPredicates });
      const { ignoreCase = [], type, path } = pathPredicates as PathProps;
      // ignoreCase不包含‘ignore’， _ignoreCase为true
      const _ignoreCase = !ignoreCase.includes("ignore");
      Object.assign(routePredicates, { pathPredicates: { ignoreCase: _ignoreCase, type, path} });
      const data = {};
      Object.assign(data, { name, routePredicates, services: [{ name: services }] })
      await addGatewayRoute(data);
      setOpenDrawer(false);
      run({ });

    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const handleDrawerCancel = () => setOpenDrawer(false);

  const onShowModal = (route) => {
    setCurrentRoute(route);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    setConfirmLoading(true);
    await deleteGatewayRoute({ name: currentRoute?.name });
    setConfirmLoading(false);
    setOpenModal(false);
    // 重新刷新
    run({ });
  };

  const handleModalCancel = () => setOpenModal(false);

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
              创建路由
            </Button>
          </Col>
          <Col span={20} style={{ textAlign: 'right' }}>
            <Button
              icon={<RedoOutlined />}
              onClick={onRefresh}
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
        title={<div><ExclamationCircleOutlined style={{ color: '#ffde5c', marginRight: 8 }}/>删除</div>}
        open={openModal}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
      >
        <p>确定删除 <span style={{ color: '#0070cc' }}>{ (currentRoute && currentRoute.name) || ''} </span>吗？</p>
      </Modal>
      <Drawer
        title="创建路由"
        placement='right'
        width={660}
        onClose={handleDrawerCancel}
        open={openDrawer}
        extra={
          <Space>
            <Button onClick={handleDrawerCancel}>取消</Button>
            <Button type="primary" onClick={handleDrawerOK}>
              确定
            </Button>
          </Space>
        }
      >
        <RouteForm ref={formRef} />
      </Drawer>

    </PageContainer>
  );
};

export default RouteTableList;


