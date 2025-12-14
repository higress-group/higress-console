/* eslint-disable */
// @ts-nocheck
import { Consumer, CredentialType, ServiceSourceFormProps as FormProps } from '@/interfaces/consumer';
import { addConsumer, deleteConsumer, getConsumers, updateConsumer } from '@/services/consumer';
import { ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, Drawer, Form, Input, message, Modal, Row, Space, Table, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ConsumerForm from './components/ConsumerForm';

interface FormRef {
  reset: () => void;
  handleSubmit: () => Promise<FormProps>;
}

const ConsumerList: React.FC = () => {
  const { t } = useTranslation();
  const columns = [
    {
      title: t('consumer.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: t('consumer.columns.authMethods'),
      dataIndex: 'credentials',
      key: 'credentials',
      render: (value) => {
        if (!Array.isArray(value) || !value.length) {
          return '-';
        }
        const supportedCredentialTypes = [];
        value.forEach(function (credential) {
          if (credential.type && supportedCredentialTypes.indexOf(credential.type) === -1) {
            supportedCredentialTypes.push(credential.type);
          }
        });
        if (supportedCredentialTypes.length === 0) {
          return '-';
        }
        supportedCredentialTypes.sort();
        return (
          <>
            {
              supportedCredentialTypes.map(function (type) {
                const credentialType = Object.values(CredentialType).find(t => t.enabled && t.key === type)
                  || { key: type, displayName: type, displayColor: 'black' };
                return (<Tag color={credentialType.displayColor} key={credentialType.key}>{credentialType.displayName}</Tag>);
              })
            }
          </>
        );
      },
    },
    {
      title: t('misc.actions'),
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
  const [allConsumers, setAllConsumers] = useState<Consumer[]>([]);
  const [keyword, setKeyword] = useState('');
  const [keySearch, setKeySearch] = useState('');
  const [currentConsumer, setCurrentConsumer] = useState<Consumer>({} as Consumer);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { loading, run, refresh } = useRequest(getConsumers, {
    manual: true,
    onSuccess: (result) => {
      const consumers = (result || []) as Consumer[];
      consumers.sort((i1, i2) => {
        return i1.name.localeCompare(i2.name);
      })
      consumers.forEach(c => c.key = c.key || c.name);
      setAllConsumers(consumers);
    },
  });

  useEffect(() => {
    run({});
  }, []);

  const onEditDrawer = (consumer: Consumer) => {
    setCurrentConsumer(consumer);
    setOpenDrawer(true);
  };

  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentConsumer(null);
  };

  const handleDrawerOK = async () => {
    const values: FormProps = formRef.current ? await formRef.current.handleSubmit() : {} as FormProps;
    if (!values) {
      return;
    };

    try {
      if (currentConsumer) {
        await updateConsumer({ version: currentConsumer.version, ...values } as Consumer);
      } else {
        await addConsumer({ ...values, version: 0 } as Consumer);
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
    setCurrentConsumer(null);
  };

  const onShowModal = (consumer: Consumer) => {
    setCurrentConsumer(consumer);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    setConfirmLoading(true);
    try {
      await deleteConsumer(currentConsumer.name);
      message.success(t("consumer.deleteSuccess"));
    } catch (error) { }
    setConfirmLoading(false);
    setOpenModal(false);
    refresh();
  };

  const handleModalCancel = () => {
    setOpenModal(false);
    setCurrentConsumer(null);
  };

  const handleReset = () => {
    setKeyword('');
    setKeySearch('');
    form.resetFields();
  };

  const dataSource = allConsumers.filter((item) => {
    let matches = true;
    if (keyword) {
      matches = item.name.toLowerCase().includes(keyword.toLowerCase());
    }
    if (matches && keySearch) {
      matches = item.credentials?.some(c => JSON.stringify(c).toLowerCase().includes(keySearch.toLowerCase()));
    }
    return matches;
  });

  return (
    <PageContainer>
      <Form
        form={form}
        style={{
          background: '#fff',
          padding: '16px 16px 0 16px',
          marginBottom: 16,
        }}
        layout="inline"
      >
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <Form.Item name="keyword" label={t('consumer.columns.name')}>
              <Input
                placeholder={t('consumer.columns.name')}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                allowClear
              />
            </Form.Item>
            <Form.Item name="keySearch" label="Key">
              <Input
                placeholder="Key"
                value={keySearch}
                onChange={(e) => setKeySearch(e.target.value)}
                allowClear
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button onClick={handleReset}>{t('misc.reset')}</Button>
              </Space>
            </Form.Item>
          </Space>
          <Space>
            <Button
              type="primary"
              onClick={onShowDrawer}
            >
              {t('consumer.create')}
            </Button>
            <Button
              icon={<RedoOutlined />}
              onClick={refresh}
            />
          </Space>
        </Space>
      </Form>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `${t('misc.total')} ${total}`,
        }}
      />
      <Drawer
        title={t(currentConsumer ? "consumer.edit" : "consumer.create")}
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
        <ConsumerForm ref={formRef} value={currentConsumer} />
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
          <Trans t={t} i18nKey="consumer.deleteConfirmation">
            确定删除 <span style={{ color: '#0070cc' }}>{{ currentConsumerName: (currentConsumer && currentConsumer.name) || '' }}</span> 吗？
          </Trans>
        </p>
      </Modal>
    </PageContainer>
  );
};

export default ConsumerList;
