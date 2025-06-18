import React, { useState, useMemo } from 'react';
import { Select, message } from 'antd';
import { useSearchParams } from 'ice';
import CodeEditor from '@/components/CodeEditor';
import { CLIENT_MAP } from '../constant';

interface McpServerCommandProps {
  mode: 'streamableHttp' | 'sse';
  config: string;
}

const McpServerCommand: React.FC<McpServerCommandProps> = ({ mode, config }) => {
  const [client, setClient] = useState('vscode');
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');

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
          message.success('命令已复制到剪贴板');
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
        message.success('命令已复制到剪贴板');
      } else {
        message.error('复制失败，请手动复制');
      }
    } catch (err) {
      message.error('复制失败，请手动复制');
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
          请运行以下命令以安装 {CLIENT_MAP[client]} Mcp Server：
        </div>
      </div>
      <CodeEditor
        defaultValue={command}
        language="bash"
        height="200px"
        readOnly
        extraOptions={{
          onCopy: handleCopy,
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
            handleMouseWheel: false,
            alwaysConsumeMouseWheel: false,
          },
          readonly: true,
        }}
      />
    </div>
  );
};

export default McpServerCommand;
