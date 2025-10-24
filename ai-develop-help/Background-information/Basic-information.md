# 项目技术栈

## 开发者须知（AI无需阅读此部分）

1.本文为项目背景文件的中文版本

### 前端：

**1.主要框架：**

- React 18.2.0 - 主要前端框架（react-18!!!）
- TypeScript 4.4.4 - 类型安全的 JavaScript 超集
- Ice.js 3.0.0 - 阿里巴巴开源的 React 应用框架

**2.UI 组件库：**

- Ant Design 4.24.0 - 企业级 UI 设计语言和 React 组件库
- @ant-design/pro-components 2.3.51 - Ant Design Pro 组件库

**3.状态管理：**

- @ice/plugin-store: Ice.js 的状态管理插件

**4.HTTP 请求：**

- **servers：**

    request.tsx：真实后台接口请求封装，会在封装阶段给路由添加/api前缀
    bffRequest.tsx：BFF接口请求封装，不会在封装阶段给路由添加/bff前缀，需要在写接口时自己添加/bff前缀
    ice.config.mts：配置请求代理，会自动识别前缀，并自动分发请求到真实后台接口或BFF接口
- **BFF-Express 技术栈**

    - **Express 4.18.2** - Node.js Web应用框架
    - **CORS 2.8.5** - 跨域请求处理中间件
    - **Axios 1.2.1** - HTTP客户端库
    - **Helmet 7.0.0** - 安全头设置中间件
    - **Compression 1.7.4** - 响应压缩中间件
    - **Express-rate-limit 6.7.0** - 请求限流中间件
    - **PM2 5.3.0** - 进程管理和集群部署
    - **Nodemon 3.0.1** - 开发环境热重载
    - **Nginx** - 反向代理和负载均衡
    - **Docker** - 容器化部署支持


## 项目结构

### 基础项目结构（src文件夹单独展示）

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

### src目录结构

```
src/
├── （ai-develop-help 已移动到项目根目录）
│   ├── Background-information/       # 背景信息文档
│   │   └── Basic-information.md      # 基础信息文档
│   ├── log/                          # AI开发日志
│   └── Code-production-template.md   # 代码生产模板
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
├── interfaces/                       # TypeScript定义
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
├── services/                         # API服务层（详细结构见上文）
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

#### src配置说明

**1. interfaces - 接口相关的TypeScript定义**

- **TypeScript定义** 该文件夹中的文件与services文件夹中的接口对应，用于定义接口的参数和返回值类型。（但是不仅用于接口，也用于其他地方，如store）

**2. services - 接口函数定义**

- **接口函数使用** 该文件夹中的文件与pages文件夹中文件对应，用于定义接口请求函数。
- **接口函数定义** 该文件夹中的文件与interfaces文件夹中的接口对应，用于定义接口的实现。

**3. BFF - 接口转接层服务**

```
BFF-Express 项目结构
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

### 其他核心配置文件说明

**1. ice.config.mts - Ice.js 主配置**

- **SSR/SSG配置**：启用SSR，禁用SSG
- **代理配置**：自动识别前缀，并自动分发请求到真实后台接口或BFF接口
    - `/api` → 后端服务（默认：http://10.44.159.114:8081/）
    - `/bff` → BFF服务（默认：http://localhost:3001/）
- **插件配置**：request、store、auth插件
- **Webpack配置**：Monaco Editor静态资源复制

**2. .husky/pre-commit - Git钩子**

- 提交前自动运行代码规范检查
- 执行 `npm run lint:lint-staged` 命令

**3. .ice/ - Ice.js运行时文件**

- **路由系统**：routes.ts、routes-config.ts、route-manifest.json
- **数据加载**：data-loader.ts、dataloader-config.ts
- **环境配置**：env.ts、env.server.ts
- **入口文件**：entry.client.tsx、entry.server.ts

**4. public/template.md - 路由批量导入模板**

- 提供标准化的路由配置JSON模板
- 包含详细的字段说明和约束条件
- 支持批量导入多个路由配置

**5. 代码规范配置文件**

- **.editorconfig** - 编辑器统一配置（缩进、编码、换行符等）
- **.eslintrc.js** - ESLint代码规范配置（基于@iceworks/spec）
- **.eslintignore** - ESLint忽略文件配置
- **.prettierrc.js** - Prettier代码格式化配置
- **.prettierignore** - Prettier忽略文件配置
- **.stylelintrc.js** - Stylelint样式规范配置
- **.stylelintignore** - Stylelint忽略文件配置
- **.lintstagedrc.json** - Git提交前代码检查配置
- **.gitignore** - Git版本控制忽略文件配置

------