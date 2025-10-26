// 引入http模块用于创建 HTTP 服务器与客户端请求，引入URL类用于处理和拼接请求路径。
const http = require('http');
const { URL } = require('url');

// 登录接口处理函数
async function handleLogin(req, res) {
  // req是IncomingMessage的实例，res是ServerResponse的实例
  // 方法校验
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ code: 405, msg: '方法使用错误' }));
    return;
  }

  // 收集前端发来的请求体
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      // 构造真实后端的请求地址
      const backendURL = new URL('/session/login', 'https://localhost:8081');

      // 创建代理请求：注意：这是BFF在服务端向后端发起的请求，不是前端发的
      const proxyReq = http.request(
        // options参数
        backendURL,
        {
          method: 'POST',
          // 设置请求头，感觉这里可以优化（不用写）
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
            res.statusCode = backendRes.statusCode || 500;

            // 直接转发后端的所有响应头
            Object.keys(backendRes.headers).forEach(headerName => {
              res.setHeader(headerName, backendRes.headers[headerName]);
            });

            console.log('转发的响应头:', backendRes.headers);

            res.end(data); // 直接返回真实后台的数据
          });
        },
      );

      // 监听代理请求的错误
      proxyReq.on('error', (err) => {
        console.error('[BFF] 请求后端出错:', err);
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ code: 502, msg: '后端服务不可用' }));
      });

      // 发送请求体给后端
      proxyReq.write(body);
      proxyReq.end();
    } catch (err) {
      console.error('[BFF] 内部错误:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ code: 500, msg: 'BFF内部错误' }));
    }
  });
}

// 服务器事件函数
function handleRequest(req, res) {
  // 获取请求路径
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'https://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');

  // 设置支持 Cookie
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 允许发送 Cookie

  // 处理预检请求,
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // 路由分发
  switch (path) {
    // case '/bff/session/login':
    case '/session/login':
      handleLogin(req, res);
      break;
    default:
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ code: 404, msg: '接口不存在' }));
  }
}

// 创建HTTP服务器,配置项后面再说
const server = http.createServer(handleRequest);

// 服务器配置地址+端口
const PORT = process.env.BFF_PORT || 3001;
const HOST = process.env.BFF_HOST || 'localhost';

// 启动服务器
server.listen(PORT, HOST, () => {
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

// 看情况，以后说不定要导出server，所以先写在这里
module.exports = server;
