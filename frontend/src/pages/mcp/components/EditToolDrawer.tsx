import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, Button, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import MonacoEditor from '@monaco-editor/react';
import { SERVICE_TYPE } from '@/interfaces/mcp';

interface EditToolDrawerProps {
  visible: boolean;
  serviceType: string;
  rawConfigurations?: string;
  onClose: () => void;
  onSubmit: (rawConfigurations: string, securitySchemes: any) => void;
}

const EditToolDrawer: React.FC<EditToolDrawerProps> = ({
  visible,
  serviceType,
  rawConfigurations,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [editorValue, setEditorValue] = useState('');

  useEffect(() => {
    if (visible && rawConfigurations) {
      try {
        const config = JSON.parse(rawConfigurations);
        setEditorValue(JSON.stringify(config, null, 2));
      } catch (error) {
        // console.error('Failed to parse configurations:', error);
        setEditorValue('{\n  "tools": []\n}');
      }
    } else {
      setEditorValue('{\n  "tools": []\n}');
    }
  }, [visible, rawConfigurations]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const config = JSON.parse(editorValue);

      // 更新工具配置
      const toolIndex = config.tools.findIndex((tool: any) => tool.name === values.name);
      const tool = {
        name: values.name,
        description: values.description,
        args: values.args?.map((arg: any) => ({
          name: arg.name,
          description: arg.description,
          required: arg.required,
        })),
      };

      if (toolIndex > -1) {
        config.tools[toolIndex] = tool;
      } else {
        config.tools.push(tool);
      }

      onSubmit(JSON.stringify(config), {});
    } catch (error) {
      if (error instanceof SyntaxError) {
        message.error(t('mcp.detail.invalidJson'));
      } else {
        message.error(t('mcp.detail.formError'));
      }
    }
  };

  return (
    <Drawer
      title={t('mcp.detail.editTool')}
      width={600}
      open={visible}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose}>{t('misc.cancel')}</Button>
          <Button type="primary" onClick={handleSubmit}>
            {t('misc.confirm')}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: '',
          description: '',
          args: [],
        }}
      >
        <Form.Item
          label={t('mcp.detail.toolName')}
          name="name"
          rules={[{ required: true, message: t('mcp.detail.toolNameRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('mcp.detail.toolDescription')}
          name="description"
          rules={[{ required: true, message: t('mcp.detail.toolDescriptionRequired') }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.List name="args">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    rules={[{ required: true, message: t('mcp.detail.paramNameRequired') }]}
                  >
                    <Input placeholder={t('mcp.detail.paramName')} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    rules={[{ required: true, message: t('mcp.detail.paramDescriptionRequired') }]}
                  >
                    <Input placeholder={t('mcp.detail.paramDescription')} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'required']} valuePropName="checked">
                    <Input type="checkbox" />
                  </Form.Item>
                  <Button type="link" onClick={() => remove(name)}>
                    {t('misc.delete')}
                  </Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  {t('mcp.detail.addParam')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item label={t('mcp.detail.rawConfig')}>
          <MonacoEditor
            height="300px"
            language="json"
            value={editorValue}
            onChange={(value) => setEditorValue(value || '')}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              automaticLayout: true,
            }}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditToolDrawer;
