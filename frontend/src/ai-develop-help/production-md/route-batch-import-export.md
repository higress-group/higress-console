# 路由批量导入导出功能开发提示词

## 📋 目录索引
- [角色定义](#角色-role)
- [任务描述](#任务-task)
- [输出格式](#输出格式-format)
- [背景信息](#背景信息-context)
- [其他需求](#其他需求-other)

---

## 角色 (Role)
你是一名资深的全栈开发工程师，擅长将业务需求转化为技术实现方案。你需要分析业务需求，并给出功能实现方案。

---

## 任务 (Task)
请帮我添加功能：路由支持批量导入和导出

### 需要用到的文件：
1. `src/pages/route/index.tsx` - 路由管理页面
2. `src/services/route.ts` - 路由服务接口
3. `src/BFF` - BFF服务层
4. `src/BFF/demo/upload.json` - 上传数据示例
5. `public/template.md` - 导出模板文件

### 具体操作（思路拆解）：

**最终需求：** 在 `src/pages/route/index.tsx` 中添加批量导入和导出功能按钮，和导出模板文件按钮

**实现步骤：**
1. 在 `src/pages/route/index.tsx` 中添加三个功能按钮
2. 在 `src/services/route.ts` 中添加批量导入和导出+模板文件功能接口函数
3. 在 `src/BFF` 中添加批量导入和导出+模板文件功能接口实现
4. `public/template.md`，这个文件是导出模板的模板文件
5. 后台没有批量导入接口，只有单个导入接口，所以这里需要通过单个的导入接口实现批量导入（`src/BFF/demo/多个路由创建的模板.md`，这个文件是批量导入数据格式介绍）
6. 批量导出接口后台也没有，这里通过 `/bff/v1/routes` 接口获取所有路由的信息（`src/BFF/demo/download.json` 是接口返回的数据），然后直接将路由信息整理为json文件给用户就行了

---

## 输出格式 (Format)

### 技术栈要求：
- 该项目的技术栈：`src/ai-develop-help/Background-information/Technology-stack.md`

### 项目结构：
- 项目结构：`src/ai-develop-help/Background-information/Project-structure.md`

### 代码规范：
- 特殊规范：前端代码尽量少出现中文，必须情况时用翻译文件：`src/locales/zh-CN/translation.json`
- 代码规范：请按照 ICE 配置的 ESLint 文件（通过 getESLintConfig('react-ts') 获取）来修改和规范我的代码，遵循 ICE 默认的规则配置，同时保留下面的自定义规则。eslint文件位于（`frontend/.eslintrc.js`），需要规范代码的文件位于（`frontend/src/app/xxx/xxx.tsx`）

---

## 背景信息 (Context)

### 现有问题与特殊情况：
1. 我没有真实的后台批量导入接口，只有单个导入接口。
2. 我没有真实的后台批量导出接口，只有展示所有路由信息的路由列表接口。

### 其他需求：
- 第一遍生产的代码在完成功能的情况下尽量简单，不要添加测试文件和README介绍文件。

### AI使用日志：
- 在 `src/ai-develop-help/log` 文件夹下面添加AI日志文件。以 `src/ai-develop-help/log/template.log` 文件为模板，将AI生成的代码保存为json数据，并保存在log文件夹中。（每天一个日志文件，文件名为日期）

### 日志要求：
- 每一次交互都要记录日志

### 其他补充：
- 当在bff层创建get请求时，注意 `src/BFF/summary.md` 文件中记录的错误，并修改代码。

---

## 其他需求 (Other)
1. 这一步先不要修改项目代码，只创建提示词文档。
2. 在新创建的提示词文档中，除了思路拆解部分其他地方不动，只改思路拆解部分。
3. 我上传的文件格式为json

---