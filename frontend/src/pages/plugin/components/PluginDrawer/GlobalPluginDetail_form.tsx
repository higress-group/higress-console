import { Alert, Divider, Form, Spin, Switch, message, Space, Typography, Input, Button } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import * as servicesApi from '@/services';
import { useRequest } from 'ahooks';
import { t } from 'i18next';
import { useSearchParams } from 'ice';
import ArrayForm from './ArrayForm'
const { Text } = Typography;

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

const GlobalPluginDetail_form = forwardRef((props: IProps, ref) => {
  const { data, onSuccess } = props;
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

  const [pluginData, setPluginData] = useState<IPluginData>();
  const [schema, setSchema] = useState('');

  const [rawConfigurations, setRawConfigurations] = useState('');
  const [defaultValue, setDefaultValue] = useState('');

  const { loading: getDataLoading, run: getData } = useRequest(pluginInstancesApi.get, {
    manual: true,
    onSuccess: (res: IPluginData) => {
      setPluginData(res);
      setRawConfigurations(res.rawConfigurations);
      setDefaultValue(res.rawConfigurations);
      //console.log('default_raw:', res.rawConfigurations);
      getConfig(pluginName);
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



  function generateFields(scm,  prefix = '') {
    const properties =scm.properties;
    const dict = {};
    if(!properties){
      return (<div>inValid schema!</div>)
    }
    return Object.entries(properties).map(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (value.type === 'object' && value.properties) {
        // 如果是嵌套的对象，则递归生成子表单
        return generateFields(value,  fullKey);
      }
      
      const { type, title } = value;
      //console.log(rawConfigurations);
      let fieldComponent;
      switch (type) {
        case 'string':
          fieldComponent = <Input />;
          break;
        case 'integer':
          fieldComponent = <Input type="number" />;
          break; 
        case 'boolean':
          fieldComponent = <Switch />;
          break;
        case 'array':
          dict[value.items.title]=value.items
          return(
            <Form.Item
          label={fullKey}
          name={fullKey}
          
        >
          <ArrayForm  array={value.items} />
        </Form.Item>
          )
        case 'object':
          return
        default:
          throw new Error(`Unsupported type: ${type}`);
      }
      return (
        <Form.Item
          key={fullKey}
          name={fullKey}
          label={`${title}:`}
        >
          {fieldComponent}
        </Form.Item>
      );
      
    });
  }

  function formValuesToSchema(formValues) {
    const result = {};
    function processFormValues(formValues) {
      // 创建一个新对象，以避免修改原始对象
      const newFormValues = JSON.parse(JSON.stringify(formValues));
    
      // 遍历所有表单字段
      for (const key in newFormValues) {
        if (newFormValues.hasOwnProperty(key)) {
          const value = newFormValues[key];
    
          // 检查字段是否为数组
          if (Array.isArray(value)) {
            // 如果数组中的元素是字典
            if (value.every(item => typeof item === 'object' && !Array.isArray(item))) {
              // 遍历数组中的每个对象
              value.forEach(item => {
                // 如果对象有 uid 属性，则删除它
                delete item.uid;
    
                // 如果对象有 Item 属性，则将数组转换为字符串数组
                if ('Item' in item) {
                  newFormValues[key] = value.map(obj => obj.Item);
                  return newFormValues; // 一旦转换，无需继续遍历
                }
              });
            }
          }
        }
      }
    
      return newFormValues;
    }
    formValues=processFormValues(formValues);
    
    function buildObjectFromPath(path, value) {
      const parts = path.split('.');
      let current = result;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          // 如果当前层级不存在，则创建空对象
          current[part] = {};
        }
        current = current[part];
      }
      // 设置最后一级的值
      current[parts[parts.length - 1]] = value;
    }
  
    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== undefined) {
        buildObjectFromPath(key, value);
      }
    });
  
    return result;
  }

  function objectToYaml(obj, indent = ''): string {
    let result = '';
  
    Object.entries(obj).forEach(([key, value]) => {
      if (value === null) {
        result += `${indent}${key}: null\n`;
      } else if (Array.isArray(value)) {
        result += `${indent}${key}:\n`;
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            result += `${indent}  -\n${objectToYaml(item, indent + '    ')}`;
          } else {
            result += `${indent}  - ${item}\n`;
          }
        });
      } else if (typeof value === 'object') {
        result += `${indent}${key}:\n${objectToYaml(value, indent + '  ')}`;
      } else {
        result += `${indent}${key}: ${value}\n`;
      }
    });
  
    return result;
  }

  const onSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
/*     console.log('form',form.getFieldsValue());
    const scm=formValuesToSchema(values)
    console.log('scm',scm)
    const yamlString = objectToYaml(scm);
    console.log('yaml',yamlString);
    
    setRawConfigurations(yamlString); */
    console.log(rawConfigurations);
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


  useImperativeHandle(ref, () => ({
    submit: onSubmit,
  }));

  const alertStatus = useMemo(() => {
    return {
      isShow: (isRoutePlugin || isDomainPlugin) && queryName,
      message: isRoutePlugin ? t('plugins.configForm.targetRoute') + queryName : t('plugins.configForm.targetDomain') + queryName,
    };
  }, [isRoutePlugin, isDomainPlugin, queryName]);

  const fieldChange=()=>{
    if(!getConfigLoading && !getDataLoading){
      const values = form.getFieldsValue();
      const scm=formValuesToSchema(values);
      const yamlString = objectToYaml(scm);
      setRawConfigurations(yamlString);
    }
    
  }

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

          {!getConfigLoading && !getDataLoading && schema && (
            generateFields(schema)
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

export default GlobalPluginDetail_form;
