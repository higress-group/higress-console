# Dubbo协议转换功能实现提示词

## 开发者使用须知（AI无需阅读）

1. 阅读任务描述的具体操作步骤，若不满意可以自己修改
2. "其他需求"前三行不用动，如无特殊需求可忽略
3. 提交文档，上传"需要用到的文件"，让AI生成代码。

## 📋 目录索引

- [模版说明](#模版说明)
- [模板结构说明](#模板结构说明)
- [模版案例](#模版案例)

## 模版说明

P-RTFCM是一个用于AI辅助开发的提示词框架，包含以下关键部分：
- **P（Produce）**: 功能开发，代码生成（框架作用）
- **R（Role）**: 明确AI助手的角色和职责
- **T（Task）**: 具体描述需要完成的任务
- **F（Format）**: 指定输出格式和要求
- **C（Context）**: 提供相关的背景信息和约束条件

## 模板结构说明

### 必填部分

- **Role** - 定义AI的角色和职责，明确开发领域
- **Task** - 具体的开发任务，包含文件路径和实现步骤
- **Format** - 输出格式要求，包含技术栈、项目结构、代码规范
- **Context** - 背景信息和约束条件，包含日志要求、错误处理等

### 可选部分

- **其他需求** - 补充说明和特殊要求
- **重要补充** - 特殊格式或约束条件

## 模版案例

### 角色: 你是一个资深全栈开发工程师，具有丰富的前端和后端开发经验，擅长React、TypeScript、Express.js等技术栈，熟悉Dubbo协议转换和HTTP到RPC的桥接技术。

### 需求任务: 请帮我实现Dubbo协议转换功能

[必选]
1. 需要用到的文件有：frontend/src/pages/route/index.tsx、frontend/src/services/route.ts、frontend/src/interfaces/route.ts、BFF/controllers/routeController.js、BFF/routes/route.js、frontend/public/http2rpc-config.yaml

2. 具体操作（思路拆解）：
--最终需求：在路由配置页面实现将一个Dubbo服务以HTTP接口暴露出来，从而用HTTP请求实现对Dubbo接口的调用
--实现步骤：
    1. 在frontend/src/pages/route/index.tsx的"编辑路由"弹窗中添加Dubbo协议转换开关按钮
    2. 当开关开启时，弹出Dubbo配置弹窗，包含以下配置项：
       - 服务来源（选择框，调用service-sources接口获取服务来源列表）
       - 服务接口名（输入框，例如："com.alibaba.nacos.example.dubbo.service.DemoService"）
       - 服务分组（选择框，数据来自服务来源列表中的服务分组列表）
       - HTTP方法映射配置（动态表格）：
         * 第一列：HTTP方法（选择框：GET、POST）
         * 第二列：服务接口方法名（输入框，例：sayName）
         * 第三列：HTTP请求路径（输入框，例：/dubbo/hello）
         * 第四列：参数类型（选择框：params或paramFromEntireBody）
    3. 在frontend/src/interfaces/route.ts中添加Dubbo配置相关的TypeScript接口定义
    4. 在frontend/src/services/route.ts中添加Dubbo配置相关的API调用函数
    5. 在BFF/controllers/routeController.js中实现Dubbo配置处理逻辑：
       - 接收前端配置数据
       - 以frontend/public/http2rpc-config.yaml为模板生成协议转换文件
       - 使用kubectl apply命令部署配置
    6. 在BFF/routes/route.js中添加Dubbo配置相关的路由定义
    7. 实现配置验证和错误处理机制

[可选]
3. 其他需求

### 格式要求: 

[必选]
- 该项目的技术栈：ai-develop-help\Background-information\Technology-stack.md

- 项目结构：ai-develop-help\Background-information\Project-structure.md

- 特殊规范：前端代码尽量少出现中文，必须情况时用翻译文件：src\locales\zh-CN\translation.json

- 代码规范：请按照 ICE 配置的 ESLint 文件（通过 getESLintConfig('react-ts') 获取）来修改和规范我的代码，遵循 ICE 默认的规则配置，同时保留下面的自定义规则。eslint文件位于（frontend\.eslintrc.js），需要规范代码的文件位于（frontend\src\app\xxx\xxx.tsx）

### 内容补充: 

[必选]
- 其他需求：第一遍生产的代码在完成功能的情况下尽量简单，不要添加测试文件和README介绍文件。

- AI使用日志：在ai-develop-help\log文件夹下面添加AI日志文件。以ai-develop-help\log\template.log文件为模板，将AI生成的代码保存为json数据，并保存在log文件夹中。（每天一个日志文件，文件名为日期）

- 日志要求：每一次交互都要记录日志

- 其他补充：当在bff层创建get请求时，注意src\BFF\Error-summary.md文件中记录的错误，并修改代码。

[可选]
- 重要补充：Dubbo协议转换功能需要与现有的路由管理功能无缝集成，确保用户体验的一致性

---
