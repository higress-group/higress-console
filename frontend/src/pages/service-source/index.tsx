/* eslint-disable */
// @ts-nocheck
import { Mode } from '@/interfaces/config';
import { ServiceProtocols, ServiceSource, ServiceSourceFormProps, ServiceSourceTypes } from '@/interfaces/service-source';
import { addServiceSource, deleteServiceSource, getServiceSources, updateServiceSource } from '@/services/service-source';
import store from '@/store';
import { isInternalResource } from '@/utils';
import { ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, Drawer, Form, Modal, Row, Space, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import SourceForm from './components/SourceForm';

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

  const [form] = Form.useForm();
  const formRef = useRef<SourceFormRef>(null);
  const [dataSource, setDataSource] = useState<ServiceSource[]>([]);
  const [currentServiceSource, setCurrentServiceSource] = useState<ServiceSource>({} as ServiceSource);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [mode, setMode] = useState<string>(Mode.K8S);

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
              {t('serviceSource.createServiceSource')}
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
    </PageContainer>
  );
};

export default SourceList;
