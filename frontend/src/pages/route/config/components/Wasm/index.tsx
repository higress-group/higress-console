import { Form, Button, Input, InputNumber, Select, Drawer, Space, Spin } from 'antd';
import { useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { WasmPluginData } from '@/interfaces/route';

const { Option } = Select;

export interface WasmFormRef {
  open: (v?: WasmPluginData) => void;
  close: () => void;
}

interface Props {
  onSubmit?: (v: WasmPluginData, isEdit?: boolean) => void;
}

export const WasmPluginDrawer = forwardRef((props: Props, ref) => {
  const { onSubmit } = props;
  const formRef = useRef<{ submit: () => Promise<WasmPluginData> }>(null);
  const [editData, setEditData] = useState<WasmPluginData>();

  const [open, setOpen] = useState(false);

  const onCloseDrawer = () => {
    setEditData(undefined);
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    open: (data?: WasmPluginData) => {
      setEditData(data);
      setOpen(true);
    },
    close: onCloseDrawer,
  }));

  return (
    <Drawer
      title={!editData ? '创建插件' : `编辑${editData.name}`}
      placement="right"
      destroyOnClose
      onClose={onCloseDrawer}
      open={open}
      width={660}
      extra={
        <Space>
          <Button onClick={onCloseDrawer}>取消</Button>
          <Button
            type="primary"
            onClick={async () => {
              const submitFun = formRef.current?.submit;
              if (submitFun) {
                const resData: WasmPluginData = await submitFun();
                onSubmit?.(
                  {
                    ...resData,
                  },
                  !!editData,
                );
              }
            }}
          >
            保存
          </Button>
        </Space>
      }
    >
      <WasmForm ref={formRef} editData={editData} />
    </Drawer>
  );
});

const phaseOptions = [
  { value: 'UNSPECIFIED_PHASE', label: '默认阶段' },
  { value: 'AUTHN', label: '认证阶段' },
  { value: 'AUTHZ', label: '鉴权阶段' },
  { value: 'STATS', label: '统计阶段' },
];

const WasmForm = forwardRef((props: { editData?: WasmPluginData }, ref) => {
  const { editData } = props;

  const isEdit = !!editData;

  const [form] = Form.useForm();

  const onSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    const imageVersion = values.imageRepository?.split(':')?.pop() || '';
    return {
      category: 'custom',
      builtIn: false,
      icon: '',
      imageVersion,
      title: values.name,
      version: editData?.version || 0,
      ...values,
    };
  };

  useImperativeHandle(ref, () => ({
    submit: onSubmit,
  }));

  return (
    <div>
      <Form name="basic" autoComplete="off" form={form} layout="vertical" initialValues={editData}>
        <Form.Item
          label="插件名称"
          name="name"
          rules={[
            { required: true },
            {
              pattern: /^[a-zA-Z0-9]*([a-zA-Z0-9.-]*)[a-zA-Z0-9]$/,
              message: '包含小写字母，数字以及特殊字符(-.)，且不能以特殊字符开头和结尾',
            },
          ]}
        >
          <Input disabled={isEdit} placeholder={'包含小写字母，数字以及特殊字符(-.)，且不能以特殊字符开头和结尾'} />
        </Form.Item>
        <Form.Item label="插件描述" name="description">
          <Input.TextArea placeholder={'请输入插件描述'} />
        </Form.Item>
        <Form.Item label="wasm镜像" name="imageRepository" rules={[{ required: true }]}>
          <Input placeholder={'请输入wasm镜像'} />
        </Form.Item>
        <Form.Item label="插件执行阶段" name="phase" rules={[{ required: true }]}>
          <Select options={phaseOptions} />
        </Form.Item>
        <Form.Item label="插件执行优先级" name="priority" rules={[{ required: true }]}>
          <InputNumber max={1000} min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </div>
  );
});
