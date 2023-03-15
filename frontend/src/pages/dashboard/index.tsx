import { getDashboardInfo, initDashboard, setDashboardUrl } from '@/services';
import { useRequest } from 'ahooks';
import { Button, Form, Input, Spin } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const { data: dashboardInfo, error, loading } = useRequest(getDashboardInfo);

  if (loading) {
    return (
      <div style={{ width: '100%', height: '50vh', flex: 1 }}>
        <Spin />
      </div>
    );
  }

  if (!dashboardInfo || error) {
    return (
      <div style={{ width: '100%', height: '50vh', flex: 1, textAlign: 'center' }}>
        <h1>{t('dashboard.loadFailed')}</h1>
      </div>
    );
  }

  if (dashboardInfo.url) {
    const frameUrl = dashboardInfo.builtIn ? location.origin + dashboardInfo.url : dashboardInfo.url;
    return <iframe style={{ width: '100%', height: '100vh', border: 0, flex: 1 }} src={frameUrl} />;
  }

  if (dashboardInfo.builtIn) {
    const handleInitDashboard = async () => {
      await initDashboard();
      location.reload();
    };
    return (
      <div style={{ width: '100%', height: '50vh', flex: 1, textAlign: 'center' }}>
        <h1>{t('dashboard.uninitialized')}</h1>
        <Button type="primary" onClick={() => handleInitDashboard()}>
          {t('dashboard.initDashboard')}
        </Button>
      </div>
    );
  } else {
    const handleSetDashboard = async () => {
      const values = await form.validateFields();
      await setDashboardUrl(values.url);
      location.reload();
    };
    return (
      <Form form={form} layout="vertical">
        <h3>{t('dashboard.noBuiltInDashboard')}</h3>
        <Form.Item
          label={t('dashboard.setForm.url')}
          required
          name="url"
          rules={[
            {
              required: true,
              message: t('dashboard.setForm.urlRequired'),
            },
          ]}
        >
          <Input showCount allowClear maxLength={256} type="url" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSetDashboard}>
            {t('misc.confirm')}
          </Button>
        </Form.Item>
      </Form>
    );
  }
};

export default Dashboard;
