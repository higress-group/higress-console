/* eslint-disable */
// @ts-nocheck
import { Mode } from '@/interfaces/config';
import { ProxyServer, ProxyServerTypes, DEFAULT_CONNECT_TIMEOUT } from '@/interfaces/proxy-server';
import { ServiceProtocols, ServiceSource, ServiceSourceFormProps, ServiceSourceTypes  } from '@/interfaces/service-source';
import { addProxyServer, getProxyServers, deleteProxyServer as doDeleteProxyServer, updateProxyServer } from '@/services/proxy-server';
import { addServiceSource, deleteServiceSource, getServiceSources, updateServiceSource } from '@/services/service-source';
import store from '@/store';
import { isInternalResource } from '@/utils';
import { ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, Drawer, Form, Input, InputNumber, Tabs, Modal, Popconfirm, Row, Select, Space, Table, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import SourceForm from './components/SourceForm';

const { Option } = Select;
const { Text, Link } = Typography;

interface SourceFormRef {
  reset: () => void;
  handleSubmit: () => Promise<ServiceSourceFormProps>;
}

const SourceList: React.FC = () => {
  const { t } = useTranslation();
  const columns = [
    {
      title: t('serviceSource.columns.type'),
      dataIndex: 'type',
      key: 'type',
      render: (value) => {
        const type = ServiceSourceTypes[value];
        return (
          <span>{type ? (type.i18n ? t(type.name) : type.name) : value}</span>
        );
      },
    },
    {
      title: t('serviceSource.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: t('serviceSource.columns.domain'),
      dataIndex: 'domain',
      key: 'domain',
      render: (value) => {
        return value != null ? value : '-';
      },
    },
    {
      title: t('serviceSource.columns.port'),
      dataIndex: 'port',
      key: 'port',
      render: (value, record) => {
        return value != null ? value : '-';
      },
    },
    {
      title: t('serviceSource.columns.protocol'),
      dataIndex: 'protocol',
      key: 'protocol',
      render: (value, record) => {
        if (!value) {
          return '-';
        }
        const protocol = ServiceProtocols[value];
        return protocol ? protocol.name : value;
      },
    },
    {
      title: t('serviceSource.columns.proxyName'),
      dataIndex: 'proxyName',
      key: 'proxyName',
      render: (value, record) => {
        return value || '-';
      },
    },
    {
      title: t('serviceSource.columns.action'),
      dataIndex: 'action',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => record.internal || record.builtIn ? null : (
        <Space size="small">
          <a onClick={() => onEditDrawer(record)}>{t('misc.edit')}</a>
          <a onClick={() => onShowModal(record)}>{t('misc.delete')}</a>
        </Space>
      ),
    },
  ];

  const proxyServerColumns = [
    {
      title: t('serviceSource.proxyServerModal.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: t('serviceSource.proxyServerModal.server'),
      key: 'server',
      render: (_, record) => `${record.serverAddress}:${record.serverPort}`,
    },
    {
      title: t('serviceSource.columns.action'),
      dataIndex: 'action',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => record.internal || record.builtIn ? null : (
        <Space size="small">
          <a onClick={() => editProxyServer(record)}>{t('misc.edit')}</a>
          <Popconfirm
            title={t('serviceSource.proxyServerModal.deleteConfirmation')}
            onConfirm={() => {
              deleteProxyServer(record.name);
            }}
          >
            <a onClick={null}>{t('misc.delete')}</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [form] = Form.useForm();
  const formRef = useRef<SourceFormRef>(null);
  const [dataSource, setDataSource] = useState<ServiceSource[]>([]);
  const [currentServiceSource, setCurrentServiceSource] = useState<ServiceSource>({} as ServiceSource);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [mode, setMode] = useState<string>(Mode.K8S);

  const [proxyServers, setProxyServers] = useState<ProxyServer[]>([]);
  const [changesMadeInProxyServerModal, setChangesMadeInProxyServerModal] = useState(false);
  const [proxyServerModalVisible, setProxyServerModalVisible] = useState(false);
  const [currentProxyServer, setCurrentProxyServer] = useState<ProxyServer | null>(null);
  const [savingProxyServer, setSavingProxyServer] = useState(false);
  const [proxyServerForm] = Form.useForm();

  const { loading, run, refresh } = useRequest(getServiceSources, {
    manual: true,
    onSuccess: (result, params) => {
      const sources = (result || []) as ServiceSource[];
      if (mode === Mode.K8S) {
        sources.push({
          name: 'default',
          type: 'Kubernetes',
          builtIn: true,
        });
      }
      sources.forEach(i => {
        i.key || (i.key = i.name + '_' + i.type);
        i.internal = isInternalResource(i.name);
      });
      sources.sort((i1, i2) => {
        if (i1.internal !== i2.internal) {
          return i1.internal ? 1 : -1
        }
        return i1.name.localeCompare(i2.name);
      })
      setDataSource(sources);
    },
  });
  const { loading: loadingProxyServers, refresh: reloadProxyServers, refreshAsync: reloadProxyServersAsync } = useRequest(getProxyServers, {
    manual: true,
    onSuccess: (result, params) => {
      const servers = (result || []) as ProxyServer[];
      servers.forEach(i => i.key || (i.key = i.name));
      servers.sort((i1, i2) => {
        return i1.name.localeCompare(i2.name);
      });
      setProxyServers(servers);
    },
  });

  const [configModel] = store.useModel('config');
  useEffect(() => {
    const properties = configModel ? configModel.properties : {};
    setMode(properties.mode || Mode.K8S);
    run({});
  }, [configModel]);

  const onEditDrawer = (domain: ServiceSource) => {
    setCurrentServiceSource(domain);
    setOpenDrawer(true);
  };

  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentServiceSource(null);
  };

  const handleDrawerOK = async () => {
    try {
      const values: ServiceSourceFormProps = formRef.current ? await formRef.current.handleSubmit() : {} as ServiceSourceFormProps;

      if (currentServiceSource) {
        await updateServiceSource({ version: currentServiceSource.version, ...values } as ServiceSource);
      } else {
        await addServiceSource(values as ServiceSource);
      }

      setOpenDrawer(false);
      formRef.current && formRef.current.reset();
      refresh();
    } catch (errInfo) {
      console.log('Save failed: ', errInfo);
    }
  };

  const handleDrawerCancel = () => {
    setOpenDrawer(false);
    formRef.current && formRef.current.reset();
    setCurrentServiceSource(null);
  };

  const onShowModal = (domain: ServiceSource) => {
    setCurrentServiceSource(domain);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    setConfirmLoading(true);
    await deleteServiceSource(currentServiceSource.name);
    setConfirmLoading(false);
    setOpenModal(false);
    setCurrentServiceSource(null);
    // 重新刷新
    refresh();
  };

  const handleModalCancel = () => {
    setOpenModal(false);
    setCurrentServiceSource(null);
  };

  const openProxyServerModal = () => {
    setCurrentProxyServer(null);
    setChangesMadeInProxyServerModal(false);
    reloadProxyServersAsync().then(() => {
      setProxyServerModalVisible(true);
    });
  };

  const closeProxyServerModal = () => {
    setCurrentProxyServer(null);
    setProxyServerModalVisible(false);
    if (changesMadeInProxyServerModal) {
      refresh();
      setChangesMadeInProxyServerModal(false);
    }
  };

  const createProxyServer = () => {
    initProxyServerForm(null);
  };

  const editProxyServer = (proxyServer: ProxyServer) => {
    initProxyServerForm(proxyServer);
  };

  const deleteProxyServer = (name: string) => {
    if (!name) {
      return;
    }
    doDeleteProxyServer(name).then(() => {
      reloadProxyServers();
      setChangesMadeInProxyServerModal(true);
    });
  };

  const initProxyServerForm = (proxyServer: ProxyServer) => {
    if (!proxyServer) {
      proxyServer = {} as ProxyServer;
      proxyServer.new = true;
    }
    setCurrentProxyServer(proxyServer);
    proxyServerForm.resetFields();
    const values = { ...proxyServer };
    values.type = values.type || ProxyServerTypes.http.key;
    values.connectTimeout = values.connectTimeout || DEFAULT_CONNECT_TIMEOUT;
    proxyServerForm.setFieldsValue(values);
  };

  const saveProxyServer = async () => {
    const values = await proxyServerForm.validateFields();
    setSavingProxyServer(true);
    try {
      if (currentProxyServer && currentProxyServer.new) {
        await addProxyServer(values as ProxyServer);
      } else {
        await updateProxyServer({ version: currentProxyServer.version, ...values } as ProxyServer);
      }
      setChangesMadeInProxyServerModal(true)
      reloadProxyServers();
      finishProxyServerEditing();
    } finally {
      setSavingProxyServer(false);
    }
  };

  const finishProxyServerEditing = () => {
    setCurrentProxyServer(null);
    setChangesMadeInProxyServerModal(true);
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
          <Col span={12}>
            <Button
              type="primary"
              onClick={onShowDrawer}
            >
              {t('serviceSource.createServiceSource')}
            </Button>
            <Button
              type="primary"
              onClick={openProxyServerModal}
              disabled={loadingProxyServers}
              style={{ marginLeft: 8 }}
            >
              {t('serviceSource.manageProxyServers')}
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
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
        title={t(currentServiceSource ? "serviceSource.editServiceSource" : "serviceSource.createServiceSource")}
        placement="right"
        width={660}
        onClose={handleDrawerCancel}
        open={openDrawer}
        extra={
          <Space>
            <Button onClick={handleDrawerCancel}>{t('misc.cancel')}</Button>
            <Button type="primary" onClick={handleDrawerOK}>
              {t('misc.confirm')}
            </Button>
          </Space>
        }
      >
        <SourceForm ref={formRef} value={currentServiceSource} />
      </Drawer>
      <Modal
        title={<div><ExclamationCircleOutlined style={{ color: '#ffde5c', marginRight: 8 }} />{t('misc.delete')}</div>}
        open={openModal}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
        cancelText={t('misc.cancel')}
        okText={t('misc.confirm')}
      >
        <p>
          <Trans t={t} i18nKey="serviceSource.deleteConfirmation">
            确定删除 <span style={{ color: '#0070cc' }}>{{ currentServiceSourceName: (currentServiceSource && currentServiceSource.name) || '' }}</span> 吗？
          </Trans>
        </p>
      </Modal>
      <Modal
        title={t("serviceSource.manageProxyServers")}
        open={proxyServerModalVisible}
        onOk={closeProxyServerModal}
        onCancel={closeProxyServerModal}
        width={800}
        footer={null}
      >
        <div
          style={{
            background: '#fff',
            marginBottom: 8,
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Button
                type="primary"
                onClick={createProxyServer}
              >
                {t('serviceSource.proxyServerModal.createProxyServer')}
              </Button>
            </Col>
          </Row>
        </div>
        <Table
          dataSource={proxyServers}
          columns={proxyServerColumns}
          pagination={true}
        />
        {
          currentProxyServer && (
            <Tabs
              defaultActiveKey="1"
              centered
              items={[
                {
                  label: `${t(currentProxyServer.new ? 'serviceSource.proxyServerModal.createProxyServer' : 'serviceSource.proxyServerModal.editProxyServer')}`,
                  key: "proxy-edit",
                  children: (
                    <Form
                      form={proxyServerForm}
                      layout="vertical"
                    >
                      <Form.Item
                        label={t('serviceSource.proxyServerModal.name')}
                        name="name"
                        rules={[
                          {
                            required: true,
                            pattern: /^[a-z][a-z0-9-_\.]{0,62}$/,
                            message: t('serviceSource.proxyServerModal.nameRequired') || '',
                          },
                        ]}
                      >
                        <Input
                          allowClear={true}
                          disabled={!currentProxyServer.new}
                          maxLength={63}
                          placeholder={t('serviceSource.proxyServerModal.namePlaceholder') || ''}
                        />
                      </Form.Item>
                      <Form.Item
                        label={t('serviceSource.proxyServerModal.type')}
                        required
                        name="type"
                      >
                        <Select
                          allowClear
                        >
                          {
                            // eslint-disable-next-line @iceworks/best-practices/recommend-polyfill
                            Object.entries(ProxyServerTypes).map(([k, v]) =>
                              v.enabled && (<Option key={v.key} value={v.key}>{v.i18n ? t(v.name) : v.name}</Option>))
                          }
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label={t('serviceSource.proxyServerModal.serverAddress')}
                        required
                        name="serverAddress"
                        rules={[
                          {
                            required: true,
                            pattern: /^(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})$/,
                            message: t('serviceSource.proxyServerModal.serverAddressRequired') || '',
                          },
                        ]}
                      >
                        <Input
                          allowClear
                          maxLength="256"
                        />
                      </Form.Item>
                      <Form.Item
                        label={t('serviceSource.proxyServerModal.serverPort')}
                        name="serverPort"
                        rules={[
                          {
                            required: true,
                            message: t('serviceSource.proxyServerModal.serverPortRequired') || '',
                          },
                        ]}
                      >
                        <InputNumber min={1} max={65535} />
                      </Form.Item>
                      <Form.Item
                        label={t('serviceSource.proxyServerModal.connectTimeout')}
                        name="connectTimeout"
                        rules={[
                          {
                            required: true,
                            message: t('serviceSource.proxyServerModal.connectTimeoutRequired') || '',
                          },
                        ]}
                      >
                        <InputNumber min={1} max={65535} addonAfter="ms" defaultValue={5000} />
                      </Form.Item>
                      <Form.Item>
                        <Space>
                          <Button type="primary" onClick={() => saveProxyServer()}>{t('misc.save')}</Button>
                          <Button onClick={() => finishProxyServerEditing()}>{t('misc.cancel')}</Button>
                        </Space>
                      </Form.Item>
                    </Form>
                  ),
                }
              ]}
            />
          )
        }
      </Modal>
    </PageContainer>
  );
};

export default SourceList;
