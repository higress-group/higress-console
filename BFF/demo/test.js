// 引入express模块和相关依赖
const express = require('express');
const http = require('http');
const { URL } = require('url');

// 创建express应用实例
const app = express();

// 中间件：解析JSON请求体
app.use(express.json());

// 中间件：处理原始请求体（用于转发给后端）
app.use(express.raw({ type: 'application/json' }));

// CORS中间件
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'https://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 允许发送 Cookie

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
});

// 登录接口处理
app.post('/session/login', async (req, res) => {
  try {
    // 获取请求体数据
    const body = JSON.stringify(req.body);
    // 构造真实后端的请求地址
    const backendURL = new URL('/session/login', 'https://localhost:8081');

    // 创建代理请求：注意：这是BFF在服务端向后端发起的请求，不是前端发的
    const proxyReq = http.request(
      // options参数
      backendURL,
      {
        method: 'POST',
        // 设置请求头
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      // callback回调函数
      (backendRes) => {
        // 收集后端返回的数据
        let data = '';
        backendRes.on('data', (chunk) => {
          data += chunk;
        });

        // 后端返回数据结束后，处理数据
        backendRes.on('end', () => {
          res.status(backendRes.statusCode || 500);
          // node原生用法是res.statusCode = backendRes.statusCode

          // 直接转发后端的所有响应头
          Object.keys(backendRes.headers).forEach(headerName => {
            res.setHeader(headerName, backendRes.headers[headerName]);
          });
          // console.log('转发的响应头:', backendRes.headers);
          res.end(data); // 直接返回真实后台的数据
        });
      },
    );

    // 监听代理请求的错误
    proxyReq.on('error', (err) => {
      console.error('[BFF] 请求后端出错:', err);
      res.status(502).json({ code: 502, msg: '后端服务不可用' });
    });

    // 发送请求体给后端
    proxyReq.write(body);
    proxyReq.end();
  } catch (err) {
    console.error('[BFF] 内部错误:', err);
    res.status(500).json({ code: 500, msg: 'BFF内部错误' });
  }
});

// 404处理中间件
app.use('*', (req, res) => {
  res.status(404).json({ code: 404, msg: '接口不存在' });
});

// 错误处理中间件
app.use((err, req, res) => {
  console.error('[BFF] 服务器错误:', err);
  res.status(500).json({ code: 500, msg: 'BFF内部错误' });
});

// 服务器配置地址+端口
const PORT = process.env.BFF_PORT || 3001;
const HOST = process.env.BFF_HOST || 'localhost';

// 启动服务器
const server = app.listen(PORT, HOST, () => {
  console.log('[BFF] 服务器启动成功');
  console.log(`[BFF] 监听地址: http://${HOST}:${PORT}`);
});

// 错误处理
server.on('error', (err) => {
  console.error('[BFF] 服务器错误:', err);
});

// 关闭服务器
process.on('SIGINT', () => {
  console.log('\n[BFF] 正在关闭服务器...');
  server.close(() => {
    console.log('[BFF] 服务器已关闭');
    process.exit(0); // 退出进程
  });
});

// 导出server
module.exports = server;
