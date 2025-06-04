import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, Space, Tabs, message, Switch } from 'antd';
import { SaveOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'ice';
import store from '@/store';

const { Option } = Select;

interface EditMCPPageProps {
  editing?: boolean;
}

const [mcpState, mcpDispatchers] = store.useModel('mcp');

const RESTSourceForm: React.FC<{ form: any }> = ({ form }) => (
  <>
    <Form.Item label="URL" name={['config', 'url']} rules={[{ required: true, type: 'url' }]}>
      <Input />
    </Form.Item>
    <Form.Item label="Method" name={['config', 'method']} rules={[{ required: true }]}>
      <Select>
        <Option value="GET">GET</Option>
        <Option value="POST">POST</Option>
        <Option value="PUT">PUT</Option>
        <Option value="DELETE">DELETE</Option>
      </Select>
    </Form.Item>
    <Form.Item label="Headers" name={['config', 'headers']} rules={[{ type: 'object' }]}>
      <Input.TextArea rows={3} placeholder='{"Content-Type": "application/json"}' />
    </Form.Item>
    <Form.Item label="Query Parameters" name={['config', 'queryParams']} rules={[{ type: 'object' }]}>
      <Input.TextArea rows={3} placeholder='{"param1": "value1"}' />
    </Form.Item>
    <Form.Item label="Request Template" name={['config', 'bodyTemplate']}>
      <Input.TextArea rows={4} placeholder='{"query": "{{input}}"}' />
    </Form.Item>
    <Form.Item label="Response Template" name={['config', 'responseTemplate']}>
      <Input.TextArea rows={4} placeholder='{"result": "{{data.result}}"}' />
    </Form.Item>
  </>
);

const DBSourceForm: React.FC<{ form: any }> = ({ form }) => (
  <>
    <Card title="Database Connection">
      <Form.Item label="Type" name={['config', 'connection', 'type']} rules={[{ required: true }]}>
        <Select>
          <Option value="mysql">MySQL</Option>
          <Option value="postgres">PostgreSQL</Option>
          <Option value="sqlite">SQLite</Option>
          <Option value="mssql">MSSQL</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Host" name={['config', 'connection', 'host']} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Port" name={['config', 'connection', 'port']} rules={[{ required: true, type: 'number' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Database" name={['config', 'connection', 'database']} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Username" name={['config', 'connection', 'username']}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name={['config', 'connection', 'password']}>
        <Input.Password />
      </Form.Item>
    </Card>

    <Card title="Query Configuration" style={{ marginTop: 16 }}>
      <Form.Item label="SQL Query" name={['config', 'query']} rules={[{ required: true }]}>
        <Input.TextArea rows={4} placeholder="SELECT * FROM table WHERE condition = {{param}}" />
      </Form.Item>
      <Form.Item label="Parameters Mapping" name={['config', 'parameters']} rules={[{ type: 'object' }]}>
        <Input.TextArea rows={3} placeholder='{"param": "value"}' />
      </Form.Item>
      <Form.Item label="Result Mapping" name={['config', 'resultMapping']} rules={[{ type: 'object' }]}>
        <Input.TextArea rows={3} placeholder='{"result": "column_name"}' />
      </Form.Item>
    </Card>
  </>
);

const InternalSourceForm: React.FC<{ form: any }> = ({ form }) => (
  <>
    <Form.Item label="Service Name" name={['config', 'serviceName']} rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Card title="Authentication">
      <Form.Item label="Auth Type" name={['config', 'authConfig', 'type']} rules={[{ required: true }]}>
        <Select>
          <Option value="API_KEY">API Key</Option>
          <Option value="OAUTH2">OAuth2</Option>
          <Option value="JWT">JWT</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Auth Value" name={['config', 'authConfig', 'value']} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </Card>

    <Card title="Allowed Tools" style={{ marginTop: 16 }}>
      <Form.Item label="Tools" name={['config', 'allowedTools']} rules={[{ required: true }]}>
        <Select mode="tags" style={{ width: '100%' }} placeholder="Enter tool names">
          {/* This would be populated with available tools */}
        </Select>
      </Form.Item>
    </Card>
  </>
);

const EditMCPPage: React.FC<EditMCPPageProps> = ({ editing = false }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(id);
  const isEditing = editing || !!id;

  useEffect(() => {
    if (id && mcpState.configurations.length > 0) {
      const configToEdit = mcpState.configurations.find((c) => c.id === id);
      if (configToEdit) {
        form.setFieldsValue(configToEdit);
      }
    }
  }, [id, mcpState.configurations]);

  const handleSourceTypeChange = (value) => {
    // Reset config when source type changes
    form.setFieldValue(['config'], {});
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // This would be replaced with actual API calls
      setTimeout(() => {
        if (isEditing) {
          // Update existing configuration
          mcpDispatchers.updateState({
            configurations: mcpState.configurations.map((config) =>
              (config.id === currentId ? { ...config, ...values } : config)),
          });
          message.success('Configuration updated successfully');
        } else {
          // Create new configuration
          const newConfig = {
            ...values,
            id: `mcp-${Date.now()}`,
            enabled: true,
          };
          mcpDispatchers.updateState({
            configurations: [...mcpState.configurations, newConfig],
          });
          message.success('Configuration created successfully');
        }
        navigate('/mcp/list');
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error(`Failed to save configuration`);
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <Button type="link" icon={<LeftOutlined />} onClick={() => navigate('/mcp/list')}>
            Back
          </Button>
          <span>{isEditing ? 'Edit' : 'Create'} MCP Configuration</span>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ sourceType: 'REST' }}>
        <Card title="Basic Information">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Source Type" name="sourceType" rules={[{ required: true }]}>
            <Select onChange={handleSourceTypeChange}>
              <Option value="REST">REST API</Option>
              <Option value="DB">Database</Option>
              <Option value="INTERNAL">Internal Service</Option>
            </Select>
          </Form.Item>
        </Card>

        <Tabs defaultActiveKey="1" style={{ marginTop: 16 }}>
          <Tabs.TabPane tab="Configuration" key="1">
            <Form.Item noStyle shouldUpdate>
              {() => {
                const sourceType = form.getFieldValue('sourceType');
                return (
                  <div>
                    {sourceType === 'REST' && <RESTSourceForm form={form} />}
                    {sourceType === 'DB' && <DBSourceForm form={form} />}
                    {sourceType === 'INTERNAL' && <InternalSourceForm form={form} />}
                  </div>
                );
              }}
            </Form.Item>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Advanced" key="2" disabled={!isEditing}>
            <Card title="Performance Monitoring">
              <Form.Item
                label="Success Rate Threshold"
                name="successRateThreshold"
                rules={[{ type: 'number', min: 0, max: 100 }]}
              >
                <Input suffix="%" />
              </Form.Item>
              <Form.Item label="Alert Recipients" name="alertRecipients">
                <Select mode="tags" style={{ width: '100%' }} placeholder="Enter email addresses">
                  {/* This would be populated with available contacts */}
                </Select>
              </Form.Item>
              <Form.Item label="Retry Policy" name="retryPolicy">
                <Select>
                  <Option value="none">No retries</Option>
                  <Option value="linear">Linear Retry</Option>
                  <Option value="exponential">Exponential Backoff</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Max Retries" name="maxRetries" rules={[{ type: 'integer', min: 0, max: 10 }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Timeout (ms)" name="timeout" rules={[{ type: 'integer', min: 1000, max: 30000 }]}>
                <Input />
              </Form.Item>
            </Card>

            <Card title="Caching Settings" style={{ marginTop: 16 }}>
              <Form.Item label="Enable Caching" name="enableCaching" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item
                label="Cache Duration"
                name="cacheDuration"
                rules={[{ type: 'integer', min: 1, max: 86400 }]}
                help="Duration in seconds (1-86400)"
              >
                <Input />
              </Form.Item>
              <Form.Item label="Cache Key Template" name="cacheKeyTemplate">
                <Input.TextArea rows={2} placeholder='{"key": "{{input}}"}' />
              </Form.Item>
            </Card>
          </Tabs.TabPane>
        </Tabs>

        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
            Save Configuration
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default EditMCPPage;
