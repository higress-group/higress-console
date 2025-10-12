/**
 * 错误信息展示组件
 * 用于在 HTTP 请求失败时显示详细的错误信息
 * 支持错误详情展开/收起，显示请求方法、URL、请求头等信息
 */

// 导入 Ant Design 图标
import { RightOutlined } from '@ant-design/icons';

// 导入 lodash 工具函数
import { get, isNil } from 'lodash';

// 导入 React Hook
import { useState } from "react";

// 导入国际化相关组件和 Hook
import { Trans, useTranslation } from 'react-i18next';

/**
 * 错误信息展示组件
 * 显示 HTTP 请求错误的详细信息，包括错误消息、错误码和请求详情
 * 
 * @param content - 错误消息内容
 * @param options - 请求配置选项（包含方法、URL、请求头等）
 * @param code - 错误码
 * @returns 返回错误信息组件
 */
export const ErrorComp = ({ content, options, code }) => {
  // 获取国际化翻译函数
  const { t } = useTranslation();

  // 控制错误详情显示/隐藏的状态
  const [isShow, setIsShow] = useState(false);

  return (
    <div style={{ 
      lineHeight: '20px', // 行高
      width: 420,         // 固定宽度
      fontSize: 12        // 字体大小
    }}>
      {/* 错误消息内容 */}
      <div>{content}</div>
      
      {/* 错误详情区域 */}
      {
        (
          <div>
            <span>
              {/* 使用国际化组件显示错误详情标题 */}
              <Trans t={t} i18nKey="exception.info">
                错误详情（错误码：<span style={{ color: '#0077cc' }}>{{ code: !isNil(code) ? code : 'N/A' }}</span>）
              </Trans>
            </span>
            
            {/* 展开/收起图标 */}
            <RightOutlined
              onClick={() => setIsShow(!isShow)} // 点击切换显示状态
              style={{
                transform: isShow ? 'rotate(90deg)' : 'rotate(0deg)', // 根据状态旋转图标
                cursor: 'pointer',      // 鼠标指针样式
                transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)', // 旋转动画
                color: '#999',           // 图标颜色
              }}
            />
          </div>
        )
      }
      
      {/* 展开的详细信息 */}
      {
        isShow && options && (
          <div style={{ lineHeight: '20px' }}>
            {/* 请求方法 */}
            {
              get(options, 'method') && (
                <div>Method: {`${options.method}`}</div>
              )
            }
            
            {/* 请求 URL */}
            {
              get(options, 'url') && (
                <div>RequestURL: {`${window.location.origin}${options.baseURL}${options.url}`}</div>
              )
            }
            
            {/* 请求头 */}
            {
              get(options, 'headers') && (
                <div>Headers: {`${JSON.stringify(options.headers)}`}</div>
              )
            }
            
            {/* 请求参数 */}
            {
              get(options, 'params') && (
                <div>Params: {`${JSON.stringify(options.params)}`}</div>
              )
            }
            
            {/* 请求数据 */}
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
