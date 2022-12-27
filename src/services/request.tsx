import { Modal } from "antd";
import axios from "axios";
import { ErrorComp } from './exception';
import qs from "qs";
import { includes } from "lodash";


const request = axios.create({
  timeout: 5 * 1000,
  baseURL: "/api",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
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

    console.log("response====", response);
    if (status === 200 && data && data.success !== false) {
      return Promise.resolve(response.data.data);
    } else {

    }
    return response;
  },
  (error) => {
    console.log("error====", error);

    const { message, config } = error;
    Modal.warning({
      title: "错误",
      content: <ErrorComp content={message} options={config} res={error} />,
      okText: "关闭",
      width: 560,
    });

    return Promise.reject(error);
  }
);

export default request;
