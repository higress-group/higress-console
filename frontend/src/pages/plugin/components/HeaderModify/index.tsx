import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space, Switch, Table } from 'antd';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';
import { getHeaderControlByHeaderList, getheaderListByHeaderControl } from './utils';

const HeaderModify = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const data = props?.data || {};

  const [form] = Form.useForm();

  let globalAddRowItemFn;

  useEffect(() => {
    const { headerControl } = data;
    const { enabled = false } = headerControl || {};
    const headerList = getheaderListByHeaderControl(headerControl);

    form.setFieldsValue({
      enabled,
      headerList,
    });
  }, []);

  const onSubmit = async () => {
    await form.validateFields();
    const formData = form.getFieldsValue();
    const headerControl = getHeaderControlByHeaderList(formData);
    return { headerControl };
  };

  useImperativeHandle(ref, () => ({
    submit: onSubmit,
  }));

  const getColumns = (add, remove) => {
    if (!globalAddRowItemFn) globalAddRowItemFn = add;
    return [
      {
        title: t('plugins.builtIns.headerControl.headerType'),
        dataIndex: 'headerType',
        key: 'headerType',
        width: 100,
        render(text, field) {
          // 这里的写法是 Form.List 的方法 https://ant.design/components/form-cn/#components-form-demo-dynamic-form-items
          return (
            <Form.Item
              shouldUpdate
              rules={[{
                required: true,
                message: t('plugins.builtIns.headerControl.headerTypeRequired') || '',
              }]}
              name={[field.name, 'headerType']}
              fieldKey={[field.fieldKey, 'headerType']}
            >
              <Select style={{ width: '100px' }}>
                <Select.Option value="request">{t('plugins.builtIns.headerControl.request')}</Select.Option>
                <Select.Option value="response">{t('plugins.builtIns.headerControl.response')}</Select.Option>
              </Select>
            </Form.Item>
          );
        },
      },
      {
        title: t('plugins.builtIns.headerControl.actionType'),
        dataIndex: 'actionType',
        key: 'actionType',
        width: 100,
        render(text, field) {
          return (
            <Form.Item
              shouldUpdate
              rules={[{
                required: true,
                message: t('plugins.builtIns.headerControl.actionTypeRequired') || '',
              }]}
              name={[field.name, 'actionType']}
              fieldKey={[field.fieldKey, 'actionType']}
            >
              <Select style={{ width: '100px' }}>
                <Select.Option value="add">{t('plugins.builtIns.headerControl.add')}</Select.Option>
                <Select.Option value="set">{t('plugins.builtIns.headerControl.set')}</Select.Option>
                <Select.Option value="remove">{t('plugins.builtIns.headerControl.remove')}</Select.Option>
              </Select>
            </Form.Item >
          );
        },
      },
      {
        title: 'Header Key',
        dataIndex: 'key',
        key: 'key',
        render(text, field) {
          return (
            <Form.Item
              shouldUpdate
              rules={[{
                required: true,
                message: t('plugins.builtIns.headerControl.valueRequired') || '',
              }]}
              name={[field.name, 'key']}
              fieldKey={[field.fieldKey, 'key']}
            >
              <Input />
            </Form.Item>
          );
        },
      },

      {
        title: 'Header Value',
        key: 'value',
        dataIndex: 'value',
        render(text, field, index) {
          return (
            <Form.Item
              shouldUpdate
              rules={[{
                validator(_, value) {
                  const headerList = form.getFieldValue('headerList');
                  if (!Array.isArray(headerList) || headerList.length === 0) {
                    return '';
                  }
                  const header = headerList[index];
                  if (header.actionType !== 'remove' && !value) {
                    return Promise.reject(new Error(t('plugins.builtIns.headerControl.valueRequired') || ''));
                  }
                  return Promise.resolve();
                },
              }]}
              name={[field.name, 'value']}
              fieldKey={[field.fieldKey, 'value']}
            >
              <Input />
            </Form.Item>
          );
        },
      },
      {
        title: t('plugins.builtIns.headerControl.action'),
        dataIndex: 'action',
        className: 'action',
        width: 50,
        render(text, field) {
          return (
            <>
              <Button type="link" block onClick={() => remove(field.name)}>
                <DeleteOutlined />
              </Button>
            </>
          );
        },
      },
    ];
  };

  return (
    <div className={styles.headerModify}>
      <Form
        className="table-edit-form"
        form={form}
        initialValues={{
          enabled: true,
          headerList: [
            {
              headerType: 'request',
              actionType: 'add',
              key: 'test',
            },
          ],
        }}
      >
        <Space
          size="middle"
          style={{
            marginBottom: '10px',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Form.Item label={t('plugins.configForm.enableStatus') || ''} name="enabled" valuePropName="checked">
            <Switch checked />
          </Form.Item>
          <Button type="link" block onClick={() => globalAddRowItemFn && globalAddRowItemFn()}>
            {t('plugins.builtIns.headerControl.addNewRule')}
          </Button>
        </Space>
        <Form.List name="headerList">
          {(fields, { add, remove }) => {
            return <Table dataSource={fields} columns={getColumns(add, remove)} rowKey="key" pagination={false} />;
          }}
        </Form.List>
      </Form>
    </div>
  );
});

export default HeaderModify;
