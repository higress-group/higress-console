/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Select, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { getIngressWorkMode, setIngressWorkMode } from '@/services';

const { Option } = Select;

interface IngressWorkModeConfig {
  mode: boolean;
}

const HigressConfig: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const getIngressWorkModeConfig = async (): Promise<IngressWorkModeConfig> => {
    const mode = await getIngressWorkMode();
    return { mode };
  };
  const { loading, data, refresh } = useRequest(getIngressWorkModeConfig, {
    manual: false,
    onSuccess: (result) => {
      form.setFieldsValue({ ingressWorkMode: result.mode });
    },
  });

  const { run: updateIngressWorkMode, loading: updateLoading } = useRequest(setIngressWorkMode, {
    manual: true,
    onSuccess: () => {
      message.success(t('higressConfig.updateSuccess'));
      refresh();
    },
    onError: () => {
      message.error(t('higressConfig.updateError'));
    },
  });

  const onFinish = (values: { ingressWorkMode: boolean }) => {
    updateIngressWorkMode(values.ingressWorkMode);
  };

  return (
    <PageContainer>
      <div
        style={{
          background: '#fff',
          padding: 16,
        }}
      >
        <Form
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          style={{
            width: 600,
          }}
        >
          <Form.Item
            name="ingressWorkMode"
            label={t('higressConfig.higressWorkMode')}
            required
            rules={[{ required: true, message: t('higressConfig.modeRequired') }]}
          >
            <Select disabled={loading || updateLoading}>
              <Option value={false}>{t('higressConfig.gatewayMode')}</Option>
              <Option value={true}>{t('higressConfig.ingressMode')}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            style={{
              marginBottom: 0
            }}
            wrapperCol={{ offset: 12, span: 12 }}
          >
            <Button type="primary" htmlType="submit" loading={updateLoading}>
              {t('misc.save')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </PageContainer>
  );
};

export default HigressConfig;