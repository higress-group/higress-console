import React, { useState, useEffect } from 'react';
import { Drawer, Button, Space, message, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import StepTitle from './StepTitle';
import YamlUtil from './yamlUtil';
import { swaggerToMcpConfig } from '@/services/mcp';
import MonacoEditor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

loader.config({ monaco });

interface EditToolDrawerProps {
  visible: boolean;
  serviceType: string;
  rawConfigurations?: string;
  onClose: () => void;
  onSubmit: (rawConfigurations: string) => any;
}

const EditToolDrawer: React.FC<EditToolDrawerProps> = ({
  visible,
  serviceType,
  rawConfigurations = '',
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'swagger' | 'yaml'>('swagger');
  const [localRawConfigurations, setLocalRawConfigurations] = useState('');
  const [swaggerContentStr, setSwaggerContentStr] = useState('');
  const [swaggerToolsContent, setSwaggerToolsContent] = useState('');
  const [editorReady, setEditorReady] = useState(false);

  // 初始化/重置
  useEffect(() => {
    if (visible) {
      setLocalRawConfigurations(rawConfigurations);
      setSwaggerContentStr('');
      setSwaggerToolsContent('');
      setMode('swagger');
    }
  }, [visible, rawConfigurations]);

  // 监听 rawConfigurations 变化
  useEffect(() => {
    if (rawConfigurations !== localRawConfigurations) {
      setLocalRawConfigurations(rawConfigurations);
    }
  }, [rawConfigurations]);

  // 主题加载完成后再展示编辑器
  useEffect(() => {
    if (visible) {
      setTimeout(() => setEditorReady(true), 100); // 模拟主题加载
    } else {
      setEditorReady(false);
    }
  }, [visible]);

  // 关闭
  const handleClose = () => {
    onClose();
    setLocalRawConfigurations(rawConfigurations);
    setSwaggerContentStr('');
    setSwaggerToolsContent('');
    setMode('swagger');
  };

  // 提交
  const handleSubmit = () => {
    onSubmit(localRawConfigurations);
  };

  // swagger 解析
  const handleSwaggerParse = async () => {
    if (!swaggerContentStr.trim()) {
      message.warning(t('mcp.detail.swaggerRequired'));
      return;
    }
    try {
      const res = await swaggerToMcpConfig({ content: swaggerContentStr });
      let swaggerObj = {};
      try {
        swaggerObj = YamlUtil.parseYaml(res) || {};
      } catch (e) {
        message.error(t('mcp.detail.swaggerParseError'));
        return;
      }
      setSwaggerToolsContent(YamlUtil.stringifyYaml(swaggerObj));
      let finalObj = {};
      try {
        finalObj = YamlUtil.parseYaml(localRawConfigurations) || {};
      } catch (e) {
        finalObj = {};
      }
      if (!finalObj.server) finalObj.server = {};
      if (!finalObj.tools) finalObj.tools = [];
      if (swaggerObj.server) {
        finalObj.server = {
          ...finalObj.server,
          ...swaggerObj.server,
        };
      }
      if (swaggerObj.tools) {
        finalObj.tools = [...finalObj.tools, ...swaggerObj.tools];
      }
      setLocalRawConfigurations(YamlUtil.stringifyYaml(finalObj));
      message.success(t('mcp.detail.swaggerParseSuccess'));
    } catch (e) {
      message.error(String(e));
    }
  };

  // UI
  return (
    <Drawer
      title={t('mcp.detail.editTool')}
      width={1000}
      open={visible}
      onClose={handleClose}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={handleClose}>
            {t('misc.cancel')}
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {t('misc.confirm')}
          </Button>
        </Space>
      }
    >
      {/* 模式切换卡片 */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Card
          style={{
            flex: 1,
            width: 220,
            border: mode === 'swagger' ? '2px solid #409eff' : '1px solid #e0e0e0',
            boxShadow: mode === 'swagger' ? '0 2px 8px #409eff22' : undefined,
            cursor: 'pointer',
          }}
          onClick={() => setMode('swagger')}
        >
          <div>{t('mcp.detail.swaggerModeTitle')}</div>
          <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
            {t('mcp.detail.swaggerModeDesc')}
          </div>
        </Card>
        <Card
          style={{
            flex: 1,
            width: 220,
            border: mode === 'yaml' ? '2px solid #409eff' : '1px solid #e0e0e0',
            boxShadow: mode === 'yaml' ? '0 2px 8px #409eff22' : undefined,
            cursor: 'pointer',
          }}
          onClick={() => setMode('yaml')}
        >
          <div>{t('mcp.detail.yamlModeTitle')}</div>
          <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
            {t('mcp.detail.yamlModeDesc')}
          </div>
        </Card>
      </div>
      {/* YAML模式 */}
      {mode === 'yaml' ? (
        <>
          <StepTitle>
            {t('mcp.detail.yamlEditTitle')}
          </StepTitle>
          {editorReady && (
            <MonacoEditor
              height="400px"
              language="yaml"
              theme="vs-dark"
              value={localRawConfigurations}
              onChange={(v) => setLocalRawConfigurations(v || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                wordWrap: 'on',
                automaticLayout: true,
              }}
              style={{ marginBottom: 10 }}
            />
          )}
        </>
      ) : (
        <>
          <div style={{ marginBottom: 24 }}>
            <StepTitle>
              {t('mcp.detail.swaggerEditTitle')}
            </StepTitle>
            {editorReady && (
              <MonacoEditor
                height="400px"
                language="yaml"
                theme="vs-dark"
                value={swaggerContentStr}
                onChange={(v) => setSwaggerContentStr(v || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            )}
            <Button type="primary" style={{ marginTop: 12 }} onClick={handleSwaggerParse}>
              {t('mcp.detail.swaggerParseBtn')}
            </Button>
          </div>
          <div>
            <StepTitle>
              {t('mcp.detail.swaggerPreviewTitle')}
            </StepTitle>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 4 }}>
                  {t('mcp.detail.swaggerPreviewDesc')}
                </div>
                {editorReady && (
                  <MonacoEditor
                    height="400px"
                    language="yaml"
                    theme="vs-dark"
                    value={swaggerToolsContent}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      wordWrap: 'on',
                      automaticLayout: true,
                      readOnly: true,
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 4 }}>
                  {t('mcp.detail.yamlEditDesc')}
                </div>
                {editorReady && (
                  <MonacoEditor
                    height="400px"
                    language="yaml"
                    theme="vs-dark"
                    value={localRawConfigurations}
                    onChange={(v) => setLocalRawConfigurations(v || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      wordWrap: 'on',
                      automaticLayout: true,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <div style={{ height: 50 }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={handleClose}>
          {t('misc.cancel')}
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          {t('misc.confirm')}
        </Button>
      </div>
    </Drawer>
  );
};

export default EditToolDrawer;
