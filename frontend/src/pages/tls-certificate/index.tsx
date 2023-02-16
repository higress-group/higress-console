import { TlsCertificate, TlsCertificateResponse } from '@/interfaces/tls-certificate';
import { addTlsCertificate, deleteTlsCertificate, getTlsCertificates, updateTlsCertificate } from '@/services';
import { ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, Drawer, Form, Modal, Row, Space, Table } from 'antd';
import { uniqueId } from "lodash";
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import TlsCertificateForm from './components/TlsCertificateForm';

const TlsCertificateList: React.FC = () => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('tlsCertificate.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: t('tlsCertificate.columns.version'),
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: t('tlsCertificate.columns.domains'),
      dataIndex: 'domains',
      key: 'domains',
      render: (value) => (value?.map(i => <p>{i}</p>) || '-'),
    },
    {
      title: t('tlsCertificate.columns.validityStart'),
      dataIndex: 'validityStart',
      key: 'validityStart',
      render: (value) => (value || '-'),
    },
    {
      title: t('tlsCertificate.columns.validityEnd'),
      dataIndex: 'validityEnd',
      key: 'validityEnd',
      render: (value) => (value || '-'),
    },
    {
      title: t('tlsCertificate.columns.action'),
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
  const formRef = useRef(null);
  const [dataSource, setDataSource] = useState<TlsCertificate[]>([]);
  const [currentTlsCertificate, setCurrentTlsCertificate] = useState<TlsCertificate | null>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const getTlsCertificateList = async (): Promise<TlsCertificateResponse> => (getTlsCertificates());
  const { loading, run, refresh } = useRequest(getTlsCertificateList, {
    manual: true,
    onSuccess: (result: TlsCertificate[], params) => {
      const _dataSource = result || [];
      _dataSource.forEach(i => {
        i.key || (i.key = i.id || i.name);
      });
      setDataSource(_dataSource);
    },
  });

  useEffect(() => {
    run();
  }, []);

  const onEditDrawer = (tlsCertificate: TlsCertificate) => {
    setCurrentTlsCertificate(tlsCertificate);
    setOpenDrawer(true);
  };

  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentTlsCertificate(null);
  };

  const handleDrawerOK = async () => {
    try {
      const values: TlsCertificate = formRef.current && await formRef.current.handleSubmit();
      const { name,version, cert, key,domains } = values;
      const data = { name,version, cert, key, domains };
      if (values.validityStart) {
        Object.assign(data, { validityStart: moment(values.validityStart).format('yyyy/MM/DD HH:mm:ss') });
      }
      if (values.validityEnd) {
        Object.assign(data, { validityEnd: moment(values.validityEnd).format('yyyy/MM/DD HH:mm:ss') });
      }
      if (currentTlsCertificate) {
        await updateTlsCertificate({ ...data } as TlsCertificate);
      } else {
        await addTlsCertificate(data as TlsCertificate);
      }
      setOpenDrawer(false);
      refresh();
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const handleDrawerCancel = () => {
    setOpenDrawer(false);
    setCurrentTlsCertificate(null);
  };

  const onShowModal = (tlsCertificate: TlsCertificate) => {
    setCurrentTlsCertificate(tlsCertificate);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    if (!currentTlsCertificate) {
      return;
    }
    setConfirmLoading(true);
    await deleteTlsCertificate(currentTlsCertificate.name);
    setConfirmLoading(false);
    setOpenModal(false);
    refresh();
  };

  const handleModalCancel = () => {
    setOpenModal(false);
    setCurrentTlsCertificate(null);
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
              {t('tlsCertificate.createTlsCertificate')}
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
          <Trans t={t} i18nKey="tlsCertificate.deleteConfirmation">
            确定删除 <span style={{ color: '#0070cc' }}>{{ currentTlsCertificateName: (currentTlsCertificate && currentTlsCertificate.name) || '' }}</span> 吗？
          </Trans>
        </p>
      </Modal>
      <Drawer
        title={t(currentTlsCertificate ? 'tlsCertificate.editTlsCertificate' : 'tlsCertificate.createTlsCertificate')}
        placement='right'
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
        <TlsCertificateForm ref={formRef} value={currentTlsCertificate} />
      </Drawer>

    </PageContainer>
  );
};

export default TlsCertificateList;
