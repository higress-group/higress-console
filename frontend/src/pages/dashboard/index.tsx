import { getDashboardInfo, initDashboard } from '@/services';
import { useRequest } from 'ahooks';
import { Button, Spin } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  const { data: dashboardInfo, error, loading } = useRequest(getDashboardInfo);

  if (loading) {
    return (
      <div style={{ width: "100%", height: "50vh", flex: 1 }}>
        <Spin />
      </div>
    )
  }
  if (error) {
    return (
      <div style={{ width: "100%", height: "50vh", flex: 1, textAlign: "center" }}>
        <h1>{t("dashboard.loadFailed")}</h1>
      </div>
    )
  }
  if (!dashboardInfo || !dashboardInfo.url) {
    const handleInitDashboard = async () => {
      await initDashboard();
      location.reload();
    };
    return (
      <div style={{ width: "100%", height: "50vh", flex: 1, textAlign: "center" }}>
        <h1>{t("dashboard.notFound")}</h1>
        <Button type="primary" onClick={() => handleInitDashboard()}>{t("dashboard.createDashboard")}</Button>
      </div>
    )
  }
  const fullUrl = location.origin + dashboardInfo.url;
  return (
    <iframe style={{ width: "100%", height: "100vh", border: 0, flex: 1 }} src={fullUrl} />
  );
};

export default Dashboard;
