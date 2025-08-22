#!/bin/bash

# BFF部署脚本
set -e

echo "🚀 开始部署 Higress Console BFF..."

# 检查环境变量
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=production
fi

# 检查 node_modules 是否存在，不存在则安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 未检测到 node_modules，正在安装依赖..."
    npm install
else
    echo "📦 已检测到 node_modules，跳过依赖安装。"
fi

# 创建日志目录
mkdir -p logs

# 选择部署方式
case "$1" in
    "pm2")
        echo "🔧 使用PM2部署..."
        if command -v pm2 &> /dev/null; then
            pm2 start ecosystem.config.js --env production
            pm2 save
            pm2 startup
        else
            echo "❌ PM2未安装，请先安装: npm install -g pm2"
            exit 1
        fi
        ;;
    "docker")
        echo "🐳 使用Docker部署..."
        docker-compose up -d --build
        ;;
    "systemd")
        echo "🔧 使用Systemd部署..."
        # 创建systemd服务文件
        sudo tee /etc/systemd/system/higress-bff.service > /dev/null <<EOF
[Unit]
Description=Higress Console BFF
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=$(pwd)
Environment=NODE_ENV=production
Environment=BFF_PORT=3001
Environment=BFF_HOST=0.0.0.0
Environment=BACKEND_BASE_URL=http://localhost:8081
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
        sudo systemctl daemon-reload
        sudo systemctl enable higress-bff
        sudo systemctl start higress-bff
        ;;
    *)
        echo "🔧 使用Node.js直接启动..."
        node server.js
        ;;
esac

echo "✅ 部署完成！"
echo "📊 健康检查: http://localhost:3001/health" 