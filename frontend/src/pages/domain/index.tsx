/* eslint-disable */
// @ts-nocheck
import { DEFAULT_DOMAIN, Domain, DomainResponse, EnableHttpsValue, Protocol } from '@/interfaces/domain';
import {
  addGatewayDomain,
  deleteGatewayDomain,
  getGatewayDomains,
  updateGatewayDomain,
  getWasmPlugins,
  getDomainPluginInstances
} from '@/services';
import { ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, Drawer, Form, message, Modal, Row, Space, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import DomainForm from './components/DomainForm';
import { history } from 'ice';
import { getI18nValue } from "@/pages/plugin/utils";
import i18n from '@/i18n';
import { WasmPluginData } from "@/interfaces/wasm-plugin";


interface DomainFormProps {
  name: string;
  protocol: string;
  certIdentifier?: string;
  mustHttps?: any[];
}

const DomainList: React.FC = () => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('domain.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (_, record) => {
        return record.name === DEFAULT_DOMAIN ? t('domain.defaultDomain') : record.name;
      },
    },
    {
      title: t('domain.columns.protocol'),
      dataIndex: 'protocol',
      key: 'protocol',
    },
    {
      title: t('domain.columns.certificate'),
      dataIndex: 'certIdentifier',
      key: 'certIdentifier',
      render: (value) => value || '-',
    },
    {
      title: t('misc.actions'),
      dataIndex: 'action',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => {
        const isDefaultDomain = record.name === DEFAULT_DOMAIN;
        return (
          <Space size="small">
            {isDefaultDomain || (<a onClick={() => onEditConfig(record)}>{t('misc.strategy')}</a>)}
            <a onClick={() => onEditDrawer(record)}>{t('misc.edit')}</a>
            {isDefaultDomain || (<a onClick={() => onShowModal(record)}>{t('misc.delete')}</a>)}
          </Space>
        )
      },
    },
  ];

  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [dataSource, setDataSource] = useState<Domain[]>([]);
  const [currentDomain, setCurrentDomain] = useState<Domain | null>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [pluginData, setPluginsData] = useState<Record<string, WasmPluginData[]>>({});
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [pluginInfoList, setPluginInfoList] = useState<WasmPluginData[]>([]);
  const { loading: wasmLoading, run: loadWasmPlugins } = useRequest(() => {
    return getWasmPlugins(i18n.language)
  }, {
    manual: true,
    onSuccess: (result = []) => {
      let plugins = result || [];
      setPluginInfoList(plugins);
    },
  });

  const getDomainList = async (factor): Promise<DomainResponse> => getGatewayDomains(factor);
  const { loading, run, refresh } = useRequest(getDomainList, {
    manual: true,
    onSuccess: (result: Domain[], params) => {
      const _dataSource = result || [];

      const defaultDomain: Domain = {
        id: DEFAULT_DOMAIN,
        name: DEFAULT_DOMAIN,
        enableHttps: EnableHttpsValue.off,
      };
      for (let i = 0; i < _dataSource.length; ++i) {
        if (_dataSource[i].name === DEFAULT_DOMAIN) {
          Object.assign(defaultDomain, _dataSource[i]);
          _dataSource.splice(i, 1);
          break;
        }
      }
      _dataSource.splice(0, 0, defaultDomain);

      _dataSource.forEach((i) => {
        i.key || (i.key = i.id || i.name);
        i.mustHttps = [];
        switch (i.enableHttps) {
          case EnableHttpsValue.off:
            i.protocol = Protocol.http;
            break;
          case EnableHttpsValue.on:
            i.protocol = Protocol.https;
            break;
          case EnableHttpsValue.force:
            i.protocol = Protocol.https;
            i.mustHttps = [true];
            break;
        }
      });
      setDataSource(_dataSource);
    },
  });

  useEffect(() => {
    run({});
    loadWasmPlugins();
  }, []);

  i18n.on('languageChanged', () => {
    loadWasmPlugins();
  });

  const onEditConfig = (domain) => {
    history?.push(`/domain/config?name=${domain.name}&type=domain`);
  };

  const onEditDrawer = (domain: Domain) => {
    setCurrentDomain(domain);
    setOpenDrawer(true);
  };

  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentDomain(null);
  };

  const onShowStrategyList = async (record: Domain, expanded: boolean) => {
    if (expanded) {
      try {
        const plugins = await getDomainPluginInstances(record.name);
        const pluginInfos = plugins.map((plugin: { pluginName: string; description: string; }) => {
          const isMatchingInfo = (info: WasmPluginData) => info.name === plugin.pluginName;
          const pluginInfo = pluginInfoList.find(isMatchingInfo);
          const title = pluginInfo?.title ?? plugin.pluginName ?? '';
          const description = pluginInfo?.description ?? plugin.description ?? '';
          return {
            ...plugin,
            title,
            description,
          };
        })
        setPluginsData((prev) => ({
          ...prev,
          [record.name]: pluginInfos,
        }));
        if (plugins.some((plugin: { enabled: boolean; }) => plugin.enabled)) {
          setExpandedKeys((prev) => [...prev, record.name]);
        }
      } catch (error) {
        message.error('Failed to fetch strategies, error:', error);
        setExpandedKeys((prev) => prev.filter((key) => key !== record.name));
      }
    } else {
      setExpandedKeys((prev) =>
        prev.filter((key) => key !== record.name));
    }
  };

  const handleDrawerOK = async () => {
    try {
      const values: DomainFormProps = formRef.current && (await formRef.current.handleSubmit());
      const { name, certIdentifier } = values;
      const data = { name: name || currentDomain?.name };
      let enableHttps = EnableHttpsValue.off;
      if (values.protocol === Protocol.https) {
        if (values.certIdentifier) {
          Object.assign(data, { certIdentifier });
        }
        enableHttps = values.mustHttps?.length ? EnableHttpsValue.force : EnableHttpsValue.on;
      }
      Object.assign(data, { enableHttps });
      if (currentDomain?.version) {
        await updateGatewayDomain({ version: currentDomain.version, ...data } as Domain);
      } else {
        await addGatewayDomain(data as Domain);
      }
      setOpenDrawer(false);
      refresh();
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const handleDrawerCancel = () => {
    setOpenDrawer(false);
    setCurrentDomain(null);
  };

  const onShowModal = (domain: Domain) => {
    setCurrentDomain(domain);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    if (!currentDomain) {
      return;
    }
    setConfirmLoading(true);
    await deleteGatewayDomain(currentDomain.name);
    setConfirmLoading(false);
    setOpenModal(false);
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
            <Button type="primary" onClick={onShowDrawer}>
              {t('domain.createDomain')}
            </Button>
          </Col>
          <Col span={20} style={{ textAlign: 'right' }}>
            <Button icon={<RedoOutlined />} onClick={refresh} />
          </Col>
        </Row>
      </Form>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpand: async (expanded, record) => {
            if (expanded) {
              setExpandedKeys([...expandedKeys, record.name]);
            } else {
              setExpandedKeys(expandedKeys.filter(key => key !== record.name));
            }
            await onShowStrategyList(record, expanded);
          },
          rowExpandable: (record) => {
            return record.name !== DEFAULT_DOMAIN;
          },
          expandedRowRender: (record) => {
            const plugins = (pluginData[record.name] || []).filter(plugin => plugin.enabled);
            return (
              <Table
                dataSource={plugins}
                columns={[
                  {
                    title: t('plugins.title'),
                    render: (_, plugin) => {
                      return getI18nValue(plugin, 'title');
                    },
                    key: 'title'
                  },
                  {
                    title: t('plugins.description'),
                    render: (_, plugin) => {
                      return getI18nValue(plugin, 'description');
                    },
                    key: 'description'
                  },
                ]}
                pagination={false}
                rowKey={(plugin) => `${plugin.name}`}
              />
            );
          },
        }}
      />
      <Modal
        title={
          <div>
            <ExclamationCircleOutlined style={{ color: '#ffde5c', marginRight: 8 }} />
            {t('misc.delete')}
          </div>
        }
        open={openModal}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
      >
        <p>
          <Trans t={t} i18nKey="domain.deleteConfirmation">
            确定删除
            <span style={{ color: '#0070cc' }}>
              {{ currentDomainName: (currentDomain && currentDomain.name) || '' }}
            </span>
            吗？
          </Trans>
        </p>
      </Modal>
      <Drawer
        title={t(currentDomain ? 'domain.editDomain' : 'domain.createDomain')}
        placement="right"
        width={660}
        onClose={handleDrawerCancel}
        open={openDrawer}
        destroyOnClose={true}
        extra={
          <Space>
            <Button onClick={handleDrawerCancel}>{t('misc.cancel')}</Button>
            <Button type="primary" onClick={handleDrawerOK}>
              {t('misc.confirm')}
            </Button>
          </Space>
        }
      >
        <DomainForm ref={formRef} value={currentDomain} />
      </Drawer>
    </PageContainer>
  );
};

export default DomainList;
