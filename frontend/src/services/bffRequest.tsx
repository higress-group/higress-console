import { Modal } from "antd";
import axios from "axios";
import i18next from 'i18next';
import { ErrorComp } from './exception';
import request from './request';

const bffRequest = axios.create({
  timeout: 5 * 1000,
  // Explicitly set the baseURL to an empty string to avoid undefined.
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  // Support sending and receiving cookies.
  withCredentials: true,
});

bffRequest.interceptors.request.use((config) => {
  // Use Cookie authentication, no need to manually set the Authorization header.
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
      if (data && data.data) {
        return Promise.resolve(data.data);
      }
      return Promise.resolve(data);
    }
    return Promise.resolve(response);
  },
  async (error) => {
    // console.log("error====", error);
    let { message, config, code } = error;

    // Fallback logic: If the BFF request fails, try to directly access the backend.
    if (error.response && error.response.status >= 500 && config.url && config.url.startsWith('/bff/')) {
      try {
        // Convert the BFF path to the direct backend path.
        const backendUrl = config.url.replace('/bff', '/api');
        const fallbackConfig = {
          ...config,
          url: backendUrl,
          withCredentials: false,
        };

        // Use request to directly access the backend.
        const fallbackResponse = await request(fallbackConfig);
        return Promise.resolve(fallbackResponse);
      } catch (fallbackError) {
        console.error('[BFF Fallback] Fallback request also failed:', fallbackError);
        // If the fallback also fails, continue the existing error processing logic.
      }
    }

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
