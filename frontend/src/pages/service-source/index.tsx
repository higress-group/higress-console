import { ServiceSource, ServiceSourceFormProps } from '@/interfaces/service-source';
import { addServiceSources, deleteServiceSources, getServiceSources, updateServiceSources } from '@/services/service-source';
import { ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, Drawer, Form, Modal, Row, Space, Table } from 'antd';
import { uniqueId } from "lodash";
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SourceForm from './components/SourceForm';

interface SourceFormRef {
  reset: () => void,
  handleSubmit: () => Promise<ServiceSourceFormProps>,
}

const SourceList: React.FC = () => {
  const { t } = useTranslation();
  const columns = [
    {
      title: '注册中心类型',
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
    },
    {
      title: '服务来源名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '注册中心地址',
      dataIndex: 'domain',
      key: 'domain',
    },
    {
      title: '注册中心访问端口',
      dataIndex: 'port',
      key: 'port',
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
  const formRef = useRef<SourceFormRef>(null);
  const [dataSource, setDataSource] = useState<ServiceSource[]>([]);
  const [currentDomain, setCurrentDomain] = useState<ServiceSource | null>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const getDomainList = async (): Promise<ServiceSource[]> => (getServiceSources());

  const { loading, run, refresh } = useRequest(getDomainList, {
    manual: true,
    onSuccess: (result, params) => {
      const { data: _dataSource } = result;
      _dataSource.forEach(i => {
        i.key || (i.key = i.id || (i.name + '_' + i.type))
      })
      setDataSource(_dataSource);
    },
  });

  useEffect(() => {
    run({});
  }, []);

  const onEditDrawer = (domain: ServiceSource) => {
    setCurrentDomain(domain);
    setOpenDrawer(true);
  };

  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentDomain(null);
  };

  const handleDrawerOK = async () => {
    try {
      const values: ServiceSourceFormProps = formRef.current ? await formRef.current.handleSubmit() : {} as ServiceSourceFormProps;

      if (currentDomain) {
        const _id = currentDomain.id || parseInt(uniqueId(), 10);
        await updateServiceSources({ id: _id, ...values } as ServiceSource);
      } else {
        await addServiceSources(values as ServiceSource);
      }

      setOpenDrawer(false);
      formRef.current && formRef.current.reset();
      refresh();

    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const handleDrawerCancel = () => {
    setOpenDrawer(false);
    formRef.current && formRef.current.reset();
    setCurrentDomain(null);
  };

  const onShowModal = (domain: ServiceSource) => {
    setCurrentDomain(domain);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    setConfirmLoading(true);
    await deleteServiceSources({ name: currentDomain?.name });
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
              创建服务来源
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
      <Drawer
        title="创建服务来源"
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
        <SourceForm ref={formRef} value={currentDomain} />
      </Drawer>
      <Modal
        title={<div><ExclamationCircleOutlined style={{ color: '#ffde5c', marginRight: 8 }} />删除</div>}
        open={openModal}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
      >
        <p>确定删除 <span style={{ color: '#0070cc' }}>{(currentDomain && currentDomain.name) || ''} </span>吗？</p>
      </Modal>
    </PageContainer>
  );
};

export default SourceList;
