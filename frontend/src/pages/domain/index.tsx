import { DomainItem, DomainResponse } from '@/interfaces/domain';
import { addGatewayDomain, deleteGatewayDomain, getGatewayDomain, updateGatewayDoamin } from '@/services';
import { ExclamationCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, Drawer, Form, Modal, Row, Space, Table } from 'antd';
import { uniqueId } from "lodash";
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import DomainForm from './components/DomainForm';

interface DomainFormProps {
  name: string,
  protocol: string,
  certIdentifier?: string,
  mustHttps?: Array<any>,
}

const DomainList: React.FC = () => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('domain.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
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
      render: (value) => (value || '-'),
    },
    {
      title: t('domain.columns.action'),
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
  const [dataSource, setDataSource] = useState<DomainItem[]>([]);
  const [currentDomain, setCurrentDomain] = useState<DomainItem | null>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const getDomainList = async (factor): Promise<DomainResponse> => (getGatewayDomain(factor));
  const { loading, run, refresh } = useRequest(getDomainList, {
    manual: true,
    onSuccess: (result, params) => {
      const { list: _dataSource } = result;
      _dataSource.forEach(i => {
        i.key || (i.key = i.id || (i.name + '_' + i.protocol))
      })
      setDataSource(_dataSource);
    },
  });

  useEffect(() => {
    run({});
  }, []);

  const onEditDrawer = (domain: DomainItem) => {
    setCurrentDomain(domain);
    setOpenDrawer(true);
  };

  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentDomain(null);
  };

  const handleDrawerOK = async () => {
    try {
      const values: DomainFormProps = formRef.current && await formRef.current.handleSubmit();
      const { name, protocol, certIdentifier, mustHttps } = values;
      const data = { name, protocol };
      if (values.certIdentifier) {
        Object.assign(data, { certIdentifier });
      }
      if (values.mustHttps) {
        Object.assign(data, { mustHttps: !!mustHttps?.length });
      }
      if (currentDomain) {
        const _id = currentDomain.id || parseInt(uniqueId(), 10);
        await updateGatewayDoamin({ id: _id, ...data } as DomainItem);
      } else {
        await addGatewayDomain(data as DomainItem);
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

  const onShowModal = (domain: DomainItem) => {
    setCurrentDomain(domain);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    setConfirmLoading(true);
    await deleteGatewayDomain({ name: currentDomain?.name });
    setConfirmLoading(false);
    setOpenModal(false);
    // 重新刷新
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
            <Button
              type="primary"
              onClick={onShowDrawer}
            >
              {t('domain.createDomain')}
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
        title={<div><ExclamationCircleOutlined style={{ color: '#ffde5c', marginRight: 8 }}/>{t('misc.delete')}</div>}
        open={openModal}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
      >
        <p>
          <Trans t={t} i18nKey="domain.deleteConfirmation">
            确定删除 <span style={{ color: '#0070cc' }}>{{currentDomainName: (currentDomain && currentDomain.name) || ''}}</span> 吗？
          </Trans>
        </p>
      </Modal>
      <Drawer
        title={t('domain.createDomain')}
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
        <DomainForm ref={formRef} value={currentDomain} />
      </Drawer>

    </PageContainer>
  );
};

export default DomainList;
