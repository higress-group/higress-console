import CodeEditor, { CodeEditorRef } from '@/components/CodeEditor';
import { Mode } from '@/interfaces/config';
import { getHigressConfig, updateHigressConfig } from '@/services/system';
import store from '@/store';
import { stripTrailingSpaces } from '@/utils';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Form, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CONFIG_DRAFT_STORAGE_KEY = 'higress-console.system.config-draft';

const SystemSettings: React.FC = () => {
  const { t } = useTranslation();

  const [loaded, setLoaded] = useState<boolean>(false);
  const [configYaml, setConfigYaml] = useState<string>(() => sessionStorage.getItem(CONFIG_DRAFT_STORAGE_KEY) || "");
  const [mode, setMode] = useState<string>(Mode.K8S);
  const [form] = Form.useForm();
  const codeEditorRef = useRef<CodeEditorRef>();

  const [configModel] = store.useModel('config');
  useEffect(() => {
    const properties = configModel ? configModel.properties : {};
    setMode(properties.mode || Mode.K8S);
  }, [configModel]);

  useRequest(getHigressConfig, {
    onSuccess: (result, params) => {
      setLoaded(true);
      const draft = sessionStorage.getItem(CONFIG_DRAFT_STORAGE_KEY);
      if (draft !== null) {
        message.info(t('system.higress-config.draftRestored'));
      } else {
        setConfigYaml(result);
      }
    },
  });

  const handleSubmit = async () => {
    try {
      const cleanedConfigYaml = stripTrailingSpaces(configYaml);
      sessionStorage.setItem(CONFIG_DRAFT_STORAGE_KEY, configYaml);
      const updatedConfigYaml = await updateHigressConfig(cleanedConfigYaml);
      sessionStorage.removeItem(CONFIG_DRAFT_STORAGE_KEY);
      setConfigYaml(updatedConfigYaml);
      codeEditorRef.current?.pushContent(updatedConfigYaml);
      message.success(t('plugins.saveSuccess'));
    } catch (errInfo) {
      console.log('Update higress-config failed.', errInfo);
    }
  };

  return (
    <PageContainer>
      <Form
        form={form}
        style={{
          background: '#fff',
          padding: 16,
        }}
      >
        <h2>{t('system.higress-config.title')}</h2>
        <Form.Item
          extra={t(mode === Mode.K8S ? 'system.higress-config.note_k8s' : 'system.higress-config.note_standalone')}
        >
          <CodeEditor
            defaultValue={configYaml}
            ref={codeEditorRef}
            onChange={(val) => {
              setConfigYaml(val);
            }}
          />
        </Form.Item>
        <Form.Item
          style={{
            marginBottom: 0,
          }}
        >
          <Button type="primary" disabled={!configYaml} onClick={handleSubmit}>
            {t('misc.submit')}
          </Button>
        </Form.Item>
      </Form>
    </PageContainer>
  );
};

export default SystemSettings;
