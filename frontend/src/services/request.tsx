/**
 * Higress 控制台 HTTP 请求服务配置文件
 * 基于 Axios 封装的 HTTP 客户端，提供统一的请求拦截、响应处理和错误处理
 * 支持认证、国际化、错误提示等功能
 */

import { Modal } from "antd";  // Ant Design 的模态框组件，用于显示错误信息
import axios from "axios";     // HTTP 客户端库
import i18next from 'i18next'; // 国际化库，用于多语言错误提示
import { ErrorComp } from './exception'; // 自定义错误组件，用于显示详细的错误信息

/**
 * 创建 Axios 实例
 * 配置基础请求参数，包括超时时间、基础 URL 和默认请求头
 */
const request = axios.create({
  timeout: 5 * 1000,  // 请求超时时间：5秒
  baseURL: process.env.ICE_CORE_MODE === "development" ? "/api" : "", // 开发环境使用 /api 前缀，生产环境使用相对路径
  headers: {
    "Content-Type": "application/json", // 默认内容类型：JSON
  },
});

/**
 * 请求拦截器
 * 在发送请求前统一处理，包括添加认证令牌和防止 GET 请求缓存
 */
request.interceptors.request.use((config) => {
  // 从本地存储获取用户认证令牌
  const token = localStorage.getItem("token");
  if (token) {
    // 如果存在令牌，添加到请求头中
    config.headers = {
      Authorization: token,  // 添加认证令牌
      ...config.headers,    // 保留原有的请求头
    };
  }
  
  // 为 GET 请求添加时间戳参数，防止浏览器缓存
  if (config.method && config.method.toUpperCase() === 'GET' && config.url) {
    config.url = `${config.url}${config.url.indexOf('?') === -1 ? '?' : '&'}ts=${Date.now()}`;
  }
  
  return config;
});

/**
 * 响应拦截器
 * 统一处理响应数据，包括成功响应的格式化和错误响应的处理
 */
request.interceptors.response.use(
  (response) => {
    const { status, config, data } = response;

    // console.log("response====", response);
    const statusCategory = Math.floor(status / 100); // 获取状态码的百位数
    
    // 处理 2xx 系列的成功响应
    if (statusCategory === 2) {
      if (data && data.data) {
        // 如果响应数据中有 data 字段，直接返回 data 字段的内容
        return Promise.resolve(data.data);
      }
      // 否则返回整个响应数据
      return Promise.resolve(data);
    }
    
    // 其他状态码直接返回完整响应
    return Promise.resolve(response);
  },
  (error) => {
    // console.log("error====", error);
    let { message, config, code } = error;
    
    // 处理有响应的错误（服务器返回了错误响应）
    if (error.response) {
      const { status, data } = error.response;

      // 处理 401 未授权错误
      if (status === 401) {
        // 如果是登录请求，允许未授权响应
        if (config.url.indexOf('/login') !== -1) {
          Promise.resolve(error.response);
          return;
        }
        
        // 其他情况：未授权，跳转到登录页面
        Promise.reject(error);
        // 检查当前不在初始化页面和登录页面，避免重复跳转
        if (window.location.href.indexOf('/init') === -1 && window.location.href.indexOf('/login') === -1) {
          // 跳转到登录页面，并记录当前页面以便登录后重定向
          window.location.href = `/login?redirect=${window.location.pathname}`;
        }
        return;
      }
      
      // 国际化错误消息处理
      const messageKeys = [
        `request.error.${status}_${config.method}`, // 优先使用状态码+请求方法的组合键
        `request.error.${status}` // 回退到仅状态码的键
      ];
      
      // 尝试获取本地化的错误消息
      for (const key of messageKeys) {
        const localizedMessage = i18next.t(key);
        if (localizedMessage !== key) {
          message = localizedMessage; // 找到本地化消息，替换默认消息
          break;
        }
      }
      
      code = status; // 使用 HTTP 状态码作为错误代码
      
      // 保存响应数据到配置中，用于错误详情显示
      if (data) {
        config.data = typeof data === 'string' ? data : JSON.stringify(data);
      }
    }
    
    // 显示错误模态框
    showErrorModal(message, config, code);
    return Promise.reject(error);
  },
);

/**
 * 显示错误模态框
 * 使用 Ant Design 的 Modal 组件显示详细的错误信息
 * 
 * @param message - 错误消息
 * @param config - 请求配置信息
 * @param code - 错误代码（可选）
 */
function showErrorModal(message: string, config: object, code?: number) {
  Modal.warning({
    title: i18next.t('misc.error'), // 使用国际化获取"错误"标题
    content: <ErrorComp content={message} options={config} code={code} />, // 使用自定义错误组件显示详情
    okText: i18next.t('misc.close'), // 使用国际化获取"关闭"按钮文本
    width: 560, // 模态框宽度
  });
}

export default request;
