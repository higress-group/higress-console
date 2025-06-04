import CodeEditor from '@/components/CodeEditor';
import { Mode } from '@/interfaces/config';
import { getHigressConfig, updateHigressConfig } from '@/services/system';
import store from '@/store';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SystemSettings: React.FC = () => {
  const { t } = useTranslation();

  const [loaded, setLoaded] = useState<boolean>(false);
  const [configYaml, setConfigYaml] = useState<string>("");
  const [configYamlVersion, setConfigYamlVersion] = useState<number>(0);
  const [mode, setMode] = useState<string>(Mode.K8S);
  const [form] = Form.useForm();

  const [configModel] = store.useModel('config');
  useEffect(() => {
    const properties = configModel ? configModel.properties : {};
    setMode(properties.mode || Mode.K8S);
  }, [configModel]);

  useRequest(getHigressConfig, {
    onSuccess: (result, params) => {
      setLoaded(true);
      setConfigYaml(result);
      setConfigYamlVersion(configYamlVersion + 1);
    },
  });

  const handleSubmit = async () => {
    try {
      const updatedConfigYaml = await updateHigressConfig(configYaml);
      setConfigYaml(updatedConfigYaml);
      setConfigYamlVersion(configYamlVersion + 1);
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
            key={configYamlVersion}
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
