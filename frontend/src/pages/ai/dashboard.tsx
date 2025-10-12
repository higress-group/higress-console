// AI仪表板页面组件
// 该组件用于展示AI相关的仪表板信息，包括加载状态、错误处理和iframe嵌入的仪表板页面

import { DashboardType } from '@/interfaces/dashboard';
import { getDashboardInfo } from '@/services';
import { useRequest } from 'ahooks';
import { Col, Row, Spin } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

// AI仪表板组件
const Dashboard: React.FC = () => {
  // 国际化翻译hook
  const { t } = useTranslation();

  // 使用useRequest获取仪表板信息
  const { data: dashboardInfo, error, loading } = useRequest(() => getDashboardInfo(DashboardType.AI));

  // 如果数据正在加载，显示加载动画
  if (loading) {
    return (
      <div style={{ width: '100%', height: '50vh', flex: 1 }}>
        <Spin />
      </div>
    );
  }

  // 如果加载出错或没有数据，显示错误信息
  if (error || !dashboardInfo || !dashboardInfo.url) {
    return (
      <div style={{ width: '100%', height: '50vh', flex: 1, textAlign: 'center' }}>
        <h1>{t('dashboard.loadFailed')}</h1>
      </div>
    );
  }

  // 构造iframe的URL
  const frameUrl = dashboardInfo.builtIn ? location.origin + dashboardInfo.url : dashboardInfo.url;
  
  // 渲染仪表板页面
  return (
    <>
      {/* 顶部链接行 */}
      <Row gutter={24} style={{ marginBottom: '0.5rem' }}>
        <Col
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          offset={4}
          span={16}
        >
          {/* 在新页面中打开仪表板的链接 */}
          <a href={frameUrl} target="_blank">{t('dashboard.openInNewPage')}</a>
        </Col>
      </Row>
      {/* 嵌入仪表板页面的iframe */}
      <iframe style={{ width: '100%', height: '100vh', border: 0, flex: 1 }} src={frameUrl} />
    </>
  )
};

export default Dashboard;
