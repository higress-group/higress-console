import CodeEditor from '@/components/CodeEditor';
import React, { useState, useImperativeHandle, useEffect, forwardRef } from 'react';
import { Form, message, Divider, Switch, Spin } from 'antd';

import { getWasmPluginsConfig, updateGlobalPluginInstances, getGlobalPluginInstances } from '@/services';
import { useRequest } from 'ahooks';

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
}
export interface IProps {
  data: IPropsData;
  onSuccess: () => void;
}

const GlobalPluginDetail = forwardRef((props: IProps, ref) => {
  const { data, onSuccess } = props;
  const { name = '' } = data || {};

  const [form] = Form.useForm();

  const [pluginData, setPluginData] = useState<IPluginData>();
  const [configData, setConfigData] = useState();

  const [rawConfigurations, setRawConfigurations] = useState('');
  const [defaultValue, setDefaultValue] = useState('');

  const { loading: getDataLoading, run: getData } = useRequest(getGlobalPluginInstances, {
    manual: true,
    onSuccess: (res) => {
      setPluginData(res);
      setRawConfigurations(res.rawConfigurations);
      setDefaultValue(res.rawConfigurations);
      getConfig(name);
    },
  });
  const { loading: getConfigLoading, run: getConfig } = useRequest(getWasmPluginsConfig, {
    manual: true,
    onSuccess: (res) => {
      setConfigData(res);
      if (!defaultValue) {
        const exampleRaw = res?.schema.exampleRaw;
        setRawConfigurations(exampleRaw);
        setDefaultValue(exampleRaw);
      }
      form.setFieldsValue({
        enabled: pluginData.enabled,
      });
    },
  });

  const { loading: updateLoading, run: updateData } = useRequest(updateGlobalPluginInstances, {
    manual: true,
    onSuccess: () => {
      onSuccess();
      message.success('保存成功');
    },
  });

  const onSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    updateData(name, {
      ...pluginData,
      enabled: values.enabled,
      rawConfigurations,
    });
  };

  useEffect(() => {
    getData(name);
  }, [name]);

  useImperativeHandle(ref, () => ({
    submit: onSubmit,
  }));

  return (
    <div>
      <Spin spinning={getConfigLoading || getDataLoading || updateLoading}>
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
