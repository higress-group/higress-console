import { RedoOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';

// 刷新按钮
const RedoOutlinedBtn = (props) => {
  const { getList } = props;

  const handleClick = async () => {
    getList && getList.run();
  };

  return (
    <Form.Item label="&nbsp;">
      <Button
        onClick={handleClick}
        disabled={getList && getList.loading}
        icon={<RedoOutlined spin={getList && getList.loading} />}
      />
    </Form.Item>
  )
};

// 跳转按钮
const HistoryButton = (props) => {
  const { text = '', path = '' } = props;
  return (
    <a href={path} target="_blank">{text}</a>
  )
};

export {
  HistoryButton, RedoOutlinedBtn,
};
