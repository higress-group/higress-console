import { ServiceSourceTypes, CustomComponentHandles } from '@/interfaces/service-source';
import { Form, Input, Select, Tabs, Switch, Button } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RedoOutlined, PlusOutlined } from '@ant-design/icons';
import { LlmProvider } from '@/interfaces/llm-provider';
import { getLlmProviders, } from '@/services/llm-provider';
import { Domain } from '@/interfaces/domain';
import { getConsumers } from '@/services/consumer';
import { Consumer } from '@/interfaces/consumer';
import { useRequest } from 'ahooks';
import { getGatewayDomains } from '@/services';
import { RedoOutlinedBtn, HistoryButton, UpstreamsTable } from './Components';

const ConsumerForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { value } = props; 
  const [form] = Form.useForm();
  const [ modelPredicate_enabled, setModelPredicateEnabled] = useState(false);
  const [ fallbackConfig_enabled, setFallbackConfigEnabled] = useState(false);
  const [ authConfig_enabled, setAuthConfigEnabled] = useState(false);
  // 目标AI服务错误提示
  const [upstreamsError, setUpstreamsError] = useState(false);
  const upstreamsRef = useRef<CustomComponentHandles>(null);

  const [llmList, setLlmList] = useState<LlmProvider[]>([]);
  const llmResult = useRequest(getLlmProviders, {
    manual: true,
    onSuccess: (result) => {
      const llmProviders = (result || []) as LlmProvider[];
      llmProviders.sort((i1, i2) => {
        return i1.name.localeCompare(i2.name);
      })
      setLlmList(llmProviders);
    },
  });

  const [consumerList, setConsumerList] = useState<Consumer[]>([]);
  const consumerResult = useRequest(getConsumers, {
    manual: true,
    onSuccess: (result) => {
      const consumers = (result || []) as Consumer[];
      setConsumerList(consumers);
    },
  });

  const [domainsList, setDomainsList] = useState<Domain[]>([]);
  const domainsResult = useRequest(getGatewayDomains, {
    manual: true,
    onSuccess: (result) => {
      const consumers = (result || []) as Domain[];
      setDomainsList(consumers);
    },
  });

  useEffect(() => {
    llmResult.run();
    consumerResult.run();
    domainsResult.run();
    form.resetFields();

    return () => {
      setAuthConfigEnabled(false);
      setFallbackConfigEnabled(false);
      setModelPredicateEnabled(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields();
    },
    handleSubmit: async () => {
      const values = await form.validateFields();
      console.log('values', values)
      
      const upstreams = upstreamsRef.current?.getList();

      if(!upstreams?.length) {
        setUpstreamsError(true);
        return false;
      };

      const { 
        name='', 
        domains=[],
        modelPredicate_enabled=false,
        modelPredicate_prefix='',
        fallbackConfig_upstreams=[],
        fallbackConfig_strategy='',
        authConfig_allowedConsumers=[]
      } = values; 

      const payload = {
        name,
        domains,

        modelPredicate: {
          enabled: modelPredicate_enabled,
        },

        upstreams: upstreams,

        fallbackConfig: {
          enabled: fallbackConfig_enabled,
        },

        authConfig:{
          enabled: authConfig_enabled,
        }
      };

      if(modelPredicate_enabled) {
        payload['modelPredicate']['prefix'] = modelPredicate_prefix;
      };

      if(fallbackConfig_enabled) {
        payload['fallbackConfig']['upstreams'] = fallbackConfig_upstreams;
        payload['fallbackConfig']['strategy'] = fallbackConfig_strategy;
      };

      if(authConfig_enabled) {
        payload['authConfig']['consuallowedConsumersmer'] = authConfig_allowedConsumers;
      };

      return payload;
    },
  }));

  return (
    <Form
      form={form}
      layout="vertical"
    >
      {/* 名称 */}
      <Form.Item
        label={t('llmProvider.providerForm.label.name')}
        required
        name="name"
        rules={[
          {
            required: true,
            message: t('llmProvider.providerForm.placeholder.name'),
          },
        ]}
      >
        <Input
          showCount
          allowClear
          maxLength={200}
          disabled={value}
          placeholder={t('llmProvider.providerForm.rules.name')}
        />
      </Form.Item>

      {/* 域名 */}
      <div style={{ display: 'flex' }}>
        <Form.Item
          style={{ flex: 1, marginRight: '8px' }}
          label={"域名"}
          required
          name="domains"
          rules={[
            {
              required: true,
              message: "请输入域名",
            },
          ]}
          extra={(<HistoryButton text={"创建域名"} path={"/domain"} />)}
        >
          <Select
            placeholder={"请选择域名"}
            mode="multiple"
          >
            {
              domainsList.map((item,index) => {
                return (
                  <Select.Option 
                    key={index} 
                    value={item.name}
                  >
                    {item.name}
                  </Select.Option>
                )
              })
            }
          </Select>
        </Form.Item>

        <RedoOutlinedBtn getList={domainsResult}/>
      </div>


      {/* 是否启用基于模型的路由匹配规则 */}
      <Form.Item 
        name="modelPredicate_enabled" 
        label="是否启用基于模型的路由匹配规则"
        valuePropName="checked"
        initialValue={false}
        extra="启用后，若请求目标服务失败，网关会改为请求降级服务。"
      >
        <Switch onChange={e => setModelPredicateEnabled(e)}/>
      </Form.Item>

      {/* 匹配本路由所需的模型名称前缀（不包含结尾的“/”） */}
      {
        modelPredicate_enabled?
        <Form.Item 
          name="modelPredicate_prefix" 
          label="匹配本路由所需的模型名称前缀"
          required
          rules={[
            {
              required: true,
              message: "请输入域名",
            },
          ]}
        >
          <Input.TextArea 
            placeholder={`匹配本路由所需的模型名称前缀（不包含结尾的“/”）`}
            rows={2}
          />
        </Form.Item> :null
      }

      {/* 目标AI服务 upstreams */}
      <div style={{ display: 'flex' }}>
        <Form.Item
          style={{ flex: 1, marginRight: '8px' }}
          label={"目标AI服务"}
          required
          hasFeedback={upstreamsError}
          validateStatus={upstreamsError? "error":''}
          help={upstreamsError? "请选择并添加目标AI服务": null}
          name="upstreams_target"
          // rules={[
          //   {
          //     required: true,
          //     message: "请输入目标AI服务",
          //   },
          // ]}
          extra={(<HistoryButton text={"创建AI服务"} path={"/ai/provider"} />)}
        >
          <Select placeholder={"请选择"}>
            {
              llmList.map((item,index) => {
                return (
                  <Select.Option 
                    key={index} 
                    value={item.name}
                  >
                    {item.name}
                  </Select.Option>
                )
              })
            }
          </Select>
        </Form.Item>

        <Form.Item label="&nbsp;">
          <Button 
            style={{ marginRight: '8px' }}
            onClick={() => {
              const upstreams_target = form.getFieldValue('upstreams_target');

              if(upstreams_target) {
                const target_item = llmList.find(i => i.name === upstreams_target) ?? {};
                upstreamsRef.current?.addItem(target_item);

                form.resetFields(["upstreams_target"]);
                setUpstreamsError(false);
              };
            }} 
            icon={<PlusOutlined />}
          />
        </Form.Item>
        <RedoOutlinedBtn getList={llmResult}/>
      </div>
      <Form.Item
        hasFeedback={upstreamsError}
        validateStatus={upstreamsError? "error":''}
        help={upstreamsError? "请选择并添加目标AI服务": null}
      >
        <UpstreamsTable ref={upstreamsRef}/>
      </Form.Item>

      {/* 降级服务 */}
      <Form.Item 
        name="fallbackConfig_enabled" 
        label="降级服务"
        valuePropName="checked"
        initialValue={false}
        extra="启用后，若请求目标服务失败，网关会改为请求降级服务。"
      >
        <Switch onChange={e => setFallbackConfigEnabled(e)}/>
      </Form.Item>

      {
        fallbackConfig_enabled?
        <>
          {/* 降级服务列表 */}
          <div style={{ display: 'flex' }}>
            <Form.Item
              style={{ flex: 1, marginRight: '8px' }}
              label={"降级服务列表"}
              required
              name="fallbackConfig_upstreams"
              rules={[
                {
                  required: true,
                  message: "请选择降级服务",
                },
              ]}
            >
              <Select 
                mode="multiple"
                placeholder={"请选择降级服务"}
              >
                {
                  llmList.map((item,index) => {
                    return (
                      <Select.Option 
                        key={index} 
                        value={item.name}
                      >
                        {item.name}
                      </Select.Option>
                    )
                  })
                }
              </Select>
            </Form.Item>

            <RedoOutlinedBtn getList={llmResult}/>
          </div>

          {/* 路由降级策略 */}
          <Form.Item
            style={{ flex: 1, marginRight: '8px' }}
            label={"路由降级策略"}
            required
            name="fallbackConfig_strategy"
            initialValue={"RAND"}
            rules={[
              {
                required: true,
                message: "请选择路由降级策略",
              },
            ]}
          >
            <Select placeholder={"请选择"}>
              <Select.Option value={'RAND'}>随机选择列表中的一个服务提供商进行降级，只降级一次（默认）</Select.Option>
              <Select.Option value={'SEQ'}>按服务提供商列表顺序逐个尝试降级，直至请求成功或所有提供商均尝试过为止</Select.Option>
            </Select>
          </Form.Item>
        </>
        :null
      }

      {/* 请求认证设置 */}
      <Form.Item 
        name="authConfig_enabled" 
        label="是否启用请求认证"
        valuePropName="checked"
        initialValue={false}
        extra="启用后，只有包含指定消费者认证信息的请求可以请求本路由。"
      >
        <Switch onChange={e => setAuthConfigEnabled(e)}/>
      </Form.Item>

      {/* 允许请求本路由的消费者名称列表 */}
      {authConfig_enabled?
      <div style={{ display: 'flex' }}>
        <Form.Item
          style={{ flex: 1, marginRight: '8px' }}
          label={"允许请求本路由的消费者名称列表"}
          required
          name="authConfig_allowedConsumers"
          rules={[
            {
              required: true,
              message: "请选择允许请求本路由的消费者名称列表",
            },
          ]}
          extra={(<HistoryButton text={"创建消费者"} path={"/consumer"} />)}
        >
          <Select 
            mode="multiple"
            placeholder={"请选择允许请求本路由的消费者名称列表"}
          >
            {
              consumerList.map((item,index) => {
                return (
                  <Select.Option 
                    key={index} 
                    value={item.name}
                  >
                    {item.name}
                  </Select.Option>
                )
              })
            }
          </Select>
        </Form.Item>

        <RedoOutlinedBtn getList={consumerResult}/>
      </div>
      :null}
    </Form>
  );
});

export default ConsumerForm;
