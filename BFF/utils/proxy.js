// 引入http模块和url模块
const http = require('http');
const { URL } = require('url');

/**
 * 代理请求到后端服务
 * @param {string} path - 请求路径
 * @param {string} method - HTTP方法
 * @param {Object} headers - 请求头
 * @param {string} body - 请求体
 * @param {string} backendBaseUrl - 后端服务URL
 * @returns {Promise<Object>} 返回响应数据
 */

// 定义proxyRequest函数
const proxyRequest = (path, method, headers, body) => {
  // 设置后端URL(自己服务器地址)
  // const backendBaseUrl = process.env.BACKEND_BASE_URL || 'http://10.44.159.114:8081';
  const backendBaseUrl = process.env.BACKEND_BASE_URL || 'http://localhost:8081';

  // 返回一个Promise对象，用于await
  return new Promise((resolve, reject) => {
    try {
      // 配置完整URL
      const backendURL = new URL(path, backendBaseUrl);

      // 创建代理请求
      const proxyReq = http.request(
        backendURL,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': body ? Buffer.byteLength(body) : 0,
            ...headers,
          },
        },
        (backendRes) => {
          // 设置响应头
          let data = '';
          backendRes.on('data', (chunk) => {
            data += chunk;
          });

          // 监听响应结束
          backendRes.on('end', () => {
            resolve({
              statusCode: backendRes.statusCode || 500,
              headers: backendRes.headers, // 设置响应头,直接从后端获取
              data, // 设置响应体
            });
          });
        },
      );

      // 监听请求错误
      proxyReq.on('error', (err) => {
        console.error('[BFF Proxy] 请求后端出错:', err);
        reject(new Error('后端服务不可用'));
      });
      // 如果请求体存在，则写入请求体并发送
      if (body) proxyReq.write(body);
      proxyReq.end();
    } catch (err) {
      console.error('[BFF Proxy] 内部错误:', err);
      reject(err);
    }
  });
};

// 导出proxyRequest
module.exports = {
  proxyRequest,
};
