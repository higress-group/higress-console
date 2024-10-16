import { LlmProvider } from '@/interfaces/llm-provider';
import { addLlmProvider, deleteLlmProvider, getLlmProviders, updateLlmProvider } from '@/services/llm-provider';
import { ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, Drawer, Form, Modal, Row, Space, Table, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ProviderForm from './components/ProviderForm';

const providerTypeDisplayName = {
  openai: 'llmProvider.providerTypes.openai',
  qwen: 'llmProvider.providerTypes.qwen',
  moonshot: 'llmProvider.providerTypes.moonshot',
};

interface FormRef {
  reset: () => void;
  handleSubmit: () => Promise<FormProps>;
}

const LlmProviderList: React.FC = () => {
  const { t } = useTranslation();
  const columns = [
    {
      title: t('llmProvider.columns.type'),
      dataIndex: 'type',
      key: 'type',
      render: (value) => t(providerTypeDisplayName[value] || value),
    },
    {
      title: t('llmProvider.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: t('llmProvider.columns.tokens'),
      dataIndex: 'tokens',
      key: 'tokens',
      render: (value) => {
        if (!Array.isArray(value) || !value.length) {
          return '-';
        }
        return value.map((token) => <span>{token}</span>).reduce((prev, curr) => [prev, <br />, curr]);
      },
    },
    {
      title: t('llmProvider.columns.action'),
      dataIndex: 'action',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => onEditDrawer(record)}>{t('misc.edit')}</a>
          <a onClick={() => onShowModal(record)}>{t('misc.delete')}</a>
        </Space>
      ),
    },
  ];

  const [form] = Form.useForm();
  const formRef = useRef<FormRef>(null);
  const [dataSource, setDataSource] = useState<LlmProvider[]>([]);
  const [currentLlmProvider, setCurrentLlmProvider] = useState<LlmProvider>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { loading, run, refresh } = useRequest(getLlmProviders, {
    manual: true,
    onSuccess: (result) => {
      const llmProviders = (result || []) as LlmProvider[];
      llmProviders.sort((i1, i2) => {
        return i1.name.localeCompare(i2.name);
      })
      setDataSource(llmProviders);
    },
  });

  useEffect(() => {
    run({});
  }, []);

  const onEditDrawer = (llmProvider: LlmProvider) => {
    setCurrentLlmProvider(llmProvider);
    setOpenDrawer(true);
  };

  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentLlmProvider(null);
  };

  const handleDrawerOK = async () => {
    try {
      // const values: FormProps = formRef.current ? await formRef.current.handleSubmit() : {} as FormProps;

      // if (currentLlmProvider) {
      //   await updateLlmProvider({ version: currentLlmProvider.version, ...values } as LlmProvider);
      // } else {
      //   await addLlmProvider(values as LlmProvider);
      // }

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
    setCurrentLlmProvider(null);
  };

  const onShowModal = (llmProvider: LlmProvider) => {
    setCurrentLlmProvider(llmProvider);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    setConfirmLoading(true);
    await deleteLlmProvider(currentLlmProvider.name);
    setConfirmLoading(false);
    setOpenModal(false);
    refresh();
  };

  const handleModalCancel = () => {
    setOpenModal(false);
    setCurrentLlmProvider(null);
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
              {t('llmProvider.create')}
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
        title={t(currentLlmProvider ? "llmProvider.edit" : "llmProvider.create")}
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
        <ProviderForm ref={formRef} value={currentLlmProvider} />
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
          <Trans t={t} i18nKey="llmProvider.deleteConfirmation">
            确定删除 <span style={{ color: '#0070cc' }}>{{ currentLlmProviderName: (currentLlmProvider && currentLlmProvider.name) || '' }}</span> 吗？
          </Trans>
        </p>
      </Modal>
    </PageContainer>
  );
};

export default LlmProviderList;
