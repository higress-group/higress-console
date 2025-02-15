/* eslint-disable */
// @ts-nocheck
import { Consumer, ServiceSourceFormProps as FormProps } from '@/interfaces/consumer';
import { addConsumer, deleteConsumer, getConsumers, updateConsumer } from '@/services/consumer';
import { ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, Drawer, Form, message, Modal, Row, Space, Table, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ConsumerForm from './components/ConsumerForm';

const credentialTypeDisplaySettings = {
  'key-auth': {
    name: 'Key Auth',
    color: '#4095e5',
  },
  'oauth2': {
    name: 'OAuth2',
    color: '#4095e5',
  },
  'jwt-auth': {
    name: 'JWT',
    color: '#4095e5',
  },
};

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
                const setting = credentialTypeDisplaySettings[type] || { name: type, color: '' };
                return (<Tag color={setting.color}>{setting.name}</Tag>);
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
  const [dataSource, setDataSource] = useState<Consumer[]>([]);
  const [currentConsumer, setCurrentConsumer] = useState<Consumer>({} as Consumer);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { loading, run, refresh } = useRequest(getConsumers, {
    manual: true,
    onSuccess: (result) => {
      const consumers = (result || []) as Consumer[];
      // consumers.push({ name: 'test', credentials: [{ type: 'key-auth' }, { type: 'oauth' }] });
      consumers.sort((i1, i2) => {
        return i1.name.localeCompare(i2.name);
      })
      setDataSource(consumers);
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
              {t('consumer.create')}
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
