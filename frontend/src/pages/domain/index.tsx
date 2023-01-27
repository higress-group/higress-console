import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Col, Form, Input, Row, Select, Button, Modal, Space, Drawer } from 'antd';
import { getGatewayDomain, addGatewayDomain, deleteGatewayDomain, updateGatewayDoamin } from '@/services';
import { DomainItem, DomainResponse } from '@/interfaces/domain';
import { useRequest } from 'ahooks';
import { RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { uniqueId } from "lodash";
import DomainForm from './components/DomainForm';

interface DomainFormProps {
  name: string,
  protocol: string,
  certIdentifier?: string,
  mustHttps?: Array<any>,
}


const DomainList: React.FC = () => {
  const columns = [
    {
      title: '域名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
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
      render: (value) => (value || '-'),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => onEditDrawer(record)}>编辑</a>
          <a onClick={() => onShowModal(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [dataSource, setDataSource] = useState<DomainItem[]>([]);
  const [currentDomain, setCurrentDomain] = useState<DomainItem | null>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const getDomainList = async (factor): Promise<DomainResponse> => (getGatewayDomain(factor));
  const { loading, run, refresh } = useRequest(getDomainList, {
    manual: true,
    onSuccess: (result, params) => {
      const { list: _dataSource } = result;
      _dataSource.forEach(i => {
        i.key || (i.key = i.id || (i.name + '_' + i.protocol))
      })
      setDataSource(_dataSource);
    },
  });

  useEffect(() => {
    run({});
  }, []);


  const onEditDrawer = (domain: DomainItem) => {
    setCurrentDomain(domain);
    setOpenDrawer(true);
  };

  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentDomain(null);
  };

  const handleDrawerOK = async () => {
    try {
      const values: DomainFormProps = formRef.current && await formRef.current.handleSubmit();
      const { name, protocol, certIdentifier, mustHttps } = values;
      const data = { name, protocol };
      if (values.certIdentifier) {
        Object.assign(data, { certIdentifier });
      }
      if (values.mustHttps) {
        Object.assign(data, { mustHttps: !!mustHttps?.length });
      }
      if (currentDomain) {
        const _id = currentDomain.id || parseInt(uniqueId(), 10);
        await updateGatewayDoamin({ id: _id, ...data } as DomainItem);
      } else {
        await addGatewayDomain(data as DomainItem);
      }
      setOpenDrawer(false);
      refresh();

    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const handleDrawerCancel = () => {
    setOpenDrawer(false);
    setCurrentDomain(null);
  };

  const onShowModal = (domain: DomainItem) => {
    setCurrentDomain(domain);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    setConfirmLoading(true);
    await deleteGatewayDomain({ name: currentDomain?.name });
    setConfirmLoading(false);
    setOpenModal(false);
    // 重新刷新
    refresh();
  };

  const handleModalCancel = () => {
    setOpenModal(false);
    setCurrentDomain(null);
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
              创建域名
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
        title={<div><ExclamationCircleOutlined style={{ color: '#ffde5c', marginRight: 8 }}/>删除</div>}
        open={openModal}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
      >
        <p>确定删除 <span style={{ color: '#0070cc' }}>{ (currentDomain && currentDomain.name) || ''} </span>吗？</p>
      </Modal>
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
        <DomainForm ref={formRef} value={currentDomain} />
      </Drawer>

    </PageContainer>
  );
};

export default DomainList;
