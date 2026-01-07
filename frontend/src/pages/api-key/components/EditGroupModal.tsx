/* eslint-disable */
// @ts-nocheck
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { AutoComplete, Button, Form, Input, message, Modal, Space, Table, Transfer } from 'antd';
import React, { useEffect, useState } from 'react';
import { getGroupList, getCustomerGroups, addMapping, removeMapping } from '@/services/api-key';

interface ApiKeyGroup {
  id: number;
  name: string;
  key: string;
}

interface EditGroupModalProps {
  visible: boolean;
  apiKey: any;
  onOk: () => void;
  onCancel: () => void;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({ visible, apiKey, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const [allGroups, setAllGroups] = useState<ApiKeyGroup[]>([]);
  const [customerGroups, setCustomerGroups] = useState<ApiKeyGroup[]>([]);
  const [selectedGroupNames, setSelectedGroupNames] = useState<string[]>([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const { loading: groupLoading, run: fetchGroups } = useRequest(getGroupList, {
    manual: true,
    onSuccess: (result) => {
      const groups = (result || []) as ApiKeyGroup[];
      setAllGroups(groups);
    },
  });

  const { loading: customerGroupLoading, run: fetchCustomerGroups } = useRequest(getCustomerGroups, {
    manual: true,
    onSuccess: (result) => {
      const groups = (result || []) as ApiKeyGroup[];
      setCustomerGroups(groups);
      setSelectedGroupNames(groups.map(g => g.name));
    },
  });

  useEffect(() => {
    if (visible && apiKey) {
      fetchGroups({});
      fetchCustomerGroups(apiKey.customerKey);
    }
  }, [visible, apiKey]);

  const handleAddGroup = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);

      // 找到选择的分组
      const selectedGroup = allGroups.find(g => g.name === values.groupName);
      if (!selectedGroup) {
        message.error('分组不存在');
        return;
      }

      await addMapping({
        groupId: selectedGroup.id,
        customerId: apiKey.customerId,
      });
      message.success('添加成功');
      setOpenAddModal(false);
      form.resetFields();
      setSearchValue('');
      fetchGroups({});
      fetchCustomerGroups(apiKey.customerKey);
    } catch (error) {
      console.error('Add group failed:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleRemoveGroup = async (groupId: number) => {
    const group = customerGroups.find(g => g.id === groupId);
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要将客户从分组 "${group?.name}" 中移除吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await removeMapping({
            groupId,
            customerId: apiKey.customerId,
          });
          message.success('移除成功');
          fetchGroups({});
          fetchCustomerGroups(apiKey.customerKey);
        } catch (error) {
          console.error('Remove group failed:', error);
        }
      },
    });
  };

  const groupColumns = [
    {
      title: '分组名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分组 Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_: any, record: ApiKeyGroup) => (
        <a onClick={() => handleRemoveGroup(record.id)}>删除</a>
      ),
    },
  ];

  // 过滤已添加的分组，只显示可添加的分组
  const availableGroups = allGroups.filter(g =>
    !customerGroups.some(cg => cg.id === g.id)
  );

  // AutoComplete 的选项
  const options = availableGroups
    .filter(group => group.name.toLowerCase().includes(searchValue.toLowerCase()))
    .map(group => ({
      value: group.name,
      label: group.name,
    }));

  return (
    <>
      <Modal
        title="编辑分组"
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        width={800}
        destroyOnClose
      >
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenAddModal(true)}>
            新增
          </Button>
        </div>
        <Table
          loading={groupLoading || customerGroupLoading}
          dataSource={customerGroups}
          columns={groupColumns}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      <Modal
        title="新增分组"
        open={openAddModal}
        onOk={handleAddGroup}
        onCancel={() => {
          setOpenAddModal(false);
          form.resetFields();
          setSearchValue('');
        }}
        confirmLoading={confirmLoading}
        zIndex={1001}
        wrapClassName="add-group-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="groupName"
            label="选择分组"
            rules={[{ required: true, message: '请选择分组' }]}
          >
            <AutoComplete
              options={options}
              style={{ width: '100%' }}
              placeholder="请输入分组名称搜索"
              filterOption={false}
              onSearch={setSearchValue}
              onChange={setSearchValue}
              notFoundContent={searchValue ? '未找到匹配的分组' : '请输入分组名称搜索'}
            />
          </Form.Item>
        </Form>
      </Modal>
      <style>
        {`
          .add-group-modal .ant-modal-wrap {
            z-index: 1001;
          }
        `}
      </style>
    </>
  );
};

export default EditGroupModal;
