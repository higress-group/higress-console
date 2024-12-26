import { DashboardType } from '@/interfaces/dashboard';
import { getDashboardInfo } from '@/services';
import { useRequest } from 'ahooks';
import { Col, Row, Spin } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  const { data: dashboardInfo, error, loading } = useRequest(() => getDashboardInfo(DashboardType.AI));

  if (loading) {
    return (
      <div style={{ width: '100%', height: '50vh', flex: 1 }}>
        <Spin />
      </div>
    );
  }

  if (error || !dashboardInfo || !dashboardInfo.url) {
    return (
      <div style={{ width: '100%', height: '50vh', flex: 1, textAlign: 'center' }}>
        <h1>{t('dashboard.loadFailed')}</h1>
      </div>
    );
  }

  const frameUrl = dashboardInfo.builtIn ? location.origin + dashboardInfo.url : dashboardInfo.url;
  return (
    <>
      <Row gutter={24} style={{ marginBottom: '0.5rem' }}>
        <Col
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          offset={4}
          span={16}
        >
          <a href={frameUrl} target="_blank">{t('dashboard.openInNewPage')}</a>
        </Col>
      </Row>
      <iframe style={{ width: '100%', height: '100vh', border: 0, flex: 1 }} src={frameUrl} />
    </>
  )
};

export default Dashboard;
