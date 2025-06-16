import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Table, Button, Space, message, Input, Form, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { listMcpConsumers, removeMcpConsumers } from '@/services/mcp';
import HighSearch from '@/components/HighSearch';
import { useSearchParams } from 'ice';
import DeleteConfirm from './DeleteConfirm';
import AddConsumerAuth from './AddConsumerAuth';

const ConsumerTable = forwardRef<any, { children?: React.ReactNode }>(({ children }, ref) => {
  const { t } = useTranslation();
  const [consumers, setConsumers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [addConsumerAuthVisible, setAddConsumerAuthVisible] = useState(false);

  const [form] = Form.useForm();

  const fetchConsumers = async () => {
    setLoading(true);
    try {
      const res = await listMcpConsumers({
        mcpServerName: name,
      });
      setConsumers(res || []);
    } catch (error) {
      message.error(t('mcp.detail.fetchConsumersError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await removeMcpConsumers({
        routeName: name,
        consumers: [id],
      });
      message.success(t('mcp.detail.deleteSuccess'));
      fetchConsumers();
    } catch (error) {
      message.error(t('mcp.detail.deleteError'));
    }
  };

  const columns = [
    {
      title: t('mcp.detail.consumerName'),
      dataIndex: 'consumerName',
      key: 'consumerName',
    },
    // {
    //   title: t('mcp.detail.consumerDescription'),
    //   dataIndex: 'description',
    //   key: 'description',
    // },
    {
      title: t('mcp.detail.consumerAuthType'),
      dataIndex: 'type',
      key: 'type',
    },
    // {
    //   title: t('mcp.detail.status'),
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (status: string) => (
    //     <span style={{ color: status === 'active' ? '#52c41a' : '#ff4d4f' }}>
    //       {t(`mcp.detail.consumerStatus${status.toUpperCase()}`)}
    //     </span>
    //   ),
    // },
    {
      title: t('misc.action'),
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setCurrentRecord(record);
              setDeleteModalVisible(true);
            }}
          >
            {t('mcp.detail.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  useImperativeHandle(ref, () => ({
    fetchConsumers,
  }));

  return (
    <div>
      <Form
        form={form}
      >
        <Row gutter={24}>
          <Col span={3}>
            {children}
          </Col>
          <Col span={12}>
            <Form.Item name="consumerName" label={t('mcp.detail.consumerName')}>
              <Input allowClear placeholder={t('mcp.detail.consumerNameSearchPlaceholder') as string} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        columns={columns}
        dataSource={consumers}
        loading={loading}
        rowKey="id"
        pagination={false}
        locale={{ emptyText: t('mcp.detail.noData') }}
      />
      <DeleteConfirm
        open={deleteModalVisible}
        onOk={() => {
          handleDelete(currentRecord?.consumerName);
          setDeleteModalVisible(false);
        }}
        onCancel={() => setDeleteModalVisible(false)}
        recordName={currentRecord?.consumerName}
        i18nKey="mcp.detail.deleteConsumerConfirm"
      />
      <AddConsumerAuth
        visible={addConsumerAuthVisible}
        onClose={() => setAddConsumerAuthVisible(false)}
        onSuccess={fetchConsumers}
        mcpName={name}
        strategyConfigId=""
      />
    </div>
  );
});

export default ConsumerTable;
