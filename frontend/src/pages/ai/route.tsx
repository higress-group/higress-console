import { AiRoute, AiUpstream } from '@/interfaces/ai-route';
import { addAiRoute, deleteAiRoute, getAiRoutes, updateAiRoute } from '@/services/ai-route';
import { ArrowRightOutlined, ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, Drawer, Form, Modal, Row, Space, Table } from 'antd';
import { history } from 'ice';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import RouteForm from './components/RouteForm';

interface FormRef {
  reset: () => void;
  handleSubmit: () => Promise<FormProps>;
}

const AiRouteList: React.FC = () => {
  const { t } = useTranslation();
  const columns = [
    {
      title: t('aiRoute.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: t('aiRoute.columns.domains'),
      dataIndex: 'domains',
      key: 'domains',
      render: (value) => {
        if (!Array.isArray(value) || !value.length) {
          return '-';
        }
        return value.map((token) => <span>{token}</span>).reduce((prev, curr) => [prev, <br />, curr]);
      },
    },
    {
      title: t('aiRoute.columns.upstreams'),
      dataIndex: 'upstreams',
      key: 'upstreams',
      render: (value: AiUpstream[], record: AiRoute) => {
        if (!Array.isArray(value) || !value.length) {
          return '-';
        }
        const elements: any[] = [];
        if (value.length === 1) {
          elements.push(value[0].provider);
        } else {
          value.forEach(upstream => {
            elements.push(`${upstream.provider}: ${upstream.weight}%`);
          });
        }
        if (record.fallbackUpstream?.provider) {
          elements.push((
            <>
              <ArrowRightOutlined style={{ marginRight: '5px' }} />
              {record.fallbackUpstream.provider}
            </>
          ))
        }
        return elements.map((ele) => <span>{ele}</span>).reduce((prev, curr) => [prev, <br />, curr]);
      },
    },
    {
      title: t('aiRoute.columns.auth'),
      dataIndex: ['authConfig', 'allowedConsumers'],
      key: 'authConfig.allowedConsumers',
      render: (value, record) => {
        const { authConfig } = record;
        if (!authConfig || !authConfig.enabled) {
          return t('aiRoute.authNotEnabled')
        }
        if (!Array.isArray(value) || !value.length) {
          return t('aiRoute.authEnabledWithoutConsumer')
        }
        return value.map((consumer) => <span>{consumer}</span>).reduce((prev, curr) => [prev, <br />, curr]);
      },
    },
    {
      title: t('misc.actions'),
      dataIndex: 'action',
      key: 'action',
      width: 240,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => onUsageDrawer(record)}>{t('aiRoute.usage')}</a>
          <a onClick={() => onEditConfig(record)}>{t('misc.strategy')}</a>
          <a onClick={() => onEditDrawer(record)}>{t('misc.edit')}</a>
          <a onClick={() => onShowModal(record)}>{t('misc.delete')}</a>
        </Space>
      ),
    },
  ];

  const [form] = Form.useForm();
  const formRef = useRef<FormRef>(null);
  const [dataSource, setDataSource] = useState<AiRoute[]>([]);
  const [currentAiRoute, setCurrentAiRoute] = useState<AiRoute>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [loadingapi, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [usageDrawer, setUsageDrawer] = useState(false)
  const [usageCommand, setUsageCommand] = useState('')

  const { loading, run, refresh } = useRequest(getAiRoutes, {
    manual: true,
    onSuccess: (result) => {
      const aiRoutes = (result || []) as AiRoute[];
      aiRoutes.sort((i1, i2) => {
        return i1.name.localeCompare(i2.name);
      })
      setDataSource(aiRoutes);
    },
  });

  useEffect(() => {
    run();
  }, []);

  const buildUsageCommand = (aiRoute: AiRoute): string => {
    let command = `curl -sv http://<higress-gateway-ip>/v1/chat/completions \\
    -X POST \\
    -H 'Content-Type: application/json'`;
    if (aiRoute.domains && aiRoute.domains.length) {
      command += ` \\
    -H 'Host: ${aiRoute.domains[0]}'`;
    }
    command += ` \\
    -d \\
'{
  "model": "<model-name>",
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    }
  ]
}'`;
    return command;
  };

  const onUsageDrawer = (aiRoute: AiRoute) => {
    setUsageCommand(buildUsageCommand(aiRoute));
    setUsageDrawer(true);
  };

  const closeUsage = () => {
    setUsageCommand(null);
    setUsageDrawer(false);
  }

  const onEditConfig = (aiRoute: AiRoute) => {
    history?.push(`/ai/route/config?type=aiRoute&name=${aiRoute.name}`);
  };

  const onEditDrawer = (aiRoute: AiRoute) => {
    setCurrentAiRoute(aiRoute);
    setOpenDrawer(true);
  };

  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentAiRoute(null);
  };

  const handleDrawerOK = async () => {
    setLoading(true);
    try {
      const values = formRef.current ? await formRef.current.handleSubmit() : {};
      if (!values) {
        return false;
      }

      if (currentAiRoute) {
        const params: AiRoute = { version: currentAiRoute.version, ...values };
        await updateAiRoute(params);
      } else {
        await addAiRoute(values as AiRoute);
      }

      setOpenDrawer(false);
      formRef.current && formRef.current.reset();
      refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerCancel = () => {
    setOpenDrawer(false);
    formRef.current && formRef.current.reset();
    setCurrentAiRoute(null);
  };

  const onShowModal = (aiRoute: AiRoute) => {
    setCurrentAiRoute(aiRoute);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    setConfirmLoading(true);
    try {
      await deleteAiRoute(currentAiRoute.name);
    } catch (err) {
      handleModalCancel()
      setConfirmLoading(false);
      setOpenModal(false);
      refresh();
    }
    handleModalCancel();
    setConfirmLoading(false);
    setOpenModal(false);
    refresh();
  };

  const handleModalCancel = () => {
    setConfirmLoading(false);
    setOpenModal(false);
    setCurrentAiRoute(null);
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
            <Button
              type="primary"
              onClick={onShowDrawer}
            >
              {t('aiRoute.create')}
            </Button>
          </Col>
          <Col span={20} style={{ textAlign: 'right' }}>
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
        title={t(currentAiRoute ? "aiRoute.edit" : "aiRoute.create")}
        placement="right"
        width={660}
        destroyOnClose
        onClose={handleDrawerCancel}
        open={openDrawer}
        extra={
          <Space>
            <Button onClick={handleDrawerCancel}>{t('misc.cancel')}</Button>
            <Button type="primary" onClick={handleDrawerOK} loading={loadingapi}>
              {t('misc.confirm')}
            </Button>
          </Space>
        }
      >
        <RouteForm ref={formRef} value={currentAiRoute} />
      </Drawer>
      <Modal
        title={t("aiRoute.aiRouteUsage")}
        open={usageDrawer}
        onOk={closeUsage}
        onCancel={closeUsage}
        footer={[
          <Button key="submit" type="primary" onClick={closeUsage}>
            OK
          </Button>,
        ]}
      >
        {t("aiRoute.aiRouteUsageContent")}
        <SyntaxHighlighter language="shell">
          {usageCommand}
        </SyntaxHighlighter>
      </Modal>
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
          <Trans t={t} i18nKey="aiRoute.deleteConfirmation">
            确定删除 <span style={{ color: '#0070cc' }}>{{ currentRouteName: (currentAiRoute && currentAiRoute.name) || '' }}</span> 吗？
          </Trans>
        </p>
      </Modal>
    </PageContainer>
  );
};

export default AiRouteList;
