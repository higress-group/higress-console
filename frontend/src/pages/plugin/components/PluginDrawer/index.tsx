import { Form, Button, message, Drawer, Space, Spin } from 'antd';

import React, { useState, useImperativeHandle, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import GlobalPluginDetail from './GlobalPluginDetail';
import RoutePluginDetail from './RoutePluginDetail';

import Rewrite from '../Rewrite';
import Cors from '../Cors';
import HeaderModify from '../HeaderModify';
import Retries from '../Retries';

const PLUGIN_COMP_MAP = {
  rewrite: (props) => <Rewrite {...props} />,
  headerModify: (props) => <HeaderModify {...props} />,
  cors: (props) => <Cors {...props} />,
  retries: (props) => <Retries {...props} />,
};

export default function PluginDrawer(props) {
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
      title={activePluginData.title}
      placement="right"
      onClose={onCloseDrawer}
      open={open}
      width={660}
      extra={
        <Space>
          <Button onClick={onCloseDrawer}>取消</Button>
          <Button type="primary" onClick={onSubmit} loading={loading}>
            保存
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
