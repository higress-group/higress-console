import React, { useState} from "react";
import { RightOutlined } from '@ant-design/icons';
import { get } from 'lodash';

export const ErrorComp = ({ content, options, res }) => {
  const [isShow, setIsShow] = useState(false);
  return (
    <div style={{ lineHeight: '20px', width: 420, fontSize: 12 }}>
      <div>{content}</div>
      {
        options && res && (
          <div>
            <span>
              错误详情（错误码：<span style={{ color: '#0077cc' }}>{res && res.code}</span>）
            </span>
            <RightOutlined
              onClick={() => setIsShow(!isShow)}
              style={{
                transform: isShow ? 'rotate(90deg)' : 'rotate(0deg)',
                cursor: 'pointer',
                transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                color: '#999',
              }}
            />
          </div>
        )
      }
      {
        isShow && (
          <div style={{ lineHeight: '20px' }}>
            {
              get(options, 'method') && (
                <div>method: {`${options.method}`}</div>
              )
            }
            {
              get(options, 'url') && (
                <div>requestUrl: {`${window.location.origin}${options.baseURL}${options.url}`}</div>
              )
            }
            {
              get(options, 'headers') && (
                <div>headers: {`${JSON.stringify(options.headers)}`}</div>
              )
            }
            {
              get(options, 'params') && (
                <div>params: {`${JSON.stringify(options.params)}`}</div>
              )
            }
            {
              get(options, 'data') && (
                <div>data: {`${options.data}`}</div>
              )
            }
          </div>
        )
      }
    </div>
  );
};
