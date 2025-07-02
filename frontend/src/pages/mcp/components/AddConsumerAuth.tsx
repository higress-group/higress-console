import React, { useEffect, useState } from 'react';
import { Drawer, Form, Select, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { getConsumers } from '@/services/consumer';
import { addMcpConsumers, listMcpConsumers } from '@/services/mcp';

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
  const [consumerList, setConsumerList] = useState<Array<{ label: string; value: string }>>([]);
  const [authorizedConsumers, setAuthorizedConsumers] = useState<string[]>([]);
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

  const fetchAuthorizedConsumers = async () => {
    try {
      const res = await listMcpConsumers({ mcpServerName: mcpName });
      setAuthorizedConsumers(res.map((item: any) => item.consumerName));
    } catch (error) {
      // 如果获取已授权消费者失败，不影响添加功能
      message.warning(t('mcp.detail.fetchAuthorizedConsumersError'));
    }
  };

  useEffect(() => {
    if (visible) {
      fetchConsumerList();
      fetchAuthorizedConsumers();
      form.resetFields();
    }
  }, [visible, mcpName]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await addMcpConsumers({
        mcpServerName: mcpName,
        consumers: values.consumerIds,
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

  // 过滤掉已授权的消费者
  const availableConsumers = consumerList.filter(consumer => !authorizedConsumers.includes(consumer.value));

  return (
    <Drawer
      title={t('mcp.detail.addConsumerAuth')}
      open={visible}
      onClose={handleClose}
      width={700}
      destroyOnClose
      extra={
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
      <Form form={form} layout="vertical" initialValues={{ consumerIds: [] }}>
        <Form.Item label={t('mcp.detail.authScope')}>{t('mcp.detail.authScopeMcpService', { name: mcpName })}</Form.Item>
        <Form.Item
          name="consumerIds"
          label={t('mcp.detail.consumer')}
          rules={[{ required: true, message: t('mcp.detail.selectConsumer') || '请选择消费者' }]}
        >
          <Select
            mode="multiple"
            placeholder={t('mcp.detail.selectConsumer') || '请选择消费者'}
            options={availableConsumers}
            showSearch
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddConsumerAuth;
