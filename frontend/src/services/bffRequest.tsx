import { Modal } from "antd";
import axios from "axios";
import i18next from 'i18next';
import { ErrorComp } from './exception';

const bffRequest = axios.create({
  timeout: 5 * 1000,
  // 明确设置baseURL为空字符串，避免undefined
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  // 支持发送和接收Cookie
  withCredentials: true,
});

bffRequest.interceptors.request.use((config) => {
  // 使用Cookie认证，不需要手动设置Authorization头
  if (config.method && config.method.toUpperCase() === 'GET' && config.url) {
    config.url = `${config.url}${config.url.indexOf('?') === -1 ? '?' : '&'}ts=${Date.now()}`;
  }
  return config;
});

bffRequest.interceptors.response.use(
  (response) => {
    const { status, config, data } = response;

    // console.log("response====", response);
    const statusCategory = Math.floor(status / 100);
    if (statusCategory === 2) {
      // 对于批量导入等需要完整响应的接口，返回完整的 data 对象
      if (data && data.data && (config.url?.includes('/batch-import') || config.url?.includes('/batch-export'))) {
        return Promise.resolve(data);
      }
      if (data && data.data) {
        return Promise.resolve(data.data);
      }
      return Promise.resolve(data);
    }
    return Promise.resolve(response);
  },
  (error) => {
    // console.log("error====", error);
    let { message, config, code } = error;
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        if (config.url.indexOf('/login') !== -1) {
          // Unauthorized response is allowed for a login request.
          Promise.resolve(error.response);
          return;
        }
        // Unauthorized. Jump to the login page.
        Promise.reject(error);
        if (window.location.href.indexOf('/init') === -1 && window.location.href.indexOf('/login') === -1) {
          window.location.href = `/login?redirect=${window.location.pathname}`;
        }
        return;
      }
      const messageKeys = [`request.error.${status}_${config.method}`, `request.error.${status}`];
      for (const key of messageKeys) {
        const localizedMessage = i18next.t(key);
        if (localizedMessage !== key) {
          message = localizedMessage;
          break;
        }
      }
      code = status;
      if (data) {
        config.data = typeof data === 'string' ? data : JSON.stringify(data);
      }
    }
    showErrorModal(message, config, code);
    return Promise.reject(error);
  },
);

function showErrorModal(message: string, config: object, code?: number) {
  Modal.warning({
    title: i18next.t('misc.error'),
    content: <ErrorComp content={message} options={config} code={code} />,
    okText: i18next.t('misc.close'),
    width: 560,
  });
}

export default bffRequest;
