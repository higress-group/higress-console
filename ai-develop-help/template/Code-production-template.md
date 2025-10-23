# 代码生成RTFC模版

## 开发者使用须知（AI无需阅读）

1. 阅读任务描述的具体操作步骤，若不满意可以自己修改
2. 其他需求前三行不用动，如无特殊需求可忽略
3. 提交AI生成代码

## 📋 目录索引

- [模版说明](#模版说明)
- [模板结构说明](#模板结构说明)
- [模版案例](#模版案例)
- [使用技巧](#使用技巧（AI无需阅读）)

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

### 角色: 你是一个资深全栈开发工程师，具有丰富的[前端领域]开发经验。

### 需求任务: 请帮我添加功能：路由支持批量导入和导出

[必选]
1. 需要用到的文件有：src\pages\route\index.tsx、src\services\route.ts、src\BFF、src\BFF\demo\upload.json

2. 具体操作（思路拆解）：
--最终需求：在src\pages\route\index.tsx中添加批量导入和导出功能按钮，和导出模板文件按钮
--实现步骤：
    1. 在src\pages\route\index.tsx中添加三个功能按钮
    2. 在src\services\route.ts中添加批量导入和导出+模板文件功能接口函数
    3. 在src\BFF中添加批量导入和导出+模板文件功能接口实现
    4. public\template.md，这个文件是导出模板的模板文件
    5. 后台没有批量导入接口，只有单个导入接口，所以这里需要通过单个的导入接口实现批量导入（src\BFF\demo\多个路由创建的模板.md，这个文件是批量导入数据格式介绍）
    6. 批量导出接口后台也没有，这里通过/bff/v1/routes接口获取所有路由的信息（src\BFF\demo\download.json是接口返回的数据），然后直接将路由信息整理为json文件给用户就行了

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
- 重要补充：我上传的文件格式为json

## 使用技巧（AI无需阅读）

1. 开发新功能时，最好自己有一个完成功能的代码思路。如果没有可以先问ai，直接让AI完成代码效果可能不好。
2. 将基础步骤中要用的文件都给到ai，让ai根据这些文件来生成代码。
3. 当AI出现错误时，使用以下模板描述错误，让AI进行修复。

---