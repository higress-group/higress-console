/* eslint-disable max-lines */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'ice';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  Tabs,
  Button,
  Descriptions,
  Space,
  message,
  Switch,
  Tooltip,
  Table,
  Empty,
  Modal,
} from 'antd';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getMcpServer, createOrUpdateMcpServer, deleteMcpServer, listMcpConsumers } from '@/services/mcp';
import { getGatewayDomains } from '@/services/domain';
import EditToolDrawer from './components/EditToolDrawer';
import ConsumerTable from './components/ConsumerTable';
import McpFormDrawer from './components/McpFormDrawer';
import { getServiceTypeMap, SERVICE_TYPE } from './constant';
import DeleteConfirm from './components/DeleteConfirm';
import McpServerCommand from './components/McpServerCommand';
import AddConsumerAuth from './components/AddConsumerAuth';
import YamlUtil from './components/yamlUtil';
import MonacoEditor from '@monaco-editor/react';

const MCPDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('config');
  const [mcpData, setMcpData] = useState<any>(null);
  const [apiGatewayUrl, setApiGatewayUrl] = useState('https://<higress-gateway-ip>');
  const [authEnabled, setAuthEnabled] = useState(false);
  const [tools, setTools] = useState<any[]>([]);
  const [editToolVisible, setEditToolVisible] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [httpJson, setHttpJson] = useState('');
  const [sseJson, setSseJson] = useState('');
  const [addConsumerAuthVisible, setAddConsumerAuthVisible] = useState(false);
  const consumerTableRef = useRef<any>(null);

  const fetchMcpData = async () => {
    try {
      const res = await getMcpServer(name);
      if (res) {
        setMcpData(res);
        setAuthEnabled(res.consumerAuthInfo?.enable || false);

        // 解析工具配置
        if (res.rawConfigurations) {
          try {
            const config = YamlUtil.parseYaml(res.rawConfigurations);
            setTools(config.tools || []);
          } catch (error) {
            setTools([]);
          }
        } else {
          setTools([]);
        }

        // 获取域名信息
        if (res.domains?.[0]) {
          const domainDetailInfo = await getGatewayDomains();
          const domain = domainDetailInfo.find((item: any) => item.name === res?.domains?.[0]);
          const domainProtocol = domain?.enableHttps === 'off' ? 'http' : 'https';
          setApiGatewayUrl(`${domainProtocol}://${domain?.name}`);
        } else {
          setApiGatewayUrl('https://<higress-gateway-ip>');
        }
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchMcpData();
  }, [name]);

  const handleAuthChange = async (checked: boolean) => {
    try {
      // 如果要启用认证，先检查是否已有授权消费者
      if (checked) {
        const consumers = await listMcpConsumers({ mcpServerName: name });
        if (!consumers || consumers.length === 0) {
          message.warning(t('mcp.detail.enableAuthNeedConsumer') || '启用认证前需要至少添加一个授权消费者');
          // 切换到认证标签页
          setActiveTab('auth');
          return;
        }
      }

      await createOrUpdateMcpServer({
        ...mcpData,
        mcpServerName: name,
        consumerAuthInfo: {
          enable: checked,
          type: 'API_KEY',
          allowedConsumers: mcpData.consumerAuthInfo?.allowedConsumers || [],
        },
      });
      message.success(`${t('mcp.detail.authUpdateSuccess')}`);
      setAuthEnabled(checked);
      fetchMcpData();
      // 刷新消费者列表
      consumerTableRef.current?.fetchConsumers();
    } catch (error) {
      message.error(t('mcp.detail.authUpdateError'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMcpServer(name);
      message.success(t('mcp.detail.deleteSuccess'));
      navigate('/mcp/list');
    } catch (error) {
      message.error(t('mcp.detail.deleteError'));
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
  };

  const handleEditToolSubmit = async (rawConfigurations: string) => {
    try {
      await createOrUpdateMcpServer({
        ...mcpData,
        mcpServerName: name,
        rawConfigurations,
        // securitySchemes: securitySchemes || [],
      });
      message.success(t('mcp.detail.toolUpdateSuccess'));
      setEditToolVisible(false);
      fetchMcpData();
    } catch (error) {
      message.error(t('mcp.detail.toolUpdateError'));
    }
  };

  const serviceTypeMap = getServiceTypeMap(t('mcp.form.directRouteText'));

  const handleEditSubmit = async (values: any) => {
    try {
      await createOrUpdateMcpServer({
        ...values,
        mcpServerName: name,
      });
      message.success(t('mcp.detail.updateSuccess'));
      setEditDrawerVisible(false);
      fetchMcpData();
      consumerTableRef.current?.fetchConsumers();
    } catch (error) {
      message.error(t('mcp.detail.updateError'));
    }
  };

  const generateJson = (type: 'http' | 'sse') => {
    if (type === 'http') {
      return `{
  "mcpServers": {
    "${name}": {
      "url": "${apiGatewayUrl}/mcp-servers/${name}"
    }
  }
}`;
    }
    if (type === 'sse') {
      return `{
  "mcpServers": {
    "${name}": {
      "url": "${apiGatewayUrl}/mcp-servers/${name}/sse"
    }
  }
}`;
    }
    return '{}';
  };

  useEffect(() => {
    if (apiGatewayUrl && name) {
      setHttpJson(generateJson('http'));
      setSseJson(generateJson('sse'));
    }
  }, [apiGatewayUrl, name]);

  // 复制兼容 http/https
  const handleCopy = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // 非安全上下文降级处理
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      message.success(t('mcp.detail.copySuccess'));
    } catch (e) {
      message.error(t('mcp.detail.copyError') || '复制失败，请手动复制');
    }
  };

  return (
    <PageContainer
      header={{
        title: `${t('mcp.detail.titlePrefix')}: ${name}`,
        onBack: () => navigate('/mcp/list'),
        extra: (
          <Space>
            <Button type="primary" icon={<EditOutlined />} onClick={() => setEditDrawerVisible(true)}>
              {t('mcp.detail.edit')}
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleDeleteClick}>
              {t('mcp.detail.delete')}
            </Button>
          </Space>
        ),
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'config',
            label: t('mcp.detail.basicInfo'),
            children: (
              <>
                <Card title={t('mcp.detail.basicInfo')} bordered>
                  <Descriptions column={2}>
                    <Descriptions.Item label={t('mcp.form.name')}>{mcpData?.name}</Descriptions.Item>
                    <Descriptions.Item label={t('mcp.form.description')}>
                      <span style={{ whiteSpace: 'pre-line' }}>{mcpData?.description || '-'}</span>
                    </Descriptions.Item>
                    {
                      mcpData?.domains?.length > 0 && (
                        <Descriptions.Item label={t('mcp.form.domains')}>
                          {(() => {
                            return mcpData?.domains?.map((domain: string) => (
                              <span key={domain}>{domain}</span>
                            ));
                          })()}
                        </Descriptions.Item>
                      )
                    }
                    <Descriptions.Item label={t('mcp.form.type')}>
                      {t(`${serviceTypeMap[mcpData?.type]}`)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('mcp.form.upstreamService')}>
                      {mcpData?.services?.map((service: any) => (
                        <span key={service.name}>{service.name}</span>
                      ))}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card title={t('mcp.detail.endpointInfo')} bordered style={{ marginTop: 16 }}>
                  <Descriptions column={2}>
                    <Descriptions.Item label={t('mcp.detail.sseEndpoint')}>
                      {`${apiGatewayUrl || 'https://<higress-gateway-ip>'}/mcp-servers/${name}/sse`}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('mcp.detail.httpEndpoint')}>
                      {`${apiGatewayUrl || 'https://<higress-gateway-ip>'}/mcp-servers/${name}`}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </>
            ),
          },
          {
            key: 'tools',
            label: t('mcp.detail.tools'),
            children: (
              <>
                <Card
                  title={
                    <Space>
                      <span>{t('mcp.detail.tools')}</span>
                      <span>({tools.length})</span>
                    </Space>
                  }
                  bordered
                  extra={
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setEditToolVisible(true)}
                      disabled={mcpData?.type !== SERVICE_TYPE.OPENAPI}
                    >
                      {t('mcp.detail.editTool')}
                    </Button>
                  }
                >
                  {tools.length === 0 ? (
                    <Empty description={t('mcp.detail.noTools')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                    <Table
                      dataSource={tools.map((tool, idx) => ({ ...tool, key: tool.name || idx }))}
                      columns={[
                        {
                          title: t('mcp.detail.toolName'),
                          dataIndex: 'name',
                          key: 'name',
                        },
                        {
                          title: t('mcp.detail.toolDescription'),
                          dataIndex: 'description',
                          key: 'description',
                        },
                        {
                          title: t('mcp.detail.toolParams'),
                          dataIndex: 'args',
                          key: 'args',
                          render: (args: any[]) => (
                            <>
                              {args?.length ? (
                                args.map((arg, idx) => (
                                  <div key={arg.name || idx}>
                                    <b>{arg.name}</b>: {arg.description}
                                  </div>
                                ))
                              ) : (
                                <span>{t('mcp.detail.noParam')}</span>
                              )}
                            </>
                          ),
                        },
                      ]}
                      rowKey="key"
                      pagination={false}
                    />
                  )}
                </Card>

                <Card title={t('mcp.detail.connectMcp')} bordered style={{ marginTop: 16 }}>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{t('mcp.detail.step1')}</div>
                    <Tabs
                      defaultActiveKey="sse"
                      style={{ marginTop: 16 }}
                      items={[
                        {
                          key: 'http',
                          label: t('mcp.detail.streamableHttp'),
                          children: (
                            <MonacoEditor
                              height="200px"
                              language="json"
                              theme="vs-dark"
                              value={httpJson}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                wordWrap: 'on',
                                automaticLayout: true,
                                readOnly: true,
                                scrollbar: {
                                  vertical: 'hidden',
                                  horizontal: 'hidden',
                                  handleMouseWheel: false,
                                  alwaysConsumeMouseWheel: false,
                                },
                              }}
                            />
                          ),
                        },
                        {
                          key: 'sse',
                          label: t('mcp.detail.sse'),
                          children: (
                            <MonacoEditor
                              height="200px"
                              language="json"
                              theme="vs-dark"
                              value={sseJson}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                wordWrap: 'on',
                                automaticLayout: true,
                                readOnly: true,
                                scrollbar: {
                                  vertical: 'hidden',
                                  horizontal: 'hidden',
                                  handleMouseWheel: false,
                                  alwaysConsumeMouseWheel: false,
                                },
                              }}
                            />
                          ),
                        },
                        {
                          key: 'httpCmd',
                          label: t('mcp.detail.streamableHttpCommand'),
                          children: <McpServerCommand mode="streamableHttp" config={httpJson} />,
                        },
                        {
                          key: 'sseCmd',
                          label: t('mcp.detail.sseCommand'),
                          children: <McpServerCommand mode="sse" config={sseJson} />,
                        },
                      ]}
                    />
                  </div>

                  {apiGatewayUrl !== 'https://<higress-gateway-ip>' && (
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{t('mcp.detail.step2')}</div>
                      <div style={{ background: '#f7f9fa', padding: 16, borderRadius: 4 }}>
                        <div style={{ color: '#666', marginBottom: 12 }}>{t('mcp.detail.dnsDesc')}</div>
                        <div>

                          <div style={{ marginTop: 4 }}>
                            {t('mcp.detail.gatewayAddress')}
                            <Space>
                              <span style={{ marginLeft: 15 }}>{apiGatewayUrl}</span>
                              <Button
                                type="link"
                                onClick={() => handleCopy(apiGatewayUrl)}
                              >
                                {t('mcp.detail.copy')}
                              </Button>
                            </Space>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </>
            ),
          },
          {
            key: 'resource',
            label: t('mcp.detail.resource'),
            children: <Card>{t('misc.tbd')}</Card>,
          },
          {
            key: 'prompt',
            label: t('mcp.detail.prompt'),
            children: <Card>{t('misc.tbd')}</Card>,
          },
          {
            key: 'auth',
            label: t('mcp.detail.consumerAuth'),
            children: (
              <>
                <Card title={t('mcp.detail.configInfo')} bordered>
                  <Descriptions column={2}>
                    <Descriptions.Item label={t('mcp.detail.authStatus')}>
                      <a
                        onClick={() => {
                          Modal.confirm({
                            title: t('mcp.detail.confirmAuthChange'),
                            content: authEnabled
                              ? t('mcp.detail.confirmDisableAuth')
                              : t('mcp.detail.confirmEnableAuth'),
                            onOk: () => handleAuthChange(!authEnabled),
                            okText: t('misc.confirm'),
                            cancelText: t('misc.cancel'),
                          });
                        }}
                      >
                        {authEnabled ? t('mcp.detail.enabled') : t('mcp.detail.disabled')}
                      </a>
                    </Descriptions.Item>
                    {authEnabled && (
                      <Descriptions.Item label={t('misc.authType')}>
                        <Space>
                          <span>API Key</span>
                          <Tooltip title={t('mcp.detail.apiKeyTooltip')}>
                            <QuestionCircleOutlined style={{ color: '#888' }} />
                          </Tooltip>
                        </Space>
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
                <Card title={t('mcp.detail.authorizedConsumers')} bordered style={{ marginTop: 16 }}>
                  <ConsumerTable ref={consumerTableRef} authEnabled={authEnabled}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddConsumerAuthVisible(true)}>
                      {t('mcp.detail.add')}
                    </Button>
                  </ConsumerTable>
                </Card>
              </>
            ),
          },
        ]}
      />

      <EditToolDrawer
        visible={editToolVisible}
        serviceType={mcpData?.type}
        rawConfigurations={mcpData?.rawConfigurations}
        onClose={() => setEditToolVisible(false)}
        onSubmit={handleEditToolSubmit}
      />

      <McpFormDrawer
        visible={editDrawerVisible}
        mode="edit"
        name={name}
        onClose={() => setEditDrawerVisible(false)}
        onSubmit={handleEditSubmit}
      />

      <DeleteConfirm
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
        recordName={name}
        i18nKey="mcp.deleteConfirm"
      />

      <AddConsumerAuth
        visible={addConsumerAuthVisible}
        onClose={() => setAddConsumerAuthVisible(false)}
        onSuccess={() => {
          fetchMcpData();
          consumerTableRef.current?.fetchConsumers();
        }}
        mcpName={name}
        strategyConfigId={mcpData?.consumerAuthInfo?.strategyConfigId}
      />
    </PageContainer>
  );
};

export default MCPDetailPage;
