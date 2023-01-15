import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Col, Form, Input, Row, Select, Button, Modal, Space, Drawer } from 'antd';
import { getGatewayRoute, addGatewayRoute, deleteGatewayRoute, updateGatewayRoute } from '@/services';
import { useRequest } from 'ahooks';
import { RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { uniqueId } from "lodash";
import DomainForm from './components/DomainForm';


const DomainList: React.FC = () => {
  const columns = [
    {
      title: '域名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      key: 'protocol',
    },
    {
      title: '证书',
      dataIndex: 'certIdentifier',
      key: 'certIdentifier',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <a>编辑</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);

  const onShowDrawer = () => setOpenDrawer(true);

  const handleDrawerOK = async () => {};

  const handleDrawerCancel = () => setOpenDrawer(false);


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
              创建域名
            </Button>
          </Col>
          <Col span={20} style={{ textAlign: 'right' }}>
            <Button
              icon={<RedoOutlined />}
              // onClick={refresh}
            />
          </Col>
        </Row>
      </Form>
      <Table
        // loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <Drawer
        title="创建域名"
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
        <DomainForm ref={formRef} />
      </Drawer>

    </PageContainer>
  );
};

export default DomainList;


