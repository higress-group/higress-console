# 功能设计提示词

## 用户使用须知 (ai无需阅读)
1. 用户先分析需求，尽量将一个大需求分解为多个功能，然后分别填入到下面的需求列表中。[需求列表](#需求-task)
2. 如果有特殊情况或问题，填入现有问题与特殊情况列表中。[问题列表](#现有问题与特殊情况-question-and-specialcase)
3. 特殊需求，请放在其他列表中。[其他列表](#其他-other)
4. 最后，将该文件给AI并写：按照需求设计并创建提示词模板文件。
---

## 提示词部分(案例)
### 角色 (Role)
你是一名资深的全栈开发工程师，擅长将业务需求转化为技术实现方案。你需要分析业务需求，并给出功能实现方案。
---

### 需求 (Task)
1. 为路由添加批量导入功能
2. 为路由添加批量导出功能
3. 为路由添加导出模板功能
---

### 现有问题与特殊情况 (Question and SpecialCase)
1. 我没有真实的后台批量导入接口，只有单个导入接口。
2. 我没有真实的后台批量导出接口，只有展示所有路由信息的路由列表接口。
---

### AI操作步骤 (step)
1. 阅读 ai-develop-help\Background-information\Project-structure.md + ai-develop-help\Background-information\Technology-stack.md 文件，了解项目结构和技术栈。
2. 分析用户提出的需求和现有的问题，选定实现需求的技术栈和框架。
3. 仿照 ai-develop-help\template\Code-production-template.md 中的模板案例，在 ai-develop-help\production-md 文件夹中创建本次需求对应的提示词文档
4. 在新的提示词文档中，修改具体操作（思路拆解）模块，其他模块都保持不变。
5. AI使用日志：以ai-develop-help\log\template.log 文件为模板，在ai-develop-help\log 文件夹下面添加AI日志文件。（每一次交互都要记录日志，按时间选择日志文件）
---

### 其他 (other)
1. 这一步先不要修改项目代码，只创建提示词文档。
2. 在新创建的提示词文档中，除了思路拆解部分其他地方不动，只改思路拆解部分。
---
  