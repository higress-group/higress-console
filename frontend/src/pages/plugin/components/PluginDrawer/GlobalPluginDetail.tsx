import CodeEditor from '@/components/CodeEditor';
import React, { useState, useImperativeHandle, useEffect, forwardRef, useMemo } from 'react';
import { Form, message, Divider, Switch, Spin, Alert } from 'antd';

import * as servicesApi from '@/services';
import { useRequest } from 'ahooks';
import { useSearchParams } from 'ice';

export interface IPluginData {
  configurations: object;
  enabled: boolean;
  pluginName: string;
  pluginVersion: string;
  rawConfigurations: string;
  scope: string;
  target: any;
  version: string;
}

export interface IPropsData {
  name?: string;
  category: string;
}
export interface IProps {
  data: IPropsData;
  onSuccess: () => void;
}

const GlobalPluginDetail = forwardRef((props: IProps, ref) => {
  const { data, onSuccess } = props;
  const { name: pluginName = '' } = data || {};

  const [searchParams] = useSearchParams();

  const queryType: string = searchParams.get('type') || '';
  const queryName: string = searchParams.get('name') || '';

  const isChangeExampleRaw = useMemo(() => {
    return ['route', 'domain'].includes(queryType) && data.category === 'auth';
  }, [queryType]);

  const isRoutePlugin = useMemo(() => {
    return queryType === 'route';
  }, [queryType]);

  const pluginInstancesApi = useMemo(() => {
    if (queryType === 'route') {
      return {
        get: servicesApi.getRoutePluginInstances.bind(servicesApi),
        update: servicesApi.updateRoutePluginInstances.bind(servicesApi),
      };
    }
    return {
      get: servicesApi.getGlobalPluginInstances.bind(servicesApi),
      update: servicesApi.updateGlobalPluginInstances.bind(servicesApi),
    };
  }, [queryType, queryName]);

  const [form] = Form.useForm();

  const [pluginData, setPluginData] = useState<IPluginData>();
  const [configData, setConfigData] = useState();

  const [rawConfigurations, setRawConfigurations] = useState('');
  const [defaultValue, setDefaultValue] = useState('');

  const { loading: getDataLoading, run: getData } = useRequest(pluginInstancesApi.get, {
    manual: true,
    onSuccess: (res: IPluginData) => {
      setPluginData(res);
      setRawConfigurations(res.rawConfigurations);
      setDefaultValue(res.rawConfigurations);
      getConfig(pluginName);
    },
  });
  const { loading: getConfigLoading, run: getConfig } = useRequest(servicesApi.getWasmPluginsConfig, {
    manual: true,
    onSuccess: (res) => {
      setConfigData(res);
      if (!defaultValue) {
        let exampleRaw = res?.schema.exampleRaw;
        if (isChangeExampleRaw) {
          exampleRaw = 'allow:[]';
        }
        setRawConfigurations(exampleRaw);
        setDefaultValue(exampleRaw);
      }
      form.setFieldsValue({
        enabled: pluginData?.enabled,
      });
    },
  });

  const { loading: updateLoading, run: updateData } = useRequest(pluginInstancesApi.update, {
    manual: true,
    onSuccess: () => {
      onSuccess();
      message.success('保存成功');
    },
  });

  const onSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    const params = {
      ...pluginData,
      enabled: values.enabled,
      rawConfigurations,
    };

    delete params.configurations;

    if (isRoutePlugin) {
      updateData(
        {
          routeName: queryName,
          pluginName,
        },
        params,
      );
      return;
    }

    updateData(pluginName, params);
  };

  useEffect(() => {
    if (isRoutePlugin) {
      getData({
        routeName: queryName,
        pluginName,
      });
      return;
    }
    getData(pluginName);
  }, [pluginName, queryName]);

  useImperativeHandle(ref, () => ({
    submit: onSubmit,
  }));

  return (
    <div>
      <Spin spinning={getConfigLoading || getDataLoading || updateLoading}>
        {isRoutePlugin && queryName && (
          <Alert style={{ marginBottom: '10px' }} message={`作用路由： ${queryName}`} type="warning" showIcon />
        )}
        <Form name="basic" form={form} autoComplete="off">
          <Form.Item label="开启状态" name="enabled" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Divider orientation="left">数据编辑器-YAML</Divider>
          {!getConfigLoading && !getDataLoading && (
            <CodeEditor defaultValue={defaultValue} onChange={(val) => setRawConfigurations(val)} />
          )}
        </Form>
      </Spin>
    </div>
  );
});

export default GlobalPluginDetail;
