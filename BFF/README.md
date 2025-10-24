# BFF-Express 项目结构

```
bff-express/
├── app.js                      # 初始化 Express 应用（加载中间件 + 路由）
├── server.js                   # 服务器设置（地址+端口，启动，监测，关闭）
├── package.json                # 依赖与脚本配置
├── package-lock.json           # 依赖锁定文件
├── tsconfig.json               # TypeScript/JS 编译配置
├── .eslintrc.js                # ESLint 配置
├── ecosystem.config.js         # PM2 进程管理配置
├── Dockerfile                  # Docker 容器化配置
├── Start.md                    # 启动与部署指南（PM2/Node/Docker）
├── Error-summary.md            # 常见问题与修复总结
├── Production-deployment/      # 生产部署相关示例配置
│   └── nginx.conf              # Nginx 反向代理示例配置
├── routes/                     # 接口路由文件夹
├── controllers/                # 接口逻辑函数文件夹
│   └── authController.js       # 示例：登录接口逻辑函数
├── middleware/                 # 中间件
│   └── cors.js                 # CORS 中间件（支持 Cookie）
├── utils/                      # 工具函数
│   └── proxy.js                # 代理转发到后端服务（读取 BACKEND_BASE_URL）
├── demo/                       # 演示和测试文件
│   ├── loginServer.js          # 登录服务演示
│   └── test.js                 # 测试文件
├── logs/                       # 日志目录（PM2/应用输出）
└── README.md                   # 介绍文档
```

## 启动方法

请参考 `Start.md` 获取完整步骤与说明（PM2、Node、Docker 三种方式）。

简要示例（详情见 `Start.md`）：

```bash
# 安装依赖
npm install

# Node 启动（开发）
npm run server

# PM2 启动（生产/长期运行）
pm2 start ecosystem.config.js --env production

# Docker 构建与运行
docker build -t higress-console-bff .
docker run -d -p 3001:3001 --name bff-service higress-console-bff
```

## 主要功能

- **会话管理**：提供登录接口 `/session/login`
- **代理转发**：通过 `utils/proxy.js` 转发请求到后端服务
- **跨域支持**：配置了 CORS 中间件，支持 Cookie
- **错误处理**：统一的错误处理和 404 处理

## 开发指南

- 所有接口路由：均可在 `routes/` 下扩展
- 业务逻辑：写在 `controllers/`
- 中间件：统一放在 `middleware/`
- 工具函数：放在 `utils/`
- 测示代码：放在 `demo/` 目录

## 启动配置来源

本项目的启动与转发配置主要来自以下文件（不是 `.env`）：

- `server.js`：设置BFF层端口等环境变量
- `app.js`：应用中间件、安全配置、路由注册
- `utils/proxy.js`：设置后端代理转发

可用环境变量（可选，用于覆盖默认值）：

- `BFF_PORT`：服务端口（默认 3001）
- `BFF_HOST`：服务地址（默认 `localhost` 或容器内为 `0.0.0.0`）
- `BACKEND_BASE_URL`：后端服务地址（默认见 `utils/proxy.js` 内设置）

## 生产部署相关文件说明

以下列表根据当前仓库实际文件更新：

| 文件/目录             | 作用说明                                                 |
| --------------------- | -------------------------------------------------------- |
| `package.json`        | BFF 依赖与脚本配置，支持单独安装/部署/运行 BFF 服务      |
| `ecosystem.config.js` | PM2 配置（应用名、集群、日志、环境变量等）               |
| `Dockerfile`          | Docker 容器化配置，构建镜像并以 `server.js` 启动         |
| `nginx.conf`          | 可选：Nginx 反向代理配置（按需在外部 Nginx 使用）        |
| `logs/`               | 日志目录（PM2、应用输出），建议结合 `pm2-logrotate` 清理 |
| `Start.md`            | 启动与部署指引（PM2/Node/Docker 的完整说明与命令）       |

**温馨提示：**

- 生产部署推荐使用PM2集群模式，日志建议配合`pm2-logrotate`插件自动清理。
- 详细步骤、常见问题、环境变量示例等请参考 `Start.md`。
- 其它如 Nginx、Docker 相关配置可根据实际生产环境需求选择使用。

## 未配置bff层接口

1. dashboard.ts文件：initDashboard函数（不知道怎么触发）
2. mcp.ts文件：listMcpConsumers+removeMcpConsumers函数（实在解决不了）

---