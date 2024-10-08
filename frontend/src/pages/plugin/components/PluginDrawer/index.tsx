import { Button, Drawer, Space, Tabs } from 'antd';
import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import GlobalPluginDetail from './GlobalPluginDetail';
import GlobalPluginDetail_form from './GlobalPluginDetailForm';
import RoutePluginDetail from './RoutePluginDetail';

import { getI18nValue } from '../../utils';
import Cors from '../Cors';
import HeaderModify from '../HeaderModify';
import Retries from '../Retries';
import Rewrite from '../Rewrite';

const PLUGIN_COMP_MAP = {
  rewrite: (props) => <Rewrite {...props} />,
  headerModify: (props) => <HeaderModify {...props} />,
  cors: (props) => <Cors {...props} />,
  retries: (props) => <Retries {...props} />,
};

export default function PluginDrawer(props) {
  const { t } = useTranslation();
  const { pluginDrawerRef, routerDetail, onSuccess } = props;
  const routePluginDetailRef = useRef(null);
  const globalPluginDetailRef = useRef(null);
  const globalPluginDetailFormRef = useRef(null);

  const [activePluginData, setActivePluginData] = useState({ title: '', key: '' });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTabKey, setCurrentTabKey] = useState('form');
  const [sharedData, setSharedData] = useState('');
  const [enabled, setEnabled] = useState();

  const onCloseDrawer = () => {
    setOpen(false);
  };

  const { TabPane } = Tabs;

  const onSubmit = () => {
    if (isRoutePlugin) {
      routePluginDetailRef.current?.submit();
      return;
    }
    if (currentTabKey==="form") {
      globalPluginDetailFormRef.current?.submit();
    } else {
      globalPluginDetailRef.current?.submit();
    }
  };

  useImperativeHandle(pluginDrawerRef, () => ({
    onOpen: (data) => {
      setOpen(true);
      setActivePluginData(data);
      console.log('Received data:', data);
    },
  }));

  const isRoutePlugin = useMemo(() => {
    return !!PLUGIN_COMP_MAP?.[activePluginData.key];
  }, [activePluginData?.key]);

  return (
    <Drawer
      title={getI18nValue(activePluginData, 'title')}
      placement="right"
      onClose={onCloseDrawer}
      open={open}
      width={660}
      extra={
        <Space>
          <Button onClick={onCloseDrawer}>{t('misc.cancel')}</Button>
          <Button type="primary" onClick={onSubmit} loading={loading}>
            {t('misc.save')}
          </Button>
        </Space>
      }
    >
      {isRoutePlugin ? (
        <RoutePluginDetail
          ref={routePluginDetailRef}
          routerDetail={routerDetail}
          data={activePluginData}
          onSuccess={() => {
            onCloseDrawer();
            onSuccess?.();
          }}
        />
      ) : (
        <>
        <Tabs activeKey={currentTabKey} onChange={(key) => setCurrentTabKey(key)}>
          <TabPane tab={t('misc.switchToForm')} key="form">
            <GlobalPluginDetail_form
              ref={globalPluginDetailFormRef}
              data={activePluginData}
              sharedData={sharedData}
              setSharedData={setSharedData}
              enabled={enabled}
              setEnabled={setEnabled}
              currentTabKey={currentTabKey}
              onSuccess={() => {
                onCloseDrawer();
                onSuccess?.();
              }}
            />
          </TabPane>
          <TabPane tab={t('misc.switchToYAML')} key="yaml">
            <GlobalPluginDetail
              ref={globalPluginDetailRef}
              data={activePluginData}
              sharedData={sharedData}
              setSharedData={setSharedData}
              enabled={enabled}
              setEnabled={setEnabled}
              currentTabKey={currentTabKey}
              onSuccess={() => {
                onCloseDrawer();
                onSuccess?.();
              }}
            />
          </TabPane>
        </Tabs>
        </>
      )}
    </Drawer>
  );
}