# 功能设计提示词

## 用户使用须知（AI无需阅读）

1. 用户先分析需求，尽量将一个大需求分解为多个功能，然后分别填入到下面的需求列表中。[需求列表](#需求)
2. 如果有特殊情况或问题，填入现有问题与特殊情况列表中。[问题列表](#现有问题与特殊情况)
3. 特殊需求，请放在其他列表中。[其他列表](#其他)
4. 最后，将该文件给AI并写：按照需求设计并创建提示词模板文件。

## 提示词部分（案例）

### 角色

你是一名资深的全栈开发工程师，擅长将业务需求转化为技术实现方案。你需要分析业务需求，并给出功能实现方案。

### 需求

1. 总需求：在路由配置页面实现将一个Dubbo服务以HTTP接口暴露出来，从而用HTTP请求实现对Dubbo接口的调用
2. 当编辑某个路由时，在“编辑路由”弹窗加一个选择按钮，当选为开启时弹出来一个配置弹窗在页面中央（附文字说明：开启dubbo协议转换）
3. 调用service-sources接口获得所有服务来源列表，配置弹窗内容如下（只做我提出来的，不要多加）：服务来源（选择框，用户选择一个服务来源）、服务接口名（例如：“com.alibaba.nacos.example.dubbo.service.DemoService”）、服务分组（选择框，数据来自：服务来源列表中的服务分组列表）、填空列表：每一行第第一空：支持的 HTTP 方法（选择框：GET、POST等等（先只做GET和POST））、第二空：服务接口的方法名（填空，例：sayName）、第三空：HTTP请求路径（填空，例：/dubbo/hello）、的四空（选择框）：params或paramFromEntireBody（根据选择不同，后面参数选择不同：参考frontend\public\http2rpc-config.yaml中的）
4. 上面的内容填完以后点击确定，后台“接口A”以frontend\public\http2rpc-config.yaml为模板，把上面的配置内容填入生成协议转换文件，并在kind中使用类似下面的指令实现部署
```
kubectl apply -f http2rpc-config.yaml
```

### 现有问题与特殊情况

1. 接口A没有真实的后台接口，在BFF层中实现所有功能逻辑

### AI操作步骤

1. 阅读 ai-develop-help\Background-information\Project-structure.md + ai-develop-help\Background-information\Technology-stack.md 文件，了解项目结构和技术栈。
2. 分析用户提出的需求和现有的问题，选定实现需求的技术栈和框架。
3. 仿照 ai-develop-help\template\Code-production-template.md 中的模板案例，在 ai-develop-help\production-md 文件夹中创建本次需求对应的提示词文档
4. 在新的提示词文档中，修改具体操作（思路拆解）模块，其他模块都保持不变。
5. AI使用日志：以ai-develop-help\log\template.log 文件为模板，在ai-develop-help\log 文件夹下面添加AI日志文件。（每一次交互都要记录日志，按时间选择日志文件）

### 其他

1. 这一步先不要修改项目代码，只创建提示词文档。
2. 在新创建的提示词文档中，除了思路拆解部分其他地方不动，只改思路拆解部分。

---