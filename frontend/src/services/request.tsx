import { Modal } from "antd";
import axios from "axios";
import { useTranslation } from 'react-i18next';
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
    const { status, data } = response;

    // console.log("response====", response);
    if (status === 200 && data && data.success !== false) {
      return Promise.resolve(response.data.data);
    } else {

    }
    return response;
  },
  (error) => {
    // console.log("error====", error);

    const { t } = useTranslation();

    const { message, config } = error;
    Modal.warning({
      title: t('misc.error'),
      content: <ErrorComp content={message} options={config} res={error} />,
      okText: t('misc.close'),
      width: 560,
    });

    return Promise.reject(error);
  }
);

export default request;
