/**
 * 聊天机器人组件
 * 提供 GPT 机器人聊天功能，支持用户与 AI 进行对话
 * 包含可配置的聊天界面和初始化消息
 */

// 导入 React Hook
import { useState } from 'react';

// 导入聊天机器人组件
import { ChatgptRobot } from 'react-chatgpt-modal';

// 导入 Ant Design 组件
import { Button, Tooltip } from 'antd';

// 导入全局状态管理
import store from '@/store';

// 导入组件样式
import styles from './index.module.css';

// 导入图标资源
import StarIcon from './star.png';    // 星星图标
import BotGitIcon from './bot.gif';   // 机器人 GIF 图标
import BotIcon from './bot.png';      // 机器人 PNG 图标

/**
 * 聊天机器人组件
 * 提供 GPT 聊天功能，支持配置启用/禁用和 API 端点设置
 * @returns 返回聊天机器人组件，如果未启用则返回 null
 */
const ChatRobot = () => {
  // 获取配置模型状态
  const [configModel] = store.useModel('config');
  const configData = configModel.properties || {};
  
  // 聊天窗口可见性状态
  const [visible, setVisible] = useState(false);

  // 检查聊天功能是否启用
  if (!configData['chat.enabled']) {
    return null; // 如果未启用，不渲染任何内容
  }

  // 获取 GPT API 端点配置
  const gptApi = configData['chat.endpoint'];

  /**
   * 初始化消息配置
   * 定义聊天窗口打开时显示的欢迎消息
   */
  const initMessage = {
    text: `您好~ 如果您喜欢 <b>Higress</b>，请给 Higress 一颗星！ <br /> 您的支持是我们最大的动力～`,
    img: StarIcon,    // 消息图标
    link: 'https://github.com/alibaba/higress', // 链接地址
    date: new Date(), // 消息时间
    reply: true,      // 是否为回复消息
    type: 'init',     // 消息类型：初始化消息
    user: {
      name: 'Higress', // 用户名称
      avatar: 'https://avatars.githubusercontent.com/u/116630909?s=200&v=4', // 用户头像
    },
  };

  /**
   * 处理聊天按钮点击事件
   * 显示聊天窗口
   */
  const handleClckiBtn = () => {
    setVisible(true);
  };

  return (
    <div className={styles.chatRobot}>
      {/* 聊天按钮（当聊天窗口未显示时） */}
      {!visible && (
        <Tooltip title="GPT Robot" placement="left">
          <Button
            className={styles['chat-robot-btn']}    // 按钮样式
            size="large"                            // 大尺寸按钮
            type="primary"                          // 主要按钮样式
            shape="circle"                          // 圆形按钮
            onClick={handleClckiBtn}                // 点击事件处理
          >
            {/* 机器人图标（GIF 动画效果） */}
            <img className={styles['chat-robot-btn-gif']} src={BotGitIcon} />
            {/* 机器人图标（PNG 静态效果） */}
            <img className={styles['chat-robot-btn-png']} src={BotIcon} />
          </Button>
        </Tooltip>
      )}
      
      {/* 聊天机器人窗口 */}
      <ChatgptRobot
        onClose={() => setVisible(false)}  // 关闭聊天窗口回调
        visible={visible}                    // 聊天窗口可见性
        config={{
          initMessage,   // 初始化消息配置
          title: 'GPT Robot', // 聊天窗口标题
          gptApi,        // GPT API 端点
        }}
        robotStyle={{
          right: 10,     // 距离右侧 10px
          bottom: 10,    // 距离底部 10px
        }}
      />
    </div>
  );
};

export default ChatRobot;
