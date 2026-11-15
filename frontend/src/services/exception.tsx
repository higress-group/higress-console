import { RightOutlined } from '@ant-design/icons';
import { get, isNil } from 'lodash';
import { useState } from "react";
import { Trans, useTranslation } from 'react-i18next';
import { redactSensitiveData } from '@/utils/redact-secrets';

export const ErrorComp = ({ content, options, code }) => {
  const { t } = useTranslation();
  const safeOptions = redactSensitiveData(options);

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
        isShow && safeOptions && (
          <div style={{ lineHeight: '20px' }}>
            {
              get(safeOptions, 'method') && (
                <div>Method: {`${safeOptions.method}`}</div>
              )
            }
            {
              get(safeOptions, 'url') && (
                <div>RequestURL: {`${window.location.origin}${safeOptions.baseURL}${safeOptions.url}`}</div>
              )
            }
            {
              get(safeOptions, 'headers') && (
                <div>Headers: {`${JSON.stringify(safeOptions.headers)}`}</div>
              )
            }
            {
              get(safeOptions, 'params') && (
                <div>Params: {`${JSON.stringify(safeOptions.params)}`}</div>
              )
            }
            {
              get(safeOptions, 'data') && (
                <div>Data: {`${safeOptions.data}`}</div>
              )
            }
          </div>
        )
      }
    </div>
  );
};
