# 项目结构
<!-- AI_CONTEXT: 项目结构文档 -->
<!-- AI_PURPOSE: 为AI提供项目架构理解 -->
<!-- AI_LAST_UPDATED: 2025-09-06 -->
---

## 开发者须知（AI无需阅读）

1.本文为项目结构文件

## 📋 目录索引

- [模块依赖关系](#模块依赖关系)
- [基础项目结构](#基础项目结构)
- [src目录结构](#src目录结构)
- [BFF项目结构](#bff项目结构)
- [核心配置文件说明](#核心配置文件说明)
- [src目录配置说明](#src目录配置说明)
- [补充说明](#补充说明)

## 模块依赖关系

### 核心依赖关系
- **pages/** ↔ **services/** ↔ **interfaces/** 
  - 页面调用服务，服务使用接口定义
  - 数据流向：页面 → 服务 → 接口类型定义

- **components/** → **pages/**
  - 公共组件被页面使用
  - 组件提供可复用的UI功能

- **BFF/** → **后端API**
  - BFF层转发请求到真实后端服务
  - 数据流向：前端 → BFF → 后端API

### 详细依赖说明

#### 前端模块依赖
```
pages/ (页面层)
  ↓ 调用
services/ (服务层)
  ↓ 使用
interfaces/ (接口定义层)
  ↓ 依赖
components/ (组件层)
```

#### BFF模块依赖
```
BFF/routes/ (路由定义)
  ↓ 调用
BFF/controllers/ (控制器)
  ↓ 使用
BFF/utils/ (工具函数)
  ↓ 转发
后端API服务
```

#### 数据流向
```
用户操作 → 页面组件 → 服务函数 → 代理转发判断
    ↓         ↓         ↓         ↓
  组件库    接口定义   请求封装   前缀识别
                              ↓
                    /api前缀 → 直接转发到后端API
                    /bff前缀 → 转发到BFF层 → 后端API
```

### 开发流程依赖

1. **新增功能流程**：
   - `interfaces/` → 定义接口类型
   - `services/` → 实现API调用
   - `pages/` → 创建页面组件
   - `components/` → 创建可复用组件

2. **BFF开发流程**：
   - `BFF/routes/` → 定义路由
   - `BFF/controllers/` → 实现业务逻辑
   - `Error-summary.md` → 错误案例与解决方法
   - `BFF/utils/` → 添加工具函数
   - `demos/` → 测试相关文件夹`

## 基础项目结构

```
higress-console-frontend/
├── .husky/                          # Git hooks 配置
│   ├── _/                           # Husky 内部文件
│   └── pre-commit                   # 提交前检查脚本（代码规范检查）
├── .ice/                            # Ice.js 构建产物和运行时文件
│   ├── routes-config.bundle.mjs     # 路由配置打包文件
│   ├── routes-config.ts             # 路由配置定义
│   ├── data-loader.ts               # 数据加载器配置
│   ├── dataloader-config.ts         # 数据加载器配置文件
│   ├── routes.ts                    # 路由定义文件
│   ├── route-manifest.json          # 路由清单文件
│   ├── index.ts                     # 运行时入口文件
│   ├── env.ts                       # 环境变量定义
│   ├── env.server.ts                # 服务端环境配置
│   ├── entry.client.tsx             # 客户端入口文件
│   ├── entry.server.ts              # 服务端入口文件
│   ├── runtimeModules.ts            # 运行时模块配置
│   └── types.ts                     # 类型定义文件
├── build/                           # 构建输出目录
│   └── server/                      # 服务端构建产物
├── node_modules/                    # 依赖包目录
├── public/                          # 静态资源目录
│   ├── template.md                  # 路由批量导入模板文档
│   └── higress.jpg                  # 项目Logo图片
├── scripts/                         # 构建和工具脚本
│   └── check-i18n.js                # 国际化检查脚本
├── src/                             # 源代码目录（详细结构见下文）
├── .editorconfig                    # 编辑器配置文件
├── .eslintignore                    # ESLint 忽略文件配置
├── .eslintrc.js                     # ESLint 代码规范配置
├── .gitignore                       # Git 忽略文件配置
├── .lintstagedrc.json               # Lint-staged 配置
├── .prettierignore                  # Prettier 忽略文件配置
├── .prettierrc.js                   # Prettier 代码格式化配置
├── .stylelintignore                 # Stylelint 忽略文件配置
├── .stylelintrc.js                  # Stylelint 样式规范配置
├── ice.config.mts                   # Ice.js 配置文件
├── package.json                     # 项目依赖和脚本配置
├── package-lock.json                # 依赖锁定文件
├── tsconfig.json                    # TypeScript 配置
├── yarn.lock                        # Yarn 依赖锁定文件
└── README.md                        # 项目说明文档
```
## src目录结构（注意：ai-develop-help 已移至项目根目录）

```
src/
├── （ai-develop-help 已移动到项目根目录）
├── assets/                           # 静态资源文件
│   ├── GrafanaDataSourceUID.png      # Grafana数据源UID图片
│   └── logo.png                      # 项目Logo图片
├── BFF/                              # BFF层服务（详细结构见下文）
├── components/                       # 公共组件库
│   ├── AvatarDropdown/               # 头像下拉菜单组件
│   ├── ChatRobot/                    # 聊天机器人组件
│   ├── CodeEditor/                   # 代码编辑器组件
│   ├── Footer/                       # 页脚组件
│   ├── HighSearch/                   # 高级搜索组件
│   ├── LanguageDropdown/             # 语言切换下拉菜单
│   └── Navbar/                       # 导航栏组件
├── interfaces/                       # TypeScript接口定义
│   ├── ai-route.ts                   # AI路由接口
│   ├── common.ts                     # 通用接口
│   ├── config.ts                     # 配置接口
│   ├── consumer.ts                   # 消费者接口
│   ├── dashboard.ts                  # 仪表板接口
│   ├── domain.ts                     # 域名接口
│   ├── llm-provider.ts               # LLM提供商接口
│   ├── mcp.ts                        # MCP接口
│   ├── route.ts                      # 路由接口
│   ├── service.ts                    # 服务接口
│   ├── service-source.ts             # 服务源接口
│   ├── system.ts                     # 系统接口
│   ├── tls-certificate.ts            # TLS证书接口
│   ├── user.ts                       # 用户接口
│   └── wasm-plugin.ts                # WASM插件接口
├── locales/                          # 国际化文件
│   ├── en-US/                        # 英文语言包
│   │   └── translation.json          # 英文翻译文件
│   └── zh-CN/                        # 中文语言包
│       └── translation.json          # 中文翻译文件
├── models/                           # 数据模型
│   ├── config.ts                     # 配置模型
│   ├── system.ts                     # 系统模型
│   └── user.ts                       # 用户模型
├── pages/                            # 页面组件
│   ├── 404.tsx                       # 404错误页面
│   ├── _defaultProps.tsx             # 默认属性配置
│   ├── index.tsx                     # 首页
│   ├── layout.module.css             # 布局样式
│   ├── layout.tsx                    # 主布局组件
│   ├── ai/                           # AI相关页面
│   ├── consumer/                     # 消费者管理页面
│   ├── dashboard/                    # 仪表板页面
│   ├── domain/                       # 域名管理页面
│   ├── init/                         # 初始化页面
│   ├── login/                        # 登录页面
│   ├── mcp/                          # MCP管理页面
│   ├── plugin/                       # 插件管理页面
│   ├── route/                        # 路由管理页面
│   ├── service/                      # 服务管理页面
│   ├── service-source/               # 服务源管理页面
│   ├── system/                       # 系统管理页面
│   ├── tls-certificate/              # TLS证书管理页面
│   └── user/                         # 用户管理页面
├── services/                         # API服务层
│   ├── ai-route.ts                   # AI路由服务
│   ├── consumer.ts                   # 消费者服务
│   ├── dashboard.ts                  # 仪表板服务
│   ├── domain.ts                     # 域名服务
│   ├── llm-provider.ts               # LLM提供商服务
│   ├── mcp.ts                        # MCP服务
│   ├── plugin.ts                     # 插件服务
│   ├── route.ts                      # 路由服务
│   ├── service.ts                    # 服务管理
│   ├── service-source.ts             # 服务源管理
│   ├── system.ts                     # 系统服务
│   ├── tls-certificate.ts            # TLS证书服务
│   ├── user.ts                       # 用户服务
│   ├── request.tsx                   # 标准HTTP请求工具
│   ├── bffRequest.tsx                # BFF专用请求工具
│   └── exception.tsx                 # 异常处理组件
├── utils/                            # 工具函数
│   └── index.ts                      # 工具函数入口
├── app.ts                            # 应用入口文件
├── document.tsx                      # 文档模板
├── global.css                        # 全局样式
├── i18n.ts                           # 国际化配置
├── store.ts                          # 状态管理配置
├── switches.ts                       # 功能开关配置
└── typings.d.ts                      # 全局类型声明
```
## BFF项目结构

```
BFF/
├── controllers/                      # 控制器层（业务逻辑）
│   ├── authController.js             # 认证控制器
│   ├── routeController.js            # 路由控制器
│   ├── serviceController.js          # 服务控制器
│   ├── pluginController.js           # 插件控制器
│   ├── consumerController.js         # 消费者控制器
│   ├── dashboardController.js        # 仪表板控制器
│   ├── domainController.js           # 域名控制器
│   ├── mcpController.js              # MCP控制器
│   ├── llmProviderController.js      # LLM提供商控制器
│   ├── aiRouteController.js          # AI路由控制器
│   ├── systemController.js           # 系统控制器
│   ├── tlsCertificateController.js   # TLS证书控制器
│   └── serviceSourceController.js    # 服务源控制器
├── routes/                           # 路由定义
│   ├── index.js                      # 路由入口文件（统一管理所有子路由）
│   ├── auth.js                       # 认证路由
│   ├── route.js                      # 路由管理
│   ├── service.js                    # 服务管理
│   ├── plugin.js                     # 插件管理
│   ├── consumer.js                   # 消费者管理
│   ├── dashboard.js                  # 仪表板
│   ├── domain.js                     # 域名管理
│   ├── mcp.js                        # MCP管理
│   ├── llm-provider.js               # LLM提供商
│   ├── ai-route.js                   # AI路由
│   ├── system.js                     # 系统管理
│   ├── tls-certificate.js            # TLS证书
│   └── service-source.js             # 服务源管理
├── middleware/                       # 中间件
│   └── cors.js                       # CORS 中间件（支持 Cookie）
├── utils/                            # 工具函数
│   └── proxy.js                      # 代理转发工具（转发请求到后端服务）
├── demo/                             # 演示和测试文件
│   ├── loginServer.js                # 登录服务演示
│   └── test.js                       # 测试文件
├── Production-deployment/            # 生产环境部署配置
│   └── nginx.conf                    # Nginx 反向代理配置
├── node_modules/                     # 依赖包目录
├── .eslintrc.js                      # ESLint 临时配置文件
├── app.js                            # 初始化 Express 应用（加载中间件 + 路由）
├── server.js                         # 服务器设置（地址+端口，启动，监测，关闭）
├── ecosystem.config.js               # PM2 进程管理配置
├── Dockerfile                        # Docker 容器化配置
├── Error-summary.md                  # 错误案例与解决方法文档
├── Start.md                          # 启动说明文档
├── package.json                      # 依赖配置
├── package-lock.json                 # 依赖锁定文件
├── README.md                         # 项目说明
└── tsconfig.json                     # TypeScript配置
```
## 核心配置文件说明

### 1. ice.config.mts - Ice.js 主配置

- **SSR/SSG配置**：启用SSR，禁用SSG
- **代理配置**：自动识别前缀，并自动分发请求到真实后台接口或BFF接口
  - `/api` → 后端服务（默认：http://10.44.159.114:8081/）
  - `/bff` → BFF服务（默认：http://localhost:3001/）
- **插件配置**：request、store、auth插件
- **Webpack配置**：Monaco Editor静态资源复制

### 2. .husky/pre-commit - Git钩子

- 提交前自动运行代码规范检查
- 执行 `npm run lint:lint-staged` 命令

### 3. .ice/ - Ice.js运行时文件

- **路由系统**：routes.ts、routes-config.ts、route-manifest.json
- **数据加载**：data-loader.ts、dataloader-config.ts
- **环境配置**：env.ts、env.server.ts
- **入口文件**：entry.client.tsx、entry.server.ts

### 4. public/template.md - 路由批量导入模板

- 提供标准化的路由配置JSON模板
- 包含详细的字段说明和约束条件
- 支持批量导入多个路由配置

### 5. 代码规范配置文件

- **.editorconfig** - 编辑器统一配置（缩进、编码、换行符等）
- **.eslintrc.js** - ESLint代码规范配置（基于@iceworks/spec）
- **.eslintignore** - ESLint忽略文件配置
- **.prettierrc.js** - Prettier代码格式化配置
- **.prettierignore** - Prettier忽略文件配置
- **.stylelintrc.js** - Stylelint样式规范配置
- **.stylelintignore** - Stylelint忽略文件配置
- **.lintstagedrc.json** - Git提交前代码检查配置
- **.gitignore** - Git版本控制忽略文件配置

## src目录配置说明

### 1. interfaces - 接口相关的TypeScript定义

- **TypeScript定义**：该文件夹中的文件与services文件夹中的接口对应，用于定义接口的参数和返回值类型
- **使用范围**：不仅用于接口，也用于其他地方，如store

### 2. services - 接口函数定义

- **接口函数使用**：该文件夹中的文件与pages文件夹中文件对应，用于定义接口请求函数
- **接口函数定义**：该文件夹中的文件与interfaces文件夹中的接口对应，用于定义接口的实现

### 3. BFF - BFF服务层

- **代理设置**：BFF服务层的代理设置在 src\BFF\utils\proxy.js 文件中，BFF层相关配置在 src\BFF\server.js 文件中

## 补充说明

1. AI日志记录：每一次与AI交互都要记录在 ai-develop-help\log 文件夹下面对应日期的文件中

---