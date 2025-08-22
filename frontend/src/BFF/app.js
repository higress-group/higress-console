// 引入express
const express = require('express');

// 引入cors中间件,用于处理跨域请求
const corsMiddleware = require('./middleware/cors');

// 生产环境安全中间件
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// 创建express应用
const app = express();

// 生产环境安全配置
if (process.env.NODE_ENV === 'production') {
  // 安全头设置
  app.use(helmet({
    contentSecurityPolicy: false, // 如果需要内联脚本可以设置为false
    crossOriginEmbedderPolicy: false,
  }));

  // 压缩响应
  app.use(compression());

  // 限流配置
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP 15分钟内最多100个请求
    message: {
      code: 429,
      msg: '请求过于频繁，请稍后再试',
    },
  });
  app.use(limiter);
}

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
// 处理原始请求体（用于转发，会覆盖express.json()）
app.use(express.raw({ type: 'application/json', limit: '10mb' }));
// CORS中间件，处理跨域请求
app.use(corsMiddleware);

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 路由
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/system'));
app.use('/', require('./routes/tls-certificate'));
app.use('/', require('./routes/service'));
app.use('/', require('./routes/service-source'));
app.use('/', require('./routes/route'));
app.use('/', require('./routes/plugin'));
app.use('/', require('./routes/consumer'));
app.use('/', require('./routes/dashboard'));
app.use('/', require('./routes/domain'));
app.use('/', require('./routes/mcp'));
app.use('/', require('./routes/llm-provider'));
app.use('/', require('./routes/ai-route'));

// 404处理中间件
app.use('*', (req, res) => {
  res.status(404).json({ code: 404, msg: '接口不存在' });
});

// 错误处理中间件
app.use((err, req, res) => {
  console.error('[BFF] 服务器错误:', err);
  res.status(500).json({ code: 500, msg: 'BFF内部错误' });
});

// 导出app
module.exports = app;
