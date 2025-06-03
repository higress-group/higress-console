import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, SyncOutlined, WarningOutlined, CalendarOutlined } from '@ant-design/icons';

interface MCPStats {
  totalConfigs: number;
  activeConfigs: number;
  lastSyncTime: string;
  successRate?: number;
  errorRate?: number;
  timeRange?: string;
}

const MCPStatusCard: React.FC<{ stats: MCPStats }> = ({ stats }) => {
  // Handle undefined values
  const hasSuccessRate = stats.successRate !== undefined && !isNaN(stats.successRate);
  const hasErrorRate = stats.errorRate !== undefined && !isNaN(stats.errorRate);
  const hasTimeRange = stats.timeRange !== undefined;
  
  const successRate = hasSuccessRate ? stats.successRate : 0;
  const errorRate = hasErrorRate ? stats.errorRate : 100 - successRate;
  const showRates = hasSuccessRate || hasErrorRate;
  
  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>MCP Server Status</span>
          {hasTimeRange && (
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              <CalendarOutlined style={{ marginRight: 4 }} />
              {stats.timeRange}
            </div>
          )}
        </div>
      }
    >
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Statistic
            title="Total Configurations"
            value={stats.totalConfigs}
            prefix={<ClockCircleOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Active Configurations"
            value={stats.activeConfigs}
            prefix={<CheckCircleOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Last Sync Time"
            value={stats.lastSyncTime}
            prefix={<SyncOutlined />}
          />
        </Col>
        
        {showRates && (
          <>
            <Col span={12}>
              <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 8 }}>Success Rate: {successRate}%</div>
                <Progress percent={successRate} status="active" />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 8 }}>Error Rate: {errorRate}%</div>
                <Progress 
                  percent={errorRate} 
                  status={errorRate > 0 ? "exception" : "active"}
                  strokeColor={errorRate > 0 ? "#ff4d4f" : undefined}
                />
              </div>
            </Col>
          </>
        )}
        
        {!hasSuccessRate && !hasErrorRate && (
          <Col span={24}>
            <div style={{ marginTop: 16, color: '#faad14', display: 'flex', alignItems: 'center' }}>
              <WarningOutlined style={{ fontSize: 20, marginRight: 8 }} />
              <span>No performance data available yet. Refresh to get the latest status information.</span>
            </div>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default MCPStatusCard;