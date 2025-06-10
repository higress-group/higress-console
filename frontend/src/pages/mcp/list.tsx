import React, { useEffect, useState } from 'react';
import { Button, Table, Space, Popconfirm, message, Form, Input, Row, Col, Select, Modal } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { McpServer } from '@/interfaces/mcp';
import { PageContainer } from '@ant-design/pro-layout';
import { useTranslation, Trans } from 'react-i18next';
import { createOrUpdateMcpServer, listMcpServers } from '@/services/mcp';
import McpFormDrawer from './components/McpFormDrawer';
import { history } from 'ice';
import { getServiceTypeMap, SERVICE_TYPES } from './constant';
import DeleteConfirm from './components/DeleteConfirm';

const MCPListPage: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [servers, setServers] = useState<McpServer[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);

  const serviceTypeMap = getServiceTypeMap(t('mcp.form.directRouteText'));

  const handleDelete = async (record: any) => {
    try {
      setConfirmLoading(true);
      // TODO: implement deleteMcpServer
      setConfirmLoading(false);
      setOpenModal(false);
      getMcpServers({});
    } catch (error) {
      message.error('Failed to delete configuration');
      setConfirmLoading(false);
    }
  };

  const onShowModal = (record: any) => {
    setCurrentRecord(record);
    setOpenModal(true);
  };

  const handleModalCancel = () => {
    setOpenModal(false);
    setCurrentRecord(null);
  };

  const openDrawer = (mode: 'create' | 'edit', record?: any) => {
    setDrawerMode(mode);
    setEditingRecord(record || null);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setEditingRecord(null);
  };

  const handleDrawerSubmit = async (values: any) => {
    try {
      await createOrUpdateMcpServer(values);
      message.success(t('misc.saveSuccess'));
      closeDrawer();
      getMcpServers({});
    } catch (e) {
      message.error(t('misc.error'));
    }
  };

  const columns = [
    {
      title: t('mcp.columns.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a onClick={() => history?.push(`/mcp/detail?name=${text}`)}>{text}</a>,
    },
    {
      title: t('mcp.columns.description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('mcp.columns.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <span>{serviceTypeMap[type]}</span>,
    },
    {
      title: t('mcp.columns.action'),
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="small">
          <a onClick={() => openDrawer('edit', record)}>{t('misc.edit')}</a>
          <a onClick={() => onShowModal(record)}>{t('misc.delete')}</a>
        </Space>
      ),
    },
  ];

  // 获取MCP服务列表
  const getMcpServers = async (params: { name?: string; type?: string }) => {
    const res = await listMcpServers({
      pageNum: 1,
      pageSize: 100,
      serverName: params.name,
      type: params.type,
    });
    setServers(res || []);
  };

  // 搜索逻辑
  const onSearch = () => {
    const values = form.getFieldsValue();
    getMcpServers({ name: values.name, type: values.type });
  };

  const onReset = () => {
    form.resetFields();
    getMcpServers({});
  };

  useEffect(() => {
    getMcpServers({});
    // eslint-disable-next-line
  }, []);

  return (
    <PageContainer>
      <Form
        form={form}
        style={{ background: '#fff', height: 64, paddingTop: 16, marginBottom: 16, paddingLeft: 16, paddingRight: 16 }}
      >
        <Row gutter={24}>
          <Col span={4}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openDrawer('create')}>
              {t('mcp.form.create')}
            </Button>
          </Col>
          <Col span={6}>
            <Form.Item label={t('mcp.search.name')} name="name">
              <Input allowClear placeholder={t('mcp.search.name') as string} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('mcp.search.type')} name="type">
              <Select
                allowClear
                placeholder={t('mcp.search.type') as string}
                options={SERVICE_TYPES.map((v) => ({
                  label: t(`${serviceTypeMap[v]}`),
                  value: v,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={onSearch}>
              {t('mcp.search.search')}
            </Button>
            <Button style={{ margin: '0 8px' }} onClick={onReset}>
              {t('mcp.search.reset')}
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        columns={columns}
        dataSource={servers.map((item) => ({
          ...item,
          key: item.name,
        }))}
        loading={false}
        pagination={false}
        rowKey="name"
      />
      <McpFormDrawer
        visible={drawerVisible}
        mode={drawerMode}
        record={editingRecord}
        onClose={closeDrawer}
        onSubmit={handleDrawerSubmit}
      />
      <DeleteConfirm
        open={openModal}
        onOk={() => handleDelete(currentRecord)}
        onCancel={handleModalCancel}
        confirmLoading={confirmLoading}
        recordName={currentRecord?.name}
        i18nKey="mcp.deleteConfirm"
      />
    </PageContainer>
  );
};

export default MCPListPage;
