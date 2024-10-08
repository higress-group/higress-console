import { Alert, Form, Spin, Switch, message, Space, Typography, Input, Select } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import * as servicesApi from '@/services';
import { useRequest } from 'ahooks';
import i18next, { t } from 'i18next';
import { useSearchParams } from 'ice';
import ArrayForm from './ArrayForm'
import yaml from 'js-yaml'

const { Text } = Typography;

export interface PluginData {
  configurations: object;
  enabled: boolean;
  pluginName: string;
  pluginVersion: string;
  rawConfigurations: string;
  scope: string;
  target: any;
  version: string;
}

export interface PropsData {
  name?: string;
  category: string;
}

export interface Props {
  data: PropsData;
  onSuccess: () => void;
  sharedData: string;
  setSharedData: (newData: string) => void;
  enabled: boolean;
  setEnabled: (newEnabled: boolean) => void;
  currentTabKey: string
}

const GlobalPluginDetailForm = forwardRef((props: Props, ref) => {
  const { data, onSuccess, sharedData, setSharedData,enabled, setEnabled, currentTabKey } = props;
  const { name: pluginName = '', category = '' } = data || {};

  const [searchParams] = useSearchParams();

  const queryType: string = searchParams.get('type') || '';
  const queryName: string = searchParams.get('name') || '';

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

  const [pluginData, setPluginData] = useState<PluginData>();
  const [schema, setSchema] = useState('');

  const [rawConfigurations, setRawConfigurations] = useState('');
  const [defaultValue, setDefaultValue] = useState('');

  const { loading: getDataLoading, run: getData } = useRequest(pluginInstancesApi.get, {
    manual: true,
    onSuccess: (res: PluginData) => {
      setPluginData(res);
      setRawConfigurations(res.rawConfigurations);
      setSharedData(res.rawConfigurations);
      setDefaultValue(sharedData);
      getConfig(pluginName);
      const yam = schemaToFormValues(res.rawConfigurations);
      form.setFieldsValue(yam);
    },
  });
  const { loading: getConfigLoading, run: getConfig } = useRequest(servicesApi.getWasmPluginsConfig, {
    manual: true,
    onSuccess: (res) => {
      setSchema(res.schema);
      if (!defaultValue) {
        let exampleRaw = res?.schema?.extensions['x-example-raw'];
        if (isChangeExampleRaw) {
          exampleRaw = 'allow: []';
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

  function getLocalizedText(obj: any, key: string, fallback?: string) {
    const i18nKey = `x-${key}-i18n`;
    const i18nObj = obj[i18nKey];
    return i18nObj && i18nObj[i18next.language] || obj[key] || fallback;
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
        if (newFormValues.hasOwnProperty(key)) {
          const value = newFormValues[key];
          if (Array.isArray(value)) {
            // 处理FormValues的object类型数据
            if (value.every(item => typeof item === 'object' )) {
              // 过滤uid
              const filteredItems = value.filter(item => {
                delete item.uid;
                // 删除不必要的空数据
                if ('Item' in item && item.Item === null) {
                  delete item.Item;
                }
                return Object.keys(item).length > 0;
              });
              newFormValues[key] = filteredItems;
            }
          }
        }
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

  function schemaToFormValues(yamlString) {
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
    if (isRoutePlugin || isDomainPlugin) {
      getData({
        name: queryName,
        pluginName,
      });
      return;
    }
    getData(pluginName);
  }, [pluginName, queryName]);

  useEffect(() => {
    if (currentTabKey === "form") {
      setDefaultValue(sharedData);
      form.setFieldsValue(schemaToFormValues(sharedData))
      form.setFieldsValue({
        enabled: enabled,
      });
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
    if (!getConfigLoading && !getDataLoading) {
      const values = form.getFieldsValue();
      const scm = formValuesToSchema(values);
      const yamlString = schemaToYaml(scm);
      setSharedData(yamlString);
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
          <Switch onChange={(val) =>{
              setEnabled(val);
            }}/>
          </Form.Item>

          {!getConfigLoading && !getDataLoading && schema && (
            generateFields(schema.jsonSchema)
          )}
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

export default GlobalPluginDetailForm;
