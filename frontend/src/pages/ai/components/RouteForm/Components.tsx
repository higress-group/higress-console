import React, { useState, useImperativeHandle } from "react";
import { Form, Button, Table, InputNumber } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { history } from 'ice';
import { CustomComponentHandles } from '@/interfaces/service-source';
import { useTranslation } from 'react-i18next';

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
    <Button
      type="link"
      style={{ padding: 0 }}
      onClick={() => history?.push(path)}
    >
      {text}
    </Button>
  )
};

export {
  RedoOutlinedBtn,
  HistoryButton,
};
