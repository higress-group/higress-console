import { RightOutlined } from '@ant-design/icons';
import { get, isNil } from 'lodash';
import { useState } from "react";
import { Trans, useTranslation } from 'react-i18next';

export const ErrorComp = ({ content, options, code }) => {
  const { t } = useTranslation();

  const [isShow, setIsShow] = useState(false);
  return (
    <div style={{ lineHeight: '20px', width: 420, fontSize: 12 }}>
      <div>{content}</div>
      {
        (
          <div>
            <span>
              <Trans t={t} i18nKey="exception.info">
                错误详情（错误码：<span style={{ color: '#0077cc' }}>{{ code: !isNil(code) ? code : 'N/A' }}</span>）
              </Trans>
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
        isShow && options && (
          <div style={{ lineHeight: '20px' }}>
            {
              get(options, 'method') && (
                <div>Method: {`${options.method}`}</div>
              )
            }
            {
              get(options, 'url') && (
                <div>RequestURL: {`${window.location.origin}${options.baseURL}${options.url}`}</div>
              )
            }
            {
              get(options, 'headers') && (
                <div>Headers: {`${JSON.stringify(options.headers)}`}</div>
              )
            }
            {
              get(options, 'params') && (
                <div>Params: {`${JSON.stringify(options.params)}`}</div>
              )
            }
            {
              get(options, 'data') && (
                <div>Data: {`${options.data}`}</div>
              )
            }
          </div>
        )
      }
    </div>
  );
};
