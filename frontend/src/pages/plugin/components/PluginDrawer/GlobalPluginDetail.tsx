import CodeEditor from '@/components/CodeEditor';
import { Alert, Form, Spin, Switch, message, Space, Typography, Input, Select, Divider, Tabs } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';

import * as servicesApi from '@/services';
import { useRequest } from 'ahooks';
import i18next, { t } from 'i18next';
import { useSearchParams } from 'ice';

import ArrayForm from './ArrayForm'
import yaml from 'js-yaml'

const { Text } = Typography;
const { TabPane } = Tabs;

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
  const { name: pluginName = '', category = '' } = data || {};

  const [searchParams] = useSearchParams();

  const queryType: string = searchParams.get('type') || '';
  const queryName: string = searchParams.get('name') || '';
  const [currentTabKey, setCurrentTabKey] = useState('form');

  const isChangeExampleRaw = useMemo(() => {
    return ['route', 'domain'].includes(queryType) && category === 'auth';
  }, [queryType, category]);

  const isRoutePlugin = useMemo(() => {
    return queryType === 'route';
  }, [queryType]);

  const isDomainPlugin = useMemo(() => {
    return queryType === 'domain';
  }, [queryType]);

  const pluginInstancesApi = useMemo(() => {
    if (queryType === 'route') {
      return {
        get: servicesApi.getRoutePluginInstance.bind(servicesApi),
        update: servicesApi.updateRoutePluginInstance.bind(servicesApi),
      };
    }

    if (queryType === 'domain') {
      return {
        get: servicesApi.getDomainPluginInstance.bind(servicesApi),
        update: servicesApi.updateDomainPluginInstance.bind(servicesApi),
      };
    }
    return {
      get: servicesApi.getGlobalPluginInstance.bind(servicesApi),
      update: servicesApi.updateGlobalPluginInstance.bind(servicesApi),
    };
  }, [queryType, queryName]);

  const [form] = Form.useForm();

  const [pluginData, setPluginData] = useState<IPluginData>();
  const [configData, setConfigData] = useState();
  const [schema, setSchema] = useState('');

  const [rawConfigurations, setRawConfigurations] = useState('');
  const [defaultValue, setDefaultValue] = useState('');

  const { loading: getDataLoading, run: getData } = useRequest(pluginInstancesApi.get, {
    manual: true,
    onSuccess: (res: IPluginData) => {
      setCurrentTabKey("form");
      setPluginData(res);
      setRawConfigurations(res.rawConfigurations);
      setDefaultValue(res.rawConfigurations);
      getConfig(pluginName);
      form.resetFields();
      if(res.rawConfigurations){
        form.setFieldsValue(yamlToFormValues(res.rawConfigurations));
      }
    },
  });
  const { loading: getConfigLoading, run: getConfig } = useRequest(servicesApi.getWasmPluginsConfig, {
    manual: true,
    onSuccess: (res) => {
      setConfigData(res);
      setSchema(res.schema);
      if (!res.schema.jsonSchema.properties){
        setCurrentTabKey("yaml");
      }
      if (!defaultValue) {
        let exampleRaw = res?.schema?.extensions['x-example-raw'];
        if (isChangeExampleRaw) {
          // 需要冒号后面加空格
          exampleRaw = 'allow: []';
        }
        form.resetFields();
        if (exampleRaw){
          form.setFieldsValue(yamlToFormValues(exampleRaw));
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
      message.success(t('plugins.saveSuccess'));
    },
  });

  function getLocalizedText(obj: any, index: string, key: string) { 
    const i18nObj = obj[`x-${index}-i18n`]; 
    if(i18next.language === 'en-US') return i18nObj && i18nObj[i18next.language] || key || ''; 
    else return i18nObj && i18nObj[i18next.language] || obj[index] || '';
  }

  function generateFields(scm, prefix = '') {
    const properties = scm.properties;
    const requiredFields = scm.required || [];
    const dict = {};
    if (!properties) {
      return (<div>{t('misc.invalidSchema')}</div>)
    }
    return Object.entries(properties).map(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      let translatedTitle = getLocalizedText(value, 'title', key);
      let tip = null;
      if (value.hasOwnProperty('description')) {
          tip = getLocalizedText(value, 'description', value.description);
      }
      const isRequired = requiredFields.includes(key);
      if (value.type === 'object' && value.properties) {
        // 如果是嵌套的对象，则递归生成子表单
        return generateFields(value, fullKey);
      }

      const { type, title } = value;
      let fieldComponent;
      let validationRules = [];
      if (isRequired) {
        validationRules.push({ required: true, message: `${translatedTitle} `+ `${t('misc.isRequired')}` });
      }
      switch (type) {
        case 'string':
          fieldComponent = <Input placeholder={tip || ''} />;
          break;
        case 'integer':
          fieldComponent = <Input type="number" placeholder={tip || ''} />;
          break;
        case 'boolean':
          fieldComponent = (
            <Select placeholder={tip || ''}>
              <Select.Option value={true}>true</Select.Option>
              <Select.Option value={false}>false</Select.Option>
            </Select>
          );
          break;
        case 'array':
          dict[value.items.title] = value.items
          return (
            <Form.Item
              label={translatedTitle}
              name={fullKey}
              rules={validationRules}
            >
              <ArrayForm array={value.items} />
            </Form.Item>
          )
        case 'object':
          return
        default:
          throw new Error(`Unsupported type: ${type}`);
      }
      return (
        <Form.Item
          key={translatedTitle}
          name={fullKey}
          label={translatedTitle}
          rules={validationRules}
        >
          {fieldComponent}
        </Form.Item>
      );

    });
  }

  function formValuesToSchema(formValues) {
    const result = {};
    function processFormValues(formValues) {
      const newFormValues = JSON.parse(JSON.stringify(formValues));
      for (const key in newFormValues) {
        if (!newFormValues.hasOwnProperty(key)) {
          continue;
        }
        const value = newFormValues[key];
        if (!Array.isArray(value)) {
          continue;
        }
        if (!value.every(item => typeof item === 'object' && !Array.isArray(item))) {
          continue;
        }
        const filteredItems = value.filter(item => {
          //uid用来唯一标识每条数据，转换结果并不需要显示uid，这里删除。
          delete item.uid;
          if ('Item' in item && item.Item === null) {
            // "Item"是作为纯数组类型字段的里数据名，为避免转换后显示Item:null，这里删除空值部分。
            delete item.Item;
          }
          return Object.keys(item).length > 0;
        });
        newFormValues[key] = filteredItems;
      }
      return newFormValues;
    }

    formValues = processFormValues(formValues);

    function buildObjectFromPath(path, value) {
      const parts = path.split('.');
      let current = result;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      current[parts[parts.length - 1]] = value;
    }

    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== undefined) {
        buildObjectFromPath(key, value);
      }
    });

    return result;
  }

  function schemaToYaml(obj, indent = ''): string {
    let result = '';
    Object.entries(obj).forEach(([key, value]) => {
      if (key === 'enabled') return;
      if (value === null) {
        result += `${indent}${key}: null\n`;
      } else if (Array.isArray(value)) {
        result += `${indent}${key}:\n`;
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            // 处理对象的第一个键值对直接跟在 - 后面
            let firstEntry = true;
            result += `${indent}  - `;
            Object.entries(item).forEach(([innerKey, innerValue], i) => {
              if (firstEntry) {
                result += `${innerKey}: ${innerValue}`;
                firstEntry = false;
              } else {
                result += `\n${indent}    ${innerKey}: ${innerValue}`;
              }
            });
            result += '\n';
          } else {
            result += `${indent}  - ${item}\n`;
          }
        });
      } else if (typeof value === 'object') {
        result += `${indent}${key}:\n${schemaToYaml(value, indent + '  ')}`;
      } else {
        result += `${indent}${key}: ${value}\n`;
      }
    });
    return result;
  }

  function yamlToFormValues(yamlString) {
    try {
      const parsedObj = yaml.load(yamlString);
      let uidCounter = 1;
      function flattenObject(obj, parentKey = '') {
        let flatResult = {};
        let currentUid = uidCounter;
        Object.keys(obj).forEach((key) => {
          const newKey = parentKey ? `${parentKey}.${key}` : key;
          if (Array.isArray(obj[key])) {
            obj[key].forEach((item, index) => {
              const uid = currentUid++;
              if (typeof item === 'object' && item !== null) {
                const newItem = { uid };
                Object.keys(item).forEach(subKey => {
                  newItem[subKey] = item[subKey];
                });
                flatResult[newKey] = flatResult[newKey] || [];
                flatResult[newKey].push(newItem);
              } else {
                const newItem = { uid, Item: item };
                flatResult[newKey] = flatResult[newKey] || [];
                flatResult[newKey].push(newItem);
              }
            });
            currentUid += obj[key].length;
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(flatResult, flattenObject(obj[key], newKey));
          } else if (typeof obj[key] === 'boolean') {
            flatResult[newKey] = obj[key];
          } else {
            flatResult[newKey] = obj[key];
          }
        });

        return flatResult;
      }
      return flattenObject(parsedObj, '');
    } catch (error) {
      console.error('Error parsing YAML:', error);
      return {};
    }
  }

  function mergeValues(a, b) {
    const result = { ...b };
    Object.keys(a).forEach(key => {
      // 如果 a 中的键存在于 b 中，并且它们都是对象，则递归合并
      if (a[key] != null && result.hasOwnProperty(key) && typeof a[key] === 'object' && !Array.isArray(a[key]) && typeof result[key] === 'object' && !Array.isArray(result[key])) {
        result[key] = mergeValues(a[key], result[key]);
      } else {
        result[key] = a[key];
      }
    });
    return result;
  }

  const onSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    const params = {
      ...pluginData,
      enabled: values.enabled,
      rawConfigurations,
    };

    delete params.configurations;

    if (isRoutePlugin || isDomainPlugin) {
      updateData(
        {
          name: queryName,
          pluginName,
        },
        params,
      );
      return;
    }

    updateData(pluginName, params);
  };

  useEffect(() => {
    resetForm();
    if (isRoutePlugin || isDomainPlugin) {
      getData({
        name: queryName,
        pluginName,
      });
      return;
    }
    getData(pluginName);
  }, [pluginName, queryName]);

  const resetForm = () => {
    // 选择插件变化时重置表单和其他状态
    form.resetFields();
    setPluginData(undefined);
    setConfigData(undefined);
    setSchema('');
    setRawConfigurations('');
    setDefaultValue('');
    setCurrentTabKey('form');
  };

  useEffect(() => {
    if (currentTabKey === "yaml") {
      setDefaultValue(rawConfigurations);
    }
    else if (currentTabKey === "form"){
        let en = form.getFieldsValue().enabled;
        form.resetFields();
        form.setFieldsValue({
          enabled: en,
        });
      if (rawConfigurations) {
        form.setFieldsValue(yamlToFormValues(rawConfigurations));
      }     
      setDefaultValue(rawConfigurations);
    }
  }, [currentTabKey]);

  useImperativeHandle(ref, () => ({
    submit: onSubmit,
  }));

  const alertStatus = useMemo(() => {
    return {
      isShow: (isRoutePlugin || isDomainPlugin) && queryName,
      message: isRoutePlugin ? t('plugins.configForm.targetRoute') + queryName : t('plugins.configForm.targetDomain') + queryName,
    };
  }, [isRoutePlugin, isDomainPlugin, queryName]);

  const fieldChange = () => {
    if (!getConfigLoading && !getDataLoading && currentTabKey === "form") {
      const values = form.getFieldsValue();
      const rawValues = yamlToFormValues(rawConfigurations);
      const mergedValues = mergeValues(values, rawValues);
      const scm = formValuesToSchema(mergedValues);
      const yamlString = schemaToYaml(scm);
      setRawConfigurations(yamlString);
    }
  }

  return (
    <div>
      <Spin spinning={getConfigLoading || getDataLoading || updateLoading}>
        {alertStatus.isShow && (
          <Alert style={{ marginBottom: '10px' }} message={alertStatus.message} type="warning" showIcon />
        )}
        <Form name="basic" form={form} autoComplete="off" layout="vertical" onFieldsChange={fieldChange} key={defaultValue}>
          <Form.Item label={t('plugins.configForm.enableStatus')} name="enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Tabs activeKey={currentTabKey} onChange={(key) => setCurrentTabKey(key)}>
            <TabPane tab={t('misc.switchToForm')} key="form" >
              {!getConfigLoading && !getDataLoading && schema && (
                generateFields(schema.jsonSchema)
              )}
            </TabPane>
            <TabPane tab={t('misc.switchToYAML')} key="yaml">
              <Divider orientation="left">{t('plugins.configForm.dataEditor')}</Divider>
              {!getConfigLoading && !getDataLoading && (
                <CodeEditor defaultValue={defaultValue} 
                onChange={(val) => {
                  setRawConfigurations(val);
                }} />
              )}
            </TabPane>
          </Tabs>
          {!getConfigLoading && !getDataLoading && !isRoutePlugin && !isDomainPlugin && (
            <Space direction="horizontal" style={{ marginTop: "0.5rem" }}>
              <Text>{t('plugins.configForm.globalConfigWarning')}</Text>
            </Space>
          )}
        </Form>
      </Spin>
    </div>
  );
});

export default GlobalPluginDetail;
