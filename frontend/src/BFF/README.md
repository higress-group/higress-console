# BFF-Express 项目结构

```
bff-express/
├── app.js                   # 初始化 Express 应用（加载中间件 + 路由）
├── server.js                # 服务器设置（地址+端口，启动，监测，关闭）
├── .eslintrc.js             # ESLint 临时配置文件
├── routes/                  # 接口路由文件夹
│   └── auth.js              # 登录接口模块（/session/login）
├── controllers/             # 接口逻辑函数文件夹
│   └── authController.js    # 登录接口逻辑函数
├── middleware/              # 中间件
│   └── cors.js              # CORS 中间件（支持 Cookie）
├── utils/                   # 工具函数
│   └── proxy.js             # 代理转发工具（转发请求到后端服务）
├── demo/                    # 演示和测试文件
│   ├── loginServer.js       # 登录服务演示
│   └── test.js              # 测试文件
└── README.md                # 介绍文档
```

## 启动方法

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动服务：
   ```bash
   node server.js
   npm run server
   ```

3. 默认配置：.env文件
   - 端口：3001 (可通过 BFF_PORT 环境变量修改)
   - 地址：localhost (可通过 BFF_HOST 环境变量修改)
   - 后端服务：http://localhost:8081 (可通过 BACKEND_BASE_URL 环境变量修改)

## 主要功能

- **会话管理**：提供登录接口 `/session/login`
- **代理转发**：通过 `utils/proxy.js` 转发请求到后端服务
- **跨域支持**：配置了 CORS 中间件，支持 Cookie
- **错误处理**：统一的错误处理和 404 处理

## 开发指南

- 所有接口均可在 `routes/` 下扩展
- 业务逻辑建议写在 `controllers/`
- 中间件统一放在 `middleware/`
- 工具函数放在 `utils/`
- 演示代码放在 `demo/` 目录

## 环境变量

- `BFF_PORT`: BFF 服务端口 (默认: 3001)
- `BFF_HOST`: BFF 服务地址 (默认: localhost)
- `BACKEND_BASE_URL`: 后端服务地址 (默认: http://localhost:8081) 


# 生产部署相关文件说明

| 文件/目录           | 作用说明                                                       |
| ------------------- | -------------------------------------------------------------- |
| package.json        | BFF层独立依赖和脚本配置，支持单独安装/部署/运行BFF服务         |
| ecosystem.config.js | PM2 进程管理配置文件，定义服务名、实例数、日志、环境变量等     |
| Dockerfile          | Docker 容器化部署配置，支持将BFF服务打包为镜像                 |
| docker-compose.yml  | Docker Compose编排文件，支持一键启动BFF及相关服务（如Nginx）   |
| nginx.conf          | Nginx反向代理配置，支持API转发、负载均衡、限流、安全头等       |
| deploy.sh           | 一键部署脚本，支持pm2/docker/systemd多种部署方式               |
| env.example         | 环境变量示例文件，方便生产环境配置端口、后端地址等             |
| DEPLOYMENT.md       | 详细生产部署文档，包含PM2、Docker、Systemd等多种部署方式说明   |
| logs/               | 日志目录，PM2自动生成，存放服务运行日志，建议配合logrotate清理 |

---

**温馨提示：**
- 生产部署推荐使用PM2集群模式，日志建议配合`pm2-logrotate`插件自动清理。
- 详细部署流程、常见问题、环境变量说明等请参考`DEPLOYMENT.md`。
- 其它如Nginx、Docker相关配置可根据实际生产环境需求选择使用。


# 未配置bff层接口
1.dashboard.ts文件：initDashboard函数（不知道怎么触发）
2.mcp.ts文件：listMcpConsumers+removeMcpConsumers函数（实在解决不了）