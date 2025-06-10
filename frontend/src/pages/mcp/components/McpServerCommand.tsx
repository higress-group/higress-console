import React, { useState, useMemo } from 'react';
import { Select, message } from 'antd';
import { useParams } from 'ice';
import CodeEditor from '@/components/CodeEditor';
import { CLIENT_MAP } from '../constant';

interface McpServerCommandProps {
  mode: 'streamableHttp' | 'sse';
  config: string;
}

const McpServerCommand: React.FC<McpServerCommandProps> = ({ mode, config }) => {
  const [client, setClient] = useState('vscode');
  const { mcpId } = useParams();

  const command = useMemo(() => {
    let parsedConfig: any = null;
    try {
      parsedConfig = JSON.parse(config);
    } catch (error) {
      parsedConfig = {};
    }

    if (parsedConfig && parsedConfig.mcpServers) {
      const mcpConfig = parsedConfig.mcpServers[mcpId];
      const configStr = JSON.stringify(mcpConfig);
      return `npx mcp-installer@latest install ${mcpId} --client ${client} --config '${configStr}'`;
    }
    return '';
  }, [config, client, mcpId]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(command)
      .then(() => {
        message.success('命令已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
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
        }}
      />
    </div>
  );
};

export default McpServerCommand;
