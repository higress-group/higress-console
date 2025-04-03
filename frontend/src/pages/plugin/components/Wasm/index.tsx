import { ImagePullPolicy, PluginPhase, WasmPluginData } from '@/interfaces/wasm-plugin';
import { Button, Drawer, Form, Input, InputNumber, Select, Space } from 'antd';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface WasmFormRef {
  open: (v?: WasmPluginData) => void;
  close: () => void;
}

interface Props {
  onSubmit?: (v: WasmPluginData, isEdit?: boolean) => void;
}

export const WasmPluginDrawer = forwardRef((props: Props, ref) => {
  const { t } = useTranslation();

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
      title={!editData ? t('plugins.custom.title.add') : t('plugins.custom.title.edit')}
      placement="right"
      destroyOnClose
      onClose={onCloseDrawer}
      open={open}
      width={660}
      extra={
        <Space>
          <Button onClick={onCloseDrawer}>{t('misc.cancel')}</Button>
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
            {t('misc.save')}
          </Button>
        </Space>
      }
    >
      <WasmForm ref={formRef} editData={editData} />
    </Drawer>
  );
});

const WasmForm = forwardRef((props: { editData?: WasmPluginData }, ref) => {
  const { t } = useTranslation();

  const phaseOptions = [
    { value: PluginPhase.UNSPECIFIED, label: t('plugins.phases.unspecified') },
    { value: PluginPhase.AUTHN, label: t('plugins.phases.authn') },
    { value: PluginPhase.AUTHZ, label: t('plugins.phases.authz') },
    { value: PluginPhase.STATS, label: t('plugins.phases.stats') },
  ];

  const imagePullPolicyOptions = [
    { value: ImagePullPolicy.UNSPECIFIED, label: t('plugins.imagePullPolicy.unspecified') },
    { value: ImagePullPolicy.IF_NOT_PRESENT, label: t('plugins.imagePullPolicy.ifNotPresent') },
    { value: ImagePullPolicy.ALWAYS, label: t('plugins.imagePullPolicy.always') },
  ];

  const { editData } = props;

  const isEdit = !!editData;

  if (editData) {
    editData.imageUrl = editData.imageVersion ? `${editData.imageRepository}:${editData.imageVersion}` : editData.imageRepository;
    editData.phase = editData.phase || PluginPhase.UNSPECIFIED;
    editData.imagePullPolicy = editData.imagePullPolicy || ImagePullPolicy.UNSPECIFIED;
  }

  const builtIn = !!(editData && editData.builtIn);

  const [form] = Form.useForm();

  const onSubmit = async () => {
    const data = Object.assign({
      version: 0,
      category: 'custom',
      builtIn: false,
    }, editData, await form.validateFields());
    const imageUrl: string = data.imageUrl || '';
    const protocolIndex = imageUrl.indexOf('://');
    const lastColonIndex = imageUrl.lastIndexOf(':');
    const isOciImage = protocolIndex === -1 || imageUrl.startsWith('oci://');
    if (isOciImage && lastColonIndex > protocolIndex) {
      data.imageRepository = imageUrl.substring(0, lastColonIndex);
      data.imageVersion = imageUrl.substring(lastColonIndex + 1);
    } else {
      data.imageRepository = imageUrl;
      data.imageVersion = '';
    }
    delete data.imageUrl;
    if (!builtIn) {
      data.title = data.name;
    }
    return data;
  };

  useImperativeHandle(ref, () => ({
    submit: onSubmit,
  }));

  return (
    <div>
      <Form name="basic" autoComplete="off" form={form} layout="vertical" initialValues={editData}>
        <Form.Item
          label={t('plugins.custom.name')}
          name="name"
          rules={[
            { required: true },
            {
              pattern: /^[a-zA-Z0-9]*([a-zA-Z0-9.-]*)[a-zA-Z0-9]$/,
              message: t('plugins.custom.namePattern') || '',
            },
          ]}
        >
          <Input disabled={isEdit} placeholder={t('plugins.custom.namePlaceholder') || ''} />
        </Form.Item>
        <Form.Item label={t('plugins.custom.description')} name="description">
          <Input.TextArea disabled={builtIn} placeholder={t('plugins.custom.descriptionPlaceholder') || ''} />
        </Form.Item>
        <Form.Item
          label={t('plugins.custom.imageUrl')}
          name="imageUrl"
          rules={[{ required: true }]}
          tooltip={t('plugins.custom.imageUrlTooltip')}
        >
          <Input
            placeholder={t('plugins.custom.imageUrlPlaceholder') || ''}
          />
        </Form.Item>
        <Form.Item label={t('plugins.custom.phase')} name="phase" rules={[{ required: true }]}>
          <Select options={phaseOptions} placeholder={t('plugins.custom.phasePlaceholder')} />
        </Form.Item>
        <Form.Item label={t('plugins.custom.priority')} name="priority" rules={[{ required: true }]}>
          <InputNumber max={1000} min={1} style={{ width: '100%' }} placeholder={t('plugins.custom.priorityPlaceholder') || ''} />
        </Form.Item>
        <Form.Item label={t('plugins.custom.imagePullPolicy')} name="imagePullPolicy" rules={[{ required: true }]}>
          <Select options={imagePullPolicyOptions} />
        </Form.Item>
        <Form.Item label={t('plugins.custom.imagePullSecret')} name="imagePullSecret">
          <Input placeholder={t('plugins.custom.imagePullSecretPlaceholder') || ''} />
        </Form.Item>
      </Form>
    </div>
  );
});
