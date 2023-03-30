import { Form, Button, message, Drawer, Space, Spin } from 'antd';

import React, { useState, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';

import Rewrite from '../Rewrite';
import Cors from '../Cors';
import HeaderModify from '../HeaderModify';
import Retries from '../Retries';

import { updateRouteConfig } from '@/services';
import { useRequest } from 'ahooks';

const PLUGIN_COMP_MAP = {
  rewrite: (props) => <Rewrite {...props} />,
  headerModify: (props) => <HeaderModify {...props} />,
  cors: (props) => <Cors {...props} />,
  retries: (props) => <Retries {...props} />,
};

export default function PluginDrawer(props) {
  const { t } = useTranslation();

  const { pluginDrawerRef, routerDetail } = props;

  const [form] = Form.useForm();
  const [activePluginKey, setActivePluginKey] = useState('');
  const [activePluginData, setActivePluginData] = useState({ name: '' });

  const [open, setOpen] = useState(false);

  const getFormatParams = () => {
    const formData = form.getFieldsValue();
    let res = {};
    const { enabled, host, new: newPath } = formData;
    switch (activePluginKey) {
      case 'headerModify':
        // eslint-disable-next-line no-case-declarations
        const headerControl = {
          enabled: formData.enabled,
          request: {
            add: [],
            set: [],
            remove: [],
          },
          response: {
            add: [],
            set: [],
            remove: [],
          },
        };

        formData.headerList?.forEach((item) => {
          let newItem = {
            key: item.key,
            value: item.value,
          };
          if (item.actionType === 'remove') {
            newItem = item.key;
          }
          headerControl[item.headerType][item.actionType].push(newItem);

          res = { headerControl };
        });
        break;
      case 'cors':
        res = {
          cors: {
            enabled: !!formData.enabled,
            allowCredentials: !!formData.allowCredentials,
            allowHeaders: formData.allowHeaders ? formData.allowHeaders?.split(';') : null,
            allowMethods: formData.allowMethods?.length ? formData.allowMethods : null,
            allowOrigins: formData.allowOrigins?.length ? formData.allowOrigins?.split(';') : null,
            exposeHeaders: formData.exposeHeaders?.length ? formData.exposeHeaders?.split(';') : null,
            maxAge: formData?.maxAge || null,
          },
        };
        break;
      case 'retries':
        res = {
          proxyNextUpstream: formData,
        };
        break;
      case 'rewrite':
        res = {
          rewrite: {
            enabled,
            path: newPath.path,
            host,
          },
        };
        break;
      default:
        break;
    }
    return res;
  };

  const { loading, run } = useRequest(updateRouteConfig, {
    manual: true,
    onSuccess: () => {
      onCloseDrawer();
      props?.onSuccess();
      message.success('保存成功');
    },
  });

  const onCloseDrawer = () => {
    setOpen(false);
  };

  const onSubmit = () => {
    form.validateFields().then((res) => {
      const params = getFormatParams();
      run(routerDetail.name, {
        ...routerDetail,
        ...params,
      });
    });
  };

  useImperativeHandle(pluginDrawerRef, () => ({
    onOpen: (data) => {
      const { key } = data;
      setOpen(true);
      setActivePluginData(data);
      setActivePluginKey(key);
    },
  }));

  return (
    <Drawer
      title={activePluginData.name}
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
      <Spin spinning={loading}>
        {PLUGIN_COMP_MAP?.[activePluginKey]?.({ form, t, data: routerDetail }) || JSON.stringify(activePluginData)}
      </Spin>
    </Drawer>
  );
}
