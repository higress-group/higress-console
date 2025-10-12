/**
 * Higress 控制台首页组件
 * 作为应用的入口页面，负责根据配置进行页面重定向
 * 不显示具体内容，主要处理导航逻辑
 */

// 导入 ICE 框架的页面配置和导航 Hook
import { definePageConfig, useNavigate } from 'ice';

// 导入 React 的副作用 Hook
import { useEffect } from "react";

// 导入全局状态管理
import store from '@/store';

// 导入配置相关的常量定义
import { INDEX_REDIRECT_TARGET } from '@/interfaces/config';

/**
 * 首页组件
 * 根据系统配置决定重定向到哪个页面
 * 提供灵活的首页跳转配置能力
 */
export default function SourcePage() {
  // 获取配置模型状态
  const [configModel] = store.useModel('config');
  
  // 获取页面导航函数
  const navigate = useNavigate();

  /**
   * 组件挂载时的副作用处理
   * 读取配置中的重定向目标，进行页面跳转
   */
  useEffect(() => {
    // 获取配置属性对象，如果不存在则使用空对象
    const properties = configModel ? configModel.properties : {};
    
    // 从配置中获取首页重定向目标，如果没有配置则默认跳转到路由管理页面
    const redirectTarget = properties[INDEX_REDIRECT_TARGET] || '/route';
    
    // 执行页面重定向，replace: true 表示替换当前历史记录
    navigate(redirectTarget, { replace: true });
  }, []); // 空依赖数组，只在组件挂载时执行一次
}

/**
 * 页面配置
 * 定义首页的元信息，如页面标题等
 */
export const pageConfig = definePageConfig(() => {
  return {
    title: 'Higress Console',  // 设置页面标题为 Higress 控制台
  };
});
