/**
 * Higress 控制台 404 错误页面组件
 * 当用户访问不存在的页面时显示的错误页面
 * 提供友好的错误提示和返回首页的按钮
 */

// 导入 Ant Design 的组件
import { Button, Result } from 'antd';

// 导入 ICE 框架的历史记录管理
import { history } from 'ice';

// 导入 React
import React from 'react';

// 导入国际化 Hook
import { useTranslation } from 'react-i18next';

/**
 * 404 错误页面组件
 * 显示页面未找到的错误信息，并提供返回首页的操作按钮
 * @returns 返回 404 错误页面 JSX
 */
const NoFoundPage: React.FC = () => {
  // 获取国际化翻译函数
  const { t } = useTranslation();

  // 检查是否被嵌套在 iframe 中
  // 出于安全考虑，不允许在 iframe 中运行
  if (window.frameElement) {
    // 嵌套在同源 iframe 或 object 中，显示安全错误信息
    return (
      <Result
        status="500"  // 使用 500 状态码表示安全限制
        title={t('error.nestedFrame.title')}    // 使用国际化显示标题
        subTitle={t('error.nestedFrame.subTitle')} // 使用国际化显示副标题
      />
    )
  }

  // 显示标准的 404 错误页面
  return (
    <Result
      status="404"  // 404 状态码表示页面未找到
      title={t('error.404.title')}          // 使用国际化显示 404 标题
      subTitle={t('error.404.subTitle')}    // 使用国际化显示 404 副标题
      extra={
        // 额外的操作按钮区域
        <Button 
          type="primary"  // 主要按钮样式
          onClick={() => history?.push('/')}  // 点击返回首页
        >
          {t('misc.return')}  // 使用国际化显示"返回"按钮文本
        </Button>
      }
    />
  )
};

export default NoFoundPage;
