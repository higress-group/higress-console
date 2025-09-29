// 引入app.js
const app = require('./app');

// 端口和地址
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
    process.exit(0);
  });
});
