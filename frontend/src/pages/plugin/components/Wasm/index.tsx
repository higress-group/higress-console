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

  if (editData) {
    editData.imageUrl = editData.imageRepository + ':' + editData.imageVersion;
  }

  const [form] = Form.useForm();

  const onSubmit = async () => {
    const values = await form.validateFields();
    const imageUrl: string = values.imageUrl || '';
    const lastColonIndex = imageUrl.lastIndexOf(':');
    const imageRepository = lastColonIndex == -1 ? imageUrl : imageUrl.substring(0, lastColonIndex);
    const imageVersion = lastColonIndex == -1 ? '' : imageUrl.substring(lastColonIndex + 1);
    return {
      ...values,
      category: 'custom',
      builtIn: false,
      icon: '',
      imageRepository,
      imageVersion,
      title: values.name,
      version: editData?.version || 0,
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
              message: '包含大小写字母，数字以及特殊字符(-.)，且不能以特殊字符开头和结尾',
            },
          ]}
        >
          <Input disabled={isEdit} placeholder={'包含大小写字母，数字以及特殊字符(-.)，且不能以特殊字符开头和结尾'} />
        </Form.Item>
        <Form.Item label="插件描述" name="description">
          <Input.TextArea placeholder={'请输入插件描述'} />
        </Form.Item>
        <Form.Item
          label="镜像地址"
          name="imageUrl"
          rules={[{ required: true }]}
          tooltip="请输入镜像地址，例如 higress-registry.cn-hangzhou.cr.aliyuncs.com/plugins/request-block:1.0.0"
        >
          <Input
            placeholder={
              '请输入镜像地址，例如 higress-registry.cn-hangzhou.cr.aliyuncs.com/plugins/request-block:1.0.0'
            }
          />
        </Form.Item>
        <Form.Item label="插件执行阶段" name="phase" rules={[{ required: true }]}>
          <Select options={phaseOptions} placeholder="执行优先级 认证>鉴权>统计>默认" />
        </Form.Item>
        <Form.Item label="插件执行优先级" name="priority" rules={[{ required: true }]}>
          <InputNumber max={1000} min={1} style={{ width: '100%' }} placeholder="范围1～1000，值越大越优先" />
        </Form.Item>
      </Form>
    </div>
  );
});
