import React, { useEffect } from 'react';
import {
  Button,
  Card,
  Table,
  Space,
  Switch,
  Popconfirm,
  message
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { MCPLLayout } from '../../components/mcp/MCPLLayout';
import { IMCPConfig } from '../../interfaces/mcp';
import { useNavigate, useSelector, useDispatch } from 'ice';

const MCPListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mcpState = useSelector((state) => state.mcp);

  const handleEnableToggle = async (id: string, enabled: boolean) => {
    try {
      // This would be replaced with actual API calls
      setTimeout(() => {
        dispatch.mcp.updateState({
          configurations: mcpState.configurations.map(config => 
            config.id === id ? { ...config, enabled: !enabled } : config
          ),
        });
        message.success(`Configuration ${enabled ? 'disabled' : 'enabled'} successfully`);
      }, 500);
    } catch (error) {
      message.error(`Failed to ${enabled ? 'disable' : 'enable'} configuration`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // This would be replaced with actual API calls
      setTimeout(() => {
        dispatch.mcp.updateState({
          configurations: mcpState.configurations.filter(config => config.id !== id),
          total: mcpState.total - 1,
        });
        message.success('Configuration deleted successfully');
      }, 500);
    } catch (error) {
      message.error('Failed to delete configuration');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Type',
      dataIndex: 'sourceType',
      key: 'sourceType',
      render: (type: string) => (
        <span>{type}</span>
      ),
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: IMCPConfig) => (
        <Switch
          checked={enabled}
          onChange={(value) => handleEnableToggle(record.id, value)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: IMCPConfig) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => navigate(`/mcp/edit/${record.id}`)} />
          <Popconfirm
            title="Are you sure to delete this configuration?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (mcpState.configurations.length === 0) {
      dispatch.mcp.getMCPConfigs({ page: mcpState.page, pageSize: mcpState.pageSize });
    }
  }, []);

  return (
    <MCPLLayout>
      <Card
        title="MCP Configurations"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/mcp/add')}>
            Create Configuration
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={mcpState.configurations.map(config => ({
            ...config,
            key: config.id,
          }))}
          loading={mcpState.loading}
          pagination={{
            current: mcpState.page,
            pageSize: mcpState.pageSize,
            total: mcpState.total,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              dispatch.mcp.getMCPConfigs({ page, pageSize });
            },
          }}
          rowKey="id"
        />
      </Card>
    </MCPLLayout>
  );
};

export default MCPListPage;