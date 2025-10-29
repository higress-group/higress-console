# Technology Stack（技术栈）

## 开发者须知 (AI无需阅读)
1.本文为项目技术栈文件

## 📋 目录索引
- [前端技术栈](#前端技术栈)
- [BFF技术栈](#bff技术栈)
- [技术栈特点](#技术栈特点)
- [版本要求](#版本要求)
---

## 前端技术栈
### 1. 主要框架
- **React 18.2.0** - 主要前端框架（react-18!!!）
- **TypeScript 4.4.4** - 类型安全的 JavaScript 超集
- **Ice.js 3.0.0** - 阿里巴巴开源的 React 应用框架

### 2. UI 组件库
- **Ant Design 4.24.0** - 企业级 UI 设计语言和 React 组件库
- **@ant-design/pro-components 2.3.51** - Ant Design Pro 组件库

### 3. 状态管理
- **@ice/plugin-store** - Ice.js 的状态管理插件

### 4. HTTP 请求
- **request.tsx** - 真实后台接口请求封装，会在封装阶段给路由添加/api前缀
- **bffRequest.tsx** - BFF接口请求封装，不会在封装阶段给路由添加/bff前缀，需要在写接口时自己添加/bff前缀
- **ice.config.mts** - 配置请求代理，会自动识别前缀，并自动分发请求到真实后台接口或BFF接口

### 5. 代码规范和质量保证
- **ESLint 7.30.0** - JavaScript/TypeScript代码质量检查
- **@iceworks/spec** - 阿里巴巴前端规范配置
- **Prettier** - 代码格式化工具
- **Stylelint 13.2.1** - CSS/SCSS样式代码检查
- **Husky 8.0.3** - Git钩子管理
- **Lint-staged 13.1.2** - 暂存文件检查
- **EditorConfig** - 编辑器配置统一
---


## BFF技术栈
### 1. 核心框架
- **Express 4.18.2** - Node.js Web应用框架

### 2. 中间件
- **CORS 2.8.5** - 跨域请求处理中间件
- **Helmet 7.0.0** - 安全头设置中间件
- **Compression 1.7.4** - 响应压缩中间件
- **Express-rate-limit 6.7.0** - 请求限流中间件

### 3. HTTP客户端
- **Axios 1.2.1** - HTTP客户端库

### 4. 开发和部署工具
- **PM2 5.3.0** - 进程管理和集群部署
- **Nodemon 3.0.1** - 开发环境热重载
- **Nginx** - 反向代理和负载均衡
- **Docker** - 容器化部署支持
---

## 技术栈特点
### 前端特点
- **现代化框架**：React 18 + TypeScript + Ice.js
- **企业级UI**：Ant Design Pro组件库
- **类型安全**：完整的TypeScript支持
- **状态管理**：基于Ice.js的状态管理
- **代码质量**：完整的ESLint + Prettier + Stylelint规范

### BFF特点
- **轻量级**：基于Express的轻量级服务
- **安全性**：Helmet安全头 + CORS跨域处理
- **性能优化**：响应压缩 + 请求限流
- **可扩展性**：PM2集群部署 + Nginx负载均衡
- **开发体验**：热重载 + 容器化部署
---

## 版本要求
- **Node.js** >= 17.0.0
- **React** 18.2.0
- **TypeScript** 4.4.4
- **Express** 4.18.2
   
