import React, { useEffect, useState } from 'react';
import { Drawer, Form, Select, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { getConsumers } from '@/services/consumer';
import { addMcpConsumers } from '@/services/mcp';

interface AddConsumerAuthProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mcpName: string;
  strategyConfigId: string;
}

const AddConsumerAuth: React.FC<AddConsumerAuthProps> = ({
  visible,
  onClose,
  onSuccess,
  mcpName,
  strategyConfigId,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [consumerList, setConsumerList] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConsumerList = async () => {
    try {
      const res = await getConsumers();
      setConsumerList(
        res.map((item: any) => ({
          label: item.name,
          value: item.name,
        })),
      );
    } catch (error) {
      message.error(t('mcp.detail.fetchConsumerListError'));
    }
  };

  useEffect(() => {
    if (visible) {
      fetchConsumerList();
    }
  }, [visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await addMcpConsumers({
        mcpServerName: mcpName,
        consumers: [values.consumerId],
      });
      message.success(t('mcp.detail.authSuccess'));
      onSuccess();
      onClose();
    } catch (error) {
      message.error(t('mcp.detail.authError'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={t('mcp.detail.addConsumerAuth')}
      open={visible}
      onClose={handleClose}
      width={700}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            {t('mcp.common.cancel')}
          </Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {t('mcp.common.add')}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" initialValues={{ consumerId: undefined }}>
        <Form.Item label={t('mcp.detail.authScope')}>MCP服务</Form.Item>
        <Form.Item
          name="consumerId"
          label={t('mcp.detail.consumer')}
          rules={[{ required: true, message: t('mcp.detail.selectConsumer') }]}
        >
          <Select
            placeholder={t('mcp.detail.selectConsumer')}
            options={consumerList}
            showSearch
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddConsumerAuth;
