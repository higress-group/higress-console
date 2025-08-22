// CORS 中间件配置
const corsMiddleware = (req, res, next) => {
  // 设置CORS响应头
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
};

// 导出cors中间件
module.exports = corsMiddleware;
