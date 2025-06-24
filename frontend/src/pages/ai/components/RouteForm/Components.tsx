import { MatchType } from '@/interfaces/route';
import { FormOutlined, MinusCircleOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Empty, Form, Input, Popover, Select } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { modelMapping2String, string2ModelMapping } from './util';

// 刷新按钮
const RedoOutlinedBtn = (props) => {
  const { getList } = props;

  const handleClick = async () => {
    getList && getList.run();
  };

  return (
    <Form.Item label="&nbsp;">
      <Button
        onClick={handleClick}
        disabled={getList && getList.loading}
        icon={<RedoOutlined spin={getList && getList.loading} />}
      />
    </Form.Item>
  )
};

// 跳转按钮
const HistoryButton = (props) => {
  const { text = '', path = '' } = props;
  return (
    <a href={path} target="_blank">{text}</a>
  )
};

// 模型映射编辑器
const ModelMappingEditor = (props) => {
  const { t } = useTranslation();
  const { value, style, options, onChange } = props;
  const [form] = Form.useForm();
  const [popoverOpen, setPopoverOpen] = useState(false);

  interface ModelMapping {
    key: string;
    matchType: MatchType;
    target: string;
  }

  const handleChange = (e) => {
    onChange && onChange(e);
  };

  const onConfirm = () => {
    downloadFromPopoverForm();
    closePopover();
  };

  const onCancel = () => {
    closePopover();
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  const onPopoverOpenChange = (open) => {
    setPopoverOpen(open);
    open && uploadToPopoverForm();
  };

  const uploadToPopoverForm = () => {
    const modelMappingObj = string2ModelMapping(value);
    const formValues = {
      defaultMapping: '',
      modelMappings: new Array<ModelMapping>(),
    }
    for (const [key, target] of Object.entries(modelMappingObj)) {
      if (!key) {
        continue;
      }
      if (key === '*') {
        formValues.defaultMapping = target;
      } else if (key.endsWith('*')) {
        const prefix = key.replace(/\*+$/, '');
        formValues.modelMappings.push({
          key: prefix,
          matchType: MatchType.PRE,
          target,
        });
      } else {
        formValues.modelMappings.push({
          key,
          matchType: MatchType.EQUAL,
          target,
        });
      }
    }
    form.setFieldsValue(formValues);
  };

  const downloadFromPopoverForm = () => {
    form.validateFields().then((values) => {
      const modelMappingObj: Record<string, string> = {};
      const modelMappings = values.modelMappings || [];
      for (const modelMapping of modelMappings) {
        if (!modelMapping.key || !modelMapping.matchType) {
          continue;
        }
        switch (modelMapping.matchType) {
          case MatchType.EQUAL:
            modelMappingObj[modelMapping.key] = modelMapping.target || '';
            break;
          case MatchType.PRE:
            modelMappingObj[modelMapping.key + '*'] = modelMapping.target || '';
            break;
          default:
            throw new Error(`Unsupported match type: ${modelMapping.matchType}`);
        }
      }
      if (values.defaultMapping) {
        modelMappingObj['*'] = values.defaultMapping;
      }
      handleChange(modelMapping2String(modelMappingObj));
    });
  };

  const popoverContent = (
    <Form form={form} layout="vertical">
      <Form.Item
        label={t('aiRoute.routeForm.modelMapping.default')}
        name="defaultMapping"
      >
        <Input
          allowClear
          maxLength={63}
          placeholder={t('aiRoute.routeForm.modelMapping.mappingTargetPlaceholder_full') || ''}
        />
      </Form.Item>
      <Form.Item label={t('aiRoute.routeForm.modelMapping.advanced')}>
        <Form.List name="modelMappings" initialValue={[{}]} >
          {(fields, { add, remove }) => (
            <>
              <div className="ant-table ant-table-small">
                <div className="ant-table-content">
                  <table style={{ tableLayout: "auto" }}>
                    <thead className="ant-table-thead">
                      <tr>
                        <th className="ant-table-cell" style={{ width: "150px" }} >{t("aiRoute.routeForm.modelMapping.key")}</th>
                        <th className="ant-table-cell" style={{ width: "150px" }} >{t("aiRoute.routeForm.modelMatchType")}</th>
                        <th className="ant-table-cell" style={{ width: "150px" }} >{t("aiRoute.routeForm.modelMapping.target")}</th>
                        <th className="ant-table-cell" style={{ width: "60px" }} >{t("misc.action")}</th>
                      </tr>
                    </thead>
                    <tbody className="ant-table-tbody">
                      {
                        fields.length && fields.map(({ key, name, ...restField }, index) => (
                          <tr className="ant-table-row ant-table-row-level-0" key={key}>
                            <td className="ant-table-cell">
                              <Form.Item
                                {...restField}
                                name={[name, 'key']}
                                noStyle
                              >
                                <Input allowClear />
                              </Form.Item>
                            </td>
                            <td className="ant-table-cell">
                              <Form.Item
                                name={[name, 'matchType']}
                                noStyle
                              >
                                <Select>
                                  {
                                    [
                                      { name: MatchType.EQUAL, label: t("route.matchTypes.EQUAL") }, // 精确匹配
                                      { name: MatchType.PRE, label: t("route.matchTypes.PRE") }, // 前缀匹配
                                    ].map((item) => (<Select.Option key={item.name} value={item.name}>{item.label} </Select.Option>))
                                  }
                                </Select>
                              </Form.Item>
                            </td>
                            <td className="ant-table-cell">
                              <Form.Item
                                {...restField}
                                name={[name, 'target']}
                                noStyle
                              >
                                <Input allowClear placeholder={t('aiRoute.routeForm.modelMapping.mappingTargetPlaceholder_simple') || ''} />
                              </Form.Item>
                            </td>
                            <td className="ant-table-cell">
                              <MinusCircleOutlined onClick={() => remove(name)} />
                            </td>
                          </tr>
                        )) || (
                          <tr className="ant-table-row ant-table-row-level-0">
                            <td className="ant-table-cell" colSpan={4}>
                              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: 0 }} />
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add()}>{t("aiRoute.routeForm.modelMapping.add")}</Button>
              </div>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item
        style={{
          marginBottom: 0,
          textAlign: 'right',
        }}
        wrapperCol={{ span: 24 }}
      >
        <Button type="primary" style={{ marginRight: '0.5rem' }} onClick={onConfirm}>
          {t('misc.confirm')}
        </Button>
        <Button onClick={onCancel}>
          {t('misc.cancel')}
        </Button>
      </Form.Item>
    </Form>
  )

  return (
    <div style={style}>
      <AutoComplete
        className="model-mapping-editor"
        options={options}
        style={{ width: 'calc(100% - 32px)' }}
        value={value}
        onChange={handleChange}
        filterOption={(inputValue, option: any) => {
          return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }}
      >
        <Input />
      </AutoComplete>
      <Popover
        trigger="click"
        content={popoverContent}
        open={popoverOpen}
        onOpenChange={onPopoverOpenChange}
      >
        <Button icon={<FormOutlined />} />
      </Popover>
    </div>
  );
}

export {
  HistoryButton,
  ModelMappingEditor,
  RedoOutlinedBtn,
};
