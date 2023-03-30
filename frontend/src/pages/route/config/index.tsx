import { PageContainer } from '@ant-design/pro-layout';
import { PageHeader, Spin } from 'antd';

import React, { useState, useRef, useEffect } from 'react';
import { history, useSearchParams } from 'ice';

import PluginList from './components/PluginList';
import PluginDrawer from './components/PluginDrawer';

import { useRequest } from 'ahooks';
import { getGatewayRoutesDetail } from '@/services';
import styles from './index.module.css';

export default function RouterConfig() {
  const [routerDetail, setRouterDetail] = useState({});
  const [searchParams] = useSearchParams();
  let pluginDrawerRef = useRef({
    onOpen: (_key) => {},
  });
  const name = searchParams.get('name');

  const handleClickPlugin = (activeItem: Object) => {
    pluginDrawerRef?.current?.onOpen(activeItem);
  };

  const handleBack = () => {
    history?.push('/route');
  };

  const { loading, run } = useRequest(getGatewayRoutesDetail, {
    manual: true,
    onSuccess: (res) => {
      setRouterDetail(res || {});
    },
  });

  const init = () => {
    name && run(name);
  };

  useEffect(() => {
    init();
  }, [name]);

  return (
    <div className={styles.routeConfig}>
      <PageHeader className="hi-page-container-warp" title="策略配置" onBack={handleBack} subTitle="" />
      <Spin spinning={loading}>
        <PageContainer>
          <PluginList onOpen={handleClickPlugin} data={routerDetail} />
          <PluginDrawer pluginDrawerRef={pluginDrawerRef} routerDetail={routerDetail} onSuccess={init} />
        </PageContainer>
      </Spin>
    </div>
  );
}
