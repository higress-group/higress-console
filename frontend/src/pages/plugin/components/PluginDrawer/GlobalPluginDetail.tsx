import CodeEditor from '@/components/CodeEditor';
import { Alert, Form, Spin, Switch, message, Space, Typography, Input, Select, Divider, Tabs, Card } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';

import * as servicesApi from '@/services';
import { useRequest } from 'ahooks';
import i18next, { t } from 'i18next';
import { useSearchParams } from 'ice';

import ArrayForm from './ArrayForm';
import yaml from 'js-yaml';

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
      setCurrentTabKey('form');
      setPluginData(res);
      setRawConfigurations(res.rawConfigurations);
      setDefaultValue(res.rawConfigurations);
      getConfig(pluginName);
      form.resetFields();
      if (res.rawConfigurations) {
        form.setFieldsValue(yamlToFormValues(res.rawConfigurations));
      }
    },
  });

  const { loading: getConfigLoading, run: getConfig } = useRequest(servicesApi.getWasmPluginsConfig, {
    manual: true,
    onSuccess: (res) => {
      setConfigData(res);
      setSchema(res.schema);
      if (!res.schema.jsonSchema.properties) {
        setCurrentTabKey('yaml');
      }
      if (!defaultValue) {
        let exampleRaw = res?.schema?.extensions['x-example-raw'];
        if (isChangeExampleRaw) {
          // Need a space after the colon
          exampleRaw = 'allow: []';
        }
        form.resetFields();
        if (exampleRaw) {
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

  const handleInputChange = (name, value) => {
    form.setFieldValue(name, value);
  };

  const validateArrayTypes = (value) => {
    const validTypes = ['string', 'integer', 'number', 'boolean'];
    if (value.type !== 'object') {
      return validTypes.includes(value.type);
    }
    if (value.properties) {
      return Object.values(value.properties).every(property => {
        return validTypes.includes(property.type);
      });
    }
    return false;
  };

  function getLocalizedText(obj: any, index: string, defaultText: string) {
    const i18nObj = obj[`x-${index}-i18n`];
    return i18nObj && i18nObj[i18next.language] || obj[index] || defaultText || '';
  }

  function generateFields(scm, prefix = '') {
    const properties = scm.properties;
    const requiredFields = scm.required || [];
    if (!properties) {
      return <div>{t('misc.invalidSchema')}</div>;
    }
    return Object.entries(properties).map(([key, property]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      let translatedTitle = getLocalizedText(property, 'title', key);
      let tip = null;
      if ('description' in property) {
        tip = getLocalizedText(property, 'description', property.description);
      }
      const isRequired = requiredFields.includes(key);
      if (property.type === 'object' && property.properties) {
        // If it's a nested object, recursively generate the sub-form
        return (
          <Card
            title={translatedTitle}
            style={{
              marginBottom: 12,
              padding: '8px',
            }}
            key={fullKey}
          >
            {generateFields(property, fullKey)}
          </Card>
        );
      }

      const { type, title } = property;
      let fieldComponent;
      let validationRules = [];
      if (isRequired && currentTabKey !== 'yaml') {
        validationRules.push({ required: true, message: `${translatedTitle} ${t('misc.isRequired')}` });
      }
      switch (type) {
        case 'string':
          fieldComponent = (
            <Input
              placeholder={tip || ''}
              onChange={(e) => handleInputChange(fullKey, e.target.value)}
            />
          );
          break;
        case 'integer':
          fieldComponent = (
            <Input
              type="number"
              placeholder={tip || ''}
              onChange={(e) => handleInputChange(fullKey, parseInt(e.target.value, 10))}
            />
          );
          break;
        case 'number':
          fieldComponent = (
            <Input
              type="number"
              step="any"
              placeholder={tip || ''}
              onChange={(e) => handleInputChange(fullKey, parseFloat(e.target.value))}
            />
          );
          break;
        case 'boolean':
          fieldComponent = (
            <Select placeholder={tip || ''}>
              <Select.Option value>true</Select.Option>
              <Select.Option value={false}>false</Select.Option>
            </Select>
          );
          break;
        case 'array':
          if (!validateArrayTypes(property.items)) {
            throw new Error(`Unsupported array's type`);
          }
          validationRules.push({
            validator(_, value) {
              if (Array.isArray(value) && value.some(i => !i.new && i.invalid)) {
                return Promise.reject();
              }
              return Promise.resolve();
            },
          });
          return (
            <Form.Item
              key={fullKey}
              label={translatedTitle}
              name={fullKey}
              rules={validationRules}
            >
              <ArrayForm array={property.items} />
            </Form.Item>
          );
        case 'object':
          return;
        default:
          throw new Error(`Unsupported type: ${type}`);
      }

      return (
        <Form.Item
          key={fullKey}
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
    const newFormValues = JSON.parse(JSON.stringify(formValues));
    formValues = processFormValues(newFormValues);
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
          if (typeof item === 'object' && !Array.isArray(item)) {
            // Check if the object has only one key named "Item"
            const keys = Object.keys(item);
            if (keys.length === 1 && keys[0] === 'Item') {
              result += `${indent}  - ${quoteIfString(item.Item)}\n`;
            } else {
              // Handle the first key-value pair of the object directly following the '-'
              let firstEntry = true;
              result += `${indent}  - `;
              Object.entries(item).forEach(([innerKey, innerValue], i) => {
                if (firstEntry) {
                  result += `${innerKey}: ${quoteIfString(innerValue)}`;
                  firstEntry = false;
                } else {
                  result += `\n${indent}    ${innerKey}: ${quoteIfString(innerValue)}`;
                }
              });
              result += '\n';
            }
          } else {
            result += `${indent}  - ${quoteIfString(item)}\n`;
          }
        });
      } else if (typeof value === 'object') {
        result += `${indent}${key}:\n${schemaToYaml(value, indent + '  ')}`;
      } else {
        result += `${indent}${key}: ${quoteIfString(value)}\n`;
      }
    });
    return result;
  }

  function quoteIfString(value) {
    if (typeof value === 'string') {
      const escapedValue = JSON.stringify(value);
      return escapedValue;
    }
    return value;
  }

  function yamlToFormValues(yamlString) {
    try {
      const parsedObj = yaml.load(yamlString);
      let uidCounter = 1;
      const flattenObject = (obj, parentKey = '') => {
        let flatResult = {};
        let currentUid = uidCounter;
        Object.keys(obj).forEach(key => {
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
      return null;
    }
  }

  function processFormValues(obj) {
    if (Array.isArray(obj)) {
      return obj.filter(item => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          // Remove unnecessary fields for the YAML result
          delete item.uid;
          delete item.new;
          delete item.invalid;
          const keys = Object.keys(item);
          const nonEmptyKeys = keys.filter(key => item[key] != null && item[key] !== "");
          if (nonEmptyKeys.length === 0) {
            return false;
          }
        }
        return true;
      }).map(processFormValues);
    } else if (typeof obj === 'object' && obj !== null) {
      const newObj = {};
      Object.keys(obj).forEach(key => {
        newObj[key] = processFormValues(obj[key]);
      });
      return newObj;
    }
    return obj;
  }

  function mergeValues(a, b) {
    const result = { ...b };
    const newA = JSON.parse(JSON.stringify(a));
    a = processFormValues(newA);
    Object.keys(a).forEach(key => {
      // If the key in a exists in b and both are objects, then recursively merge them
      if (
        a[key] != null && key in result &&
        typeof a[key] === 'object' && !Array.isArray(a[key]) &&
        typeof result[key] === 'object' && !Array.isArray(result[key])
      ) {
        result[key] = mergeValues(a[key], result[key]);
      } else if (!a[key] && a[key] !== false) {
        delete result[key];
      } else {
        result[key] = a[key];
      }
      if (Array.isArray(a[key]) && a[key].length === 0) {
        delete result[key];
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
    // Reset the form and other states when the plugin selection changes
    form.resetFields();
    setPluginData(undefined);
    setConfigData(undefined);
    setSchema('');
    setRawConfigurations('');
    setDefaultValue('');
    setCurrentTabKey('form');
  };

  useEffect(() => {
    if (currentTabKey === 'yaml') {
      setDefaultValue(rawConfigurations);
    } else if (currentTabKey === 'form') {
      let en = form.getFieldsValue().enabled;
      let formBefore = form.getFieldsValue();
      form.resetFields();
      if (rawConfigurations) {
        if (yamlToFormValues(rawConfigurations) != null) {
          form.setFieldsValue(yamlToFormValues(rawConfigurations));
        } else {
          form.setFieldsValue(formBefore);
        }
      }
      form.setFieldsValue({
        enabled: en,
      });
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
    if (!getConfigLoading && !getDataLoading && currentTabKey === 'form') {
      const values = form.getFieldsValue();
      const rawValues = yamlToFormValues(rawConfigurations);
      const mergedValues = mergeValues(values, rawValues);
      const scm = formValuesToSchema(mergedValues);
      const yamlString = schemaToYaml(scm);
      setRawConfigurations(yamlString);
    }
  };

  const tryCatchRender = (scm) => {
    try {
      return generateFields(scm);
    } catch (error) {
      console.error(error);
      return <div>{t('misc.invalidSchema')}</div>;
    }
  };

  return (
    <div>
      <Spin spinning={getConfigLoading || getDataLoading || updateLoading}>
        {alertStatus.isShow && (
          <Alert style={{ marginBottom: '10px' }} message={alertStatus.message} type="warning" showIcon />
        )}
        <Form name="basic" form={form} autoComplete="off" layout="vertical" onFieldsChange={fieldChange}>
          <Form.Item label={t('plugins.configForm.enableStatus')} name="enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Tabs activeKey={currentTabKey} onChange={(key) => setCurrentTabKey(key)}>
            <TabPane tab={t('misc.switchToForm')} key="form">
              {!getConfigLoading && !getDataLoading && schema && (
                tryCatchRender(schema.jsonSchema)
              )}
            </TabPane>
            <TabPane tab={t('misc.switchToYAML')} key="yaml">
              {!getConfigLoading && !getDataLoading && (
                <CodeEditor
                  defaultValue={defaultValue}
                  // Set defaultValue as the key to force a refresh of CodeEditor
                  key={defaultValue}
                  onChange={(val) => {
                    setRawConfigurations(val);
                  }}
                />
              )}
            </TabPane>
          </Tabs>
          {!getConfigLoading && !getDataLoading && !isRoutePlugin && !isDomainPlugin && (
            <Space direction="horizontal" style={{ marginTop: '0.5rem' }}>
              <Text>{t('plugins.configForm.globalConfigWarning')}</Text>
            </Space>
          )}
        </Form>
      </Spin>
    </div>
  );
});

export default GlobalPluginDetail;
