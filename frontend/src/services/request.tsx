import { Modal } from "antd";
import axios from "axios";
import i18next from 'i18next';
import { ErrorComp } from './exception';

const request = axios.create({
  timeout: 5 * 1000,
  baseURL: process.env.NODE_ENV === "development" ? "/api" : "",
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      Authorization: token,
      ...config.headers,
    };
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    const { status, config, data } = response;

    // console.log("response====", response);
    if (status === 200) {
      if (!data) {
        showErrorModal('Missing response data.', config);
        return Promise.reject(response);
      }
      if (data.success !== false) {
        return Promise.resolve(data.data);
      }
      showErrorModal(data.message, config, data.status);
      return Promise.reject(response);
    }
    return response;
  },
  (error) => {
    // console.log("error====", error);
    const { message, config, code } = error;
    showErrorModal(message, config, code);
    return Promise.reject(error);
  }
);

function showErrorModal(message: string, config: object, code?: number) {
  Modal.warning({
    title: i18next.t('misc.error'),
    content: <ErrorComp content={message} options={config} code={code} />,
    okText: i18next.t('misc.close'),
    width: 560,
  });
}

export default request;
