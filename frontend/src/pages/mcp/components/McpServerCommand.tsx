import React, { useState, useMemo } from 'react';
import { Select, message, Button } from 'antd';
import { useSearchParams } from 'ice';
import { CLIENT_MAP } from '../constant';
import { useTranslation, Trans } from 'react-i18next';
import MonacoEditor from '@monaco-editor/react';

interface McpServerCommandProps {
  mode: 'streamableHttp' | 'sse';
  config: string;
}

const McpServerCommand: React.FC<McpServerCommandProps> = ({ mode, config }) => {
  const [client, setClient] = useState('vscode');
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const { t } = useTranslation();


  const command = useMemo(() => {
    let parsedConfig: any = null;
    try {
      parsedConfig = JSON.parse(config);
    } catch (error) {
      parsedConfig = {};
    }

    if (parsedConfig && parsedConfig.mcpServers) {
      const mcpConfig = parsedConfig.mcpServers[name];
      const configStr = JSON.stringify(mcpConfig);
      return `npx mcp-installer@latest install ${name} --client ${client} --config '${configStr}'`;
    }
    return '';
  }, [config, client, name]);

  const handleCopy = () => {
    // 尝试使用现代 API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(command)
        .then(() => {
          message.success(t('mcp.copy.success'));
        })
        .catch(() => {
          fallbackCopy();
        });
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    // 创建临时文本区域
    const textArea = document.createElement('textarea');
    textArea.value = command;

    // 设置样式使其不可见
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);

    // 选择并复制文本
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        message.success(t('mcp.copy.success'));
      } else {
        message.error(t('mcp.copy.fail'));
      }
    } catch (err) {
      message.error(t('mcp.copy.fail'));
    }

    // 清理
    document.body.removeChild(textArea);
  };

  return (
    <div className="mcp-server-command">
      <div style={{ marginBottom: 20 }}>
        <Select style={{ width: 200 }} value={client} onChange={setClient} placeholder="Select">
          {Object.keys(CLIENT_MAP).map((key) => (
            <Select.Option key={key} value={key}>
              {CLIENT_MAP[key]}
            </Select.Option>
          ))}
        </Select>
        <div style={{ display: 'inline-block', marginRight: 15, marginLeft: 15 }}>
          <Trans t={t} i18nKey="mcp.detail.commandDesc" values={{ client: CLIENT_MAP[client] }}>
            使用 {{ client }} 客户端安装 MCP 服务器
          </Trans>
        </div>
      </div>
      <MonacoEditor
        height="200px"
        language="bash"
        theme="vs-dark"
        value={command}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          wordWrap: 'on',
          automaticLayout: true,
          readOnly: true,
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
            handleMouseWheel: false,
            alwaysConsumeMouseWheel: false,
          },
        }}
      />
      <Button style={{ marginTop: 12 }} onClick={handleCopy}>
        {t('mcp.copy.button')}
      </Button>
    </div>
  );
};

export default McpServerCommand;
