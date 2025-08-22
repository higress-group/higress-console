module.exports = {
  apps: [{
    name: 'higress-console-bff',
    script: 'server.js',
    instances: 'max', // 使用所有CPU核心
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development', // 开发环境
      BFF_PORT: 3001,
      BFF_HOST: '0.0.0.0',
      BACKEND_BASE_URL: 'https://localhost:8081', // 后端地址
    },
    env_production: {
      NODE_ENV: 'production', // 生产环境
      BFF_PORT: 3001, // 端口暂时使用3001，后面再修改
      BFF_HOST: '0.0.0.0',
      BACKEND_BASE_URL: 'https://localhost:8081', // 后端地址
    },
    // 日志配置
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // 监控配置
    max_memory_restart: '800M',
    min_uptime: '10s',
    max_restarts: 10,
    // 优雅关闭
    kill_timeout: 5000,
    listen_timeout: 3000,
    // 自动重启
    autorestart: true,
    watch: false,
    // 环境变量
    env_file: '.env',
  }],
};
