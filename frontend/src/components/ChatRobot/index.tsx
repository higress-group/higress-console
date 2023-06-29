import { useState } from 'react';
import { ChatgptRobot } from 'react-chatgpt-modal';
import { Button, Tooltip } from 'antd';
import store from '@/store';
import styles from './index.module.css';

import StarIcon from './star.png';
import BotGitIcon from './bot.gif';
import BotIcon from './bot.png';

const ChatRobot = () => {
  const [configModel] = store.useModel('config');
  const configData = configModel.properties || {};
  const [visible, setVisible] = useState(false);

  if (!configData['chat.enabled']) {
    return null;
  }

  const gptApi = configData['chat.endpoint'];

  const initMessage = {
    text: `您好~ 如果您喜欢 <b>Higress</b>，请给 Higress 一颗星！ <br /> 您的支持是我们最大的动力～`,
    img: StarIcon,
    link: 'https://github.com/alibaba/higress',
    date: new Date(),
    reply: true,
    type: 'init',
    user: {
      name: 'Higress',
      avatar: 'https://avatars.githubusercontent.com/u/116630909?s=200&v=4',
    },
  };

  const handleClckiBtn = () => {
    setVisible(true);
  };

  return (
    <div className={styles.chatRobot}>
      {!visible && (
        <Tooltip title="GPT Robot" placement="left">
          <Button
            className={styles['chat-robot-btn']}
            size="large"
            type="primary"
            shape="circle"
            onClick={handleClckiBtn}
          >
            <img className={styles['chat-robot-btn-gif']} src={BotGitIcon} />
            <img className={styles['chat-robot-btn-png']} src={BotIcon} />
          </Button>
        </Tooltip>
      )}
      <ChatgptRobot
        onClose={() => setVisible(false)}
        visible={visible}
        config={{
          initMessage,
          title: 'GPT Robot',
          gptApi,
        }}
        robotStyle={{
          right: 10,
          bottom: 10,
        }}
      />
    </div>
  );
};

export default ChatRobot;
