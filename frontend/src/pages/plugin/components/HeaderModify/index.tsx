import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Input, Button, Table, Select, Space, Switch } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './index.module.css';
import { getheaderListByHeaderControl, getHeaderControlByHeaderList } from './utils';

const HeaderModify = forwardRef((props, ref) => {
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
        title: 'Header类型',
        dataIndex: 'headerType',
        key: 'headerType',
        width: 100,
        render(text, field) {
          // 这里的写法是 Form.List 的方法 https://ant.design/components/form-cn/#components-form-demo-dynamic-form-items
          return (
            <Form.Item
              shouldUpdate
              rules={[{ required: true, message: '请选择' }]}
              name={[field.name, 'headerType']}
              fieldKey={[field.fieldKey, 'headerType']}
            >
              <Select style={{ width: '100px' }}>
                <Select.Option value="request">请求</Select.Option>
                <Select.Option value="response">响应</Select.Option>
              </Select>
            </Form.Item>
          );
        },
      },
      {
        title: '操作类型',
        dataIndex: 'actionType',
        key: 'actionType',
        width: 100,
        render(text, field) {
          return (
            <Form.Item
              shouldUpdate
              rules={[{ required: true, message: '请选择' }]}
              name={[field.name, 'actionType']}
              fieldKey={[field.fieldKey, 'actionType']}
            >
              <Select style={{ width: '100px' }}>
                <Select.Option value="add">新增</Select.Option>
                <Select.Option value="set">更新</Select.Option>
                <Select.Option value="remove">删除</Select.Option>
              </Select>
            </Form.Item>
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
              rules={[{ required: true, message: '请输入' }]}
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
        render(text, field, record) {
          return (
            <Form.Item
              shouldUpdate
              rules={[{ required: true, message: '请输入' }]}
              name={[field.name, 'value']}
              fieldKey={[field.fieldKey, 'value']}
            >
              <Input />
            </Form.Item>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        className: 'operate',
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
          <Form.Item label="开启状态" name="enabled" valuePropName="checked">
            <Switch checked />
          </Form.Item>
          <Button type="link" block onClick={() => globalAddRowItemFn && globalAddRowItemFn()}>
            添加新规则
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
