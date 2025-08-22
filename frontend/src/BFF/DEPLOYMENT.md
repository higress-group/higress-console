# BFF层生产环境部署指南

## 概述

本文档介绍如何将Higress Console的BFF层部署到生产环境。

## 部署方式

### 1. PM2部署（推荐）

#### 前置条件
- Node.js 16+
- PM2: `npm install -g pm2`

#### 部署步骤
```bash
# 进入BFF目录
cd src/BFF

# 安装依赖
npm install

# 配置环境变量
请新建 `.env` 文件，并根据实际需求填写环境变量内容。

# 使用PM2部署
chmod +x deploy.sh
./deploy.sh pm2
```

#### PM2管理命令
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

### 2. Docker部署

#### 前置条件
- Docker
- Docker Compose

#### 部署步骤
```bash
# 进入BFF目录
cd src/BFF

# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f bff

# 停止服务
docker-compose down
```

#### Systemd管理命令
```bash
# 查看状态
sudo systemctl status higress-bff

# 查看日志
sudo journalctl -u higress-bff -f

``` 