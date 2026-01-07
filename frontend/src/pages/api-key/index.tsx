/* eslint-disable */
// @ts-nocheck
import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Form, Input, message, Modal, Space, Table, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getApiKeyList, getGroupList, addMapping, removeMapping } from '@/services/api-key';
import EditGroupModal from './components/EditGroupModal';

interface ApiKeyInfo {
  customerId: number;
  customerName: string;
  customerKey: string;
  groupNames: string[];
}

const ApiKeyList: React.FC = () => {
  const { t } = useTranslation();
  const columns = [
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '密钥',
      dataIndex: 'customerKey',
      key: 'customerKey',
      width: 300,
      ellipsis: true,
    },
    {
      title: '消费者分组',
      dataIndex: 'groupNames',
      key: 'groupNames',
      ellipsis: true,
      render: (groupNames: string[]) => {
        if (!groupNames || groupNames.length === 0) {
          return '-';
        }
        return groupNames.join(', ');
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 140,
      align: 'center',
      fixed: 'right',
      render: (_: any, record: ApiKeyInfo) => (
        <Space size="small">
          <a onClick={() => onEditGroup(record)}>编辑分组</a>
        </Space>
      ),
    },
  ];

  const [form] = Form.useForm();
  const [allApiKeys, setAllApiKeys] = useState<ApiKeyInfo[]>([]);
  const [keyword, setKeyword] = useState('');
  const [currentApiKey, setCurrentApiKey] = useState<ApiKeyInfo>({} as ApiKeyInfo);
  const [openModal, setOpenModal] = useState(false);

  const { loading, run, refresh } = useRequest(getApiKeyList, {
    manual: true,
    onSuccess: (result) => {
      const apiKeys = (result || []) as ApiKeyInfo[];
      setAllApiKeys(apiKeys);
    },
  });

  useEffect(() => {
    run({});
  }, []);

  const onEditGroup = (apiKey: ApiKeyInfo) => {
    setCurrentApiKey(apiKey);
    setOpenModal(true);
  };

  const handleModalOk = async () => {
    setOpenModal(false);
    refresh();
    message.success('分组更新成功');
  };

  const handleModalCancel = () => {
    setOpenModal(false);
    setCurrentApiKey({} as ApiKeyInfo);
  };

  const handleReset = () => {
    setKeyword('');
    form.resetFields();
  };

  const dataSource = React.useMemo(() => {
    return allApiKeys.filter((item) => {
      if (keyword) {
        const name = item.customerName || '';
        return name.toLowerCase().includes(keyword.toLowerCase());
      }
      return true;
    });
  }, [allApiKeys, keyword]);

  return (
    <PageContainer>
      <Form
        form={form}
        style={{
          background: '#fff',
          padding: '24px',
          marginBottom: 16,
        }}
        layout="inline"
      >
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap size={24}>
            <Form.Item name="keyword" label="客户名称" style={{ marginBottom: 0 }}>
              <Input
                placeholder="客户名称"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                allowClear
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Space>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Form.Item>
          </Space>
          <Space>
            <Button icon={<RedoOutlined />} onClick={refresh} />
          </Space>
        </Space>
      </Form>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 1200 }}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `总计 ${total}`,
        }}
      />
      <EditGroupModal
        visible={openModal}
        apiKey={currentApiKey}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
    </PageContainer>
  );
};

export default ApiKeyList;
