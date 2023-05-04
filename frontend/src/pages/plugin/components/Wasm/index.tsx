import { WasmPluginData } from '@/interfaces/route';
import { Button, Drawer, Form, Input, InputNumber, Select, Space } from 'antd';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

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
    { value: 'UNSPECIFIED_PHASE', label: t('plugins.phases.unspecified') },
    { value: 'AUTHN', label: t('plugins.phases.authn') },
    { value: 'AUTHZ', label: t('plugins.phases.authz') },
    { value: 'STATS', label: t('plugins.phases.stats') },
  ];

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
          <Input.TextArea placeholder={t('plugins.custom.descriptionPlaceholder') || ''} />
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
      </Form>
    </div>
  );
});
