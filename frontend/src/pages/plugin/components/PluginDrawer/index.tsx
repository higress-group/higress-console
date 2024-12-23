import { Button, Drawer, Space } from 'antd';
import { useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GlobalPluginDetail from './GlobalPluginDetail';
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
  const routePluginDetailRef = useRef<{ submit: () => {} }>(null);
  const globalPluginDetailRef = useRef<{ submit: () => {} }>(null);

  const [activePluginData, setActivePluginData] = useState({ title: '', key: '' });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCloseDrawer = () => {
    setOpen(false);
  };

  const onSubmit = () => {
    if (isRoutePlugin) {
      routePluginDetailRef.current?.submit();
      return;
    }
    globalPluginDetailRef.current?.submit();
  };

  useImperativeHandle(pluginDrawerRef, () => ({
    onOpen: (data) => {
      setOpen(true);
      setActivePluginData(data);
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
        <GlobalPluginDetail
          data={activePluginData}
          ref={globalPluginDetailRef}
          onSuccess={() => {
            onCloseDrawer();
            onSuccess?.();
          }}
        />
      )}
    </Drawer>
  );
}
