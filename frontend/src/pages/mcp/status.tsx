import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Spin,
  Select
} from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, SyncOutlined, ReloadOutlined } from '@ant-design/icons';
import { MCPLLayout } from '../../components/mcp/MCPLLayout';
import MCPStatusCard from '../../components/mcp/MCPStatusCard';
import { useNavigate, useSelector, useDispatch } from 'ice';
import { getMCPStatus } from '../../services/mcp/status';
import { IMCPConfig } from '../../interfaces/mcp';

const { CheckCircleFilled } = require('@ant-design/icons');

const MCPStatusPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mcpState = useSelector((state) => state.mcp);

  const columns = [
    {
      title: 'Configuration Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span>
          {status === 'Active' && <CheckCircleFilled style={{ color: '#52c41a', marginRight: 8 }} />}
          {status}
        </span>
      ),
    },
    {
      title: 'Last Used',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <span>{enabled ? 'Yes' : 'No'}</span>
      ),
    },
    {
      title: 'Success Rate',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (successRate: number) => (
        <span>{successRate !== undefined ? `${successRate}%` : '-'}</span>
      ),
    },
    {
      title: 'Error Rate',
      dataIndex: 'errorRate',
      key: 'errorRate',
      render: (errorRate: number) => (
        <span>{errorRate !== undefined ? `${errorRate}%` : '-'}</span>
      ),
    },
  ];

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await getMCPStatus(timeRange);
      dispatch.mcp.updateState({
        configurations: mcpState.configurations.map(config => {
          const statusInfo = response.data.find(info => info.id === config.id);
          return statusInfo ? { ...config, ...statusInfo } : config;
        }),
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mcpState.configurations.length === 0) {
      dispatch.mcp.getMCPConfigs({ page: 1, pageSize: 10 });
    }
  }, []);

  // Get human-readable time range label
  const getTimeRangeLabel = (range: string): string => {
    switch(range) {
      case '1h': return 'Last Hour';
      case '24h': return 'Last 24 Hours';
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      default: return 'Custom Range';
    }
  };

  return (
    <MCPLLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>MCP Server Status</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Select 
            value={timeRange} 
            onChange={setTimeRange}
            style={{ width: 150 }}
          >
            <Select.Option value="1h">Last Hour</Select.Option>
            <Select.Option value="24h">Last 24 Hours</Select.Option>
            <Select.Option value="7d">Last 7 Days</Select.Option>
            <Select.Option value="30d">Last 30 Days</Select.Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={fetchStatus} loading={loading}>
            Refresh Status
          </Button>
        </div>
      </div>

      <MCPStatusCard stats={{
        totalConfigs: mcpState.configurations.length,
        activeConfigs: mcpState.configurations.filter(c => c.status === 'Active').length,
        lastSyncTime: new Date().toLocaleString(),
        successRate: mcpState.configurations.length > 0 
          ? Math.round(mcpState.configurations.reduce((sum, c) => sum + (c.successRate || 0), 0) / mcpState.configurations.length) 
          : undefined,
        errorRate: mcpState.configurations.length > 0 
          ? Math.round(mcpState.configurations.reduce((sum, c) => sum + (c.errorRate || 0), 0) / mcpState.configurations.length)
          : undefined,
        timeRange: getTimeRangeLabel(timeRange)
      }} />

      <Card title="Configuration Status" style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={mcpState.configurations.map(config => ({
            ...config,
            key: config.id,
          }))}
          loading={loading || mcpState.loading}
          pagination={{
            current: mcpState.page,
            pageSize: mcpState.pageSize,
            total: mcpState.total,
            onChange: (page, pageSize) => {
              dispatch.mcp.getMCPConfigs({ page, pageSize });
            },
          }}
        />
      </Card>
    </MCPLLayout>
  );
};

export default MCPStatusPage;