<h1 align="center">
    <img src="https://img.alicdn.com/imgextra/i2/O1CN01NwxLDd20nxfGBjxmZ_!!6000000006895-2-tps-960-290.png" alt="Higress" width="240" height="72.5">
  <br>
  Gateway Console for Higress
</h1>

Higress Console 用于管理 Higress 的配置规则及其他开箱即用的能力集成，首个可用版本考虑基于 kubernetes 部署环境，预期包含服务管理、路由管理、域名管理等基础能力。
后续规划逐步迭代可观测能力、插件能力、登录管理能力，感兴趣的小伙伴一起 Hi~ gress~

## 前置介绍

此项目包含前端（NodeJS）、后端（Java）两个部分，前端（frontend）部分在构建完成后会随着后端代码（SpringBoot）一起部署。

## 配合 Higress 安装

在 Higress 安装完之后执行以下安装命令：

```bash
kubectl apply -f deploy/install.yaml
```

## 本地启动

### 前端项目

#### 第一步、配置 Node 环境

注：建议 Node 版本选择长期稳定支持版本 16.18.1 及以上

#### 第二步、安装依赖

```bash
cd frontend && npm install
```

#### 第三步、本地启动

```bash
npm start
```

#### 第四步、打包

```bash
npm run build
#打包生成文件 frontend/build
```

### 后端项目

#### 第一步、配置 Java & Maven 环境

注：建议 JDK 版本选择 17 及以上，Maven 版本选择 3.8.6 及以上（可直接使用项目内自带的 Maven Wrapper，即 mvnw）。

#### 第二步、编译 & 镜像

```bash
cd backend && sh build.sh
# 脚本中涉及docker命令，本地调试可注释
```

#### 第三步、部署 & 启动

```bash
sh start.sh --local
```

#### 第四步、访问

主页，默认 8080 端口

```html
http://localhost:8080
```

swagger，访问 swagger 页面了解 API 情况。

```html
http://localhost:8080/swagger-ui/index.html
```

# Higress Console

## 功能说明

### MCP Server Redis 配置验证

在用户新增 OpenAPI 类型的 MCP Server 时，系统会自动验证 `higress-config` 中的 Redis 配置。如果 Redis 地址仍为占位符，系统会提示用户配置正确的 Redis 地址，否则 MCP 功能将不可用。

#### 验证逻辑

1. **检查 ConfigMap 存在性**：验证 `higress-config` ConfigMap 是否存在且可读
2. **检查 higress 配置项**：验证 ConfigMap 中是否包含 `higress` 配置项
3. **检查 mcpServer 配置项**：验证 `higress` 配置中是否包含 `mcpServer` 配置项
4. **检查 Redis 配置**：验证 `mcpServer` 配置中是否包含 Redis 配置
5. **检查占位符**：验证 Redis 地址、用户名、密码是否为占位符值

#### 占位符检测

系统会检测以下占位符值：

- `address`: `REDIS_PLACEHOLDER_ADDRESS` (`"your.redis.host:6379"`)

#### 错误提示

当检测到占位符时，系统会记录相关日志并抛出自定义异常，同时提供详细的错误信息，包括：

- 当前配置的详细状态
- 需要修改的配置项
- 配置错误的后果说明

#### 实现位置

验证逻辑位于 `OpenApiSaveStrategy.validateRedisConfiguration()` 方法中，在保存 OpenAPI 类型的 MCP Server 时自动执行。

## 开发说明

### 代码结构

```
backend/sdk/src/main/java/com/alibaba/higress/sdk/service/mcp/save/
├── OpenApiSaveStrategy.java          # OpenAPI MCP Server 保存策略
├── DatabaseSaveStrategy.java         # Database MCP Server 保存策略
└── AbstractMcpServerSaveStrategy.java # 抽象保存策略基类
```

### 测试

相关测试位于 `backend/sdk/src/test/java/com/alibaba/higress/sdk/service/McpServerServiceTest.java` 中的 `testRedisConfigurationValidation()` 方法。

## 使用示例

当用户尝试创建 OpenAPI 类型的 MCP Server 时，如果 Redis 配置不正确，会收到类似以下的错误信息：

```
Redis 配置仍为占位符，请配置正确的 Redis 地址。当前配置：address=your.redis.host:6379, username=your_username, password=已配置。请修改 higress-config 中的 Redis 配置，否则 MCP 功能将不可用。
```
