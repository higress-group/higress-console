import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { listMcpConsumers, removeMcpConsumers } from '@/services/mcp';

const ConsumerTable: React.FC = () => {
  const { t } = useTranslation();
  const [consumers, setConsumers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConsumers = async () => {
    setLoading(true);
    try {
      const res = await listMcpConsumers({});
      setConsumers(res.data || []);
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
        routeName: id,
        consumers: [id],
      });
      message.success(t('mcp.detail.deleteConsumerSuccess'));
      fetchConsumers();
    } catch (error) {
      message.error(t('mcp.detail.deleteConsumerError'));
    }
  };

  const columns = [
    {
      title: t('mcp.detail.consumerName'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('mcp.detail.consumerDescription'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('mcp.detail.consumerApiKey'),
      dataIndex: 'apiKey',
      key: 'apiKey',
    },
    {
      title: t('mcp.detail.consumerStatus'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'active' ? '#52c41a' : '#ff4d4f' }}>
          {t(`mcp.detail.consumerStatus${status.toUpperCase()}`)}
        </span>
      ),
    },
    {
      title: t('misc.action'),
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm
            title={t('mcp.detail.deleteConsumerConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('misc.confirm')}
            cancelText={t('misc.cancel')}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />}>
          {t('mcp.detail.addConsumer')}
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={consumers}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default ConsumerTable;
