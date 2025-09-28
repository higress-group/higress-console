# 启动服务的方法

**总结：**

- 本文目的是介绍在**开发模式**下的简单部署并开启bff服务方法（**windows**）
- **适合情况**：本地开发模式，简单的dockerfile容器部署测试

## PM2部署启动

**需要文件：**ecosystem.config.js

### 1. PM2 前置环境配置

#### 系统要求

- **操作系统**: Linux/Unix/macOS/Windows
- **Node.js**: 版本 16+ (已在项目中配置)
- **内存**: 建议至少 512MB 可用内存
- **磁盘空间**: 至少 100MB 用于日志和进程管理

#### 安装PM2

```bash
# 全局安装PM2
npm install -g pm2

# 或者使用yarn
yarn global add pm2

# 验证安装
pm2 --version
```

### 2. PM2 配置文件

#### ecosystem.config.js 文件作用

`ecosystem.config.js` 是 PM2 的配置文件，用于定义应用启动参数和管理策略。

#### 主要配置项

```javascript
// 应用基本信息
name: 'higress-console-bff',    // 应用名称
script: 'server.js',            // 启动脚本

// 集群配置
instances: 'max',               // 使用所有CPU核心
exec_mode: 'cluster',           // 集群模式

// 环境变量
env: {                          // 开发环境
  NODE_ENV: 'development',
  BFF_PORT: 3001,
  BFF_HOST: '0.0.0.0',
  BACKEND_BASE_URL: 'https://localhost:8081',
},
env_production: {               // 生产环境
  NODE_ENV: 'production',
  BFF_PORT: 3001,
  BFF_HOST: '0.0.0.0',
  BACKEND_BASE_URL: 'https://localhost:8081',
},

// 日志配置
log_file: './logs/combined.log',    // 合并日志
out_file: './logs/out.log',         // 标准输出日志
error_file: './logs/error.log',     // 错误日志

// 监控配置
max_memory_restart: '800M',     // 内存超过800M时重启
autorestart: true,              // 自动重启
watch: false,                   // 文件监控（生产环境关闭）
```

### 3. PM2 常用指令

```bash
# 手动开启服务
pm2 start ecosystem.config.js --env production

# 保存当前 PM2 进程列表
pm2 save

# 生成并配置系统的自启动脚本，让 PM2 在系统重启时自动启动，并自动恢复你用 pm2 save 保存的进程列表。
pm2 startup

# 查看状态
pm2 status

# 查看日志
pm2 logs higress-console-bff

# 重启服务
pm2 restart higress-console-bff

# 停止服务
pm2 stop higress-console-bff

# 删除服务
pm2 delete higress-console-bff
```



## Node启动

### 1. Node 直接启动方式

#### 基础启动命令

```bash
# 开发环境下指令启动（根目录）
npm run server 

# 直接使用node启动
cd src/BFF
node server.js
```



## Docker部署

**需要文件：**Dockerfile

### 1. Docker 部署方式

#### 前置环境配置

- **Docker**: 版本 20.0+ 
- **Docker Compose**: 版本 2.0+（可选）
- **操作系统**: Linux/Windows/macOS

#### 构建镜像

```bash
# 进入BFF目录
cd src/BFF

# 构建Docker镜像
docker build -t higress-console-bff .

# 查看构建的镜像
docker images higress-console-bff
```

#### 运行容器

```bash
# 基础运行（临时容器，适合调试）
docker run -p 3001:3001 higress-console-bff

# 后台运行（后台容器，适合部署）
docker run -d -p 3001:3001 --name bff-service higress-console-bff

# 设置环境变量运行（适合生产）
docker run -d -p 3001:3001 -e NODE_ENV=production --name bff-service higress-console-bff
```

#### 容器管理

```bash
# 查看运行中的容器
docker ps

# 查看容器日志
docker logs bff-service

# 停止容器
docker stop bff-service

# 删除容器
docker rm bff-service

# 删除镜像
docker rmi higress-console-bff
```

