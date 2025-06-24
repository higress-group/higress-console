---
title: MCP 服务器
keywords: [higress,mcp,ai]
description: MCP 服务器插件配置参考
---

## 功能说明

`mcp-server`插件提供了基于 Model Context Protocol (MCP) 的 AI 工具集成能力。MCP 是一种专为 AI 助手设计的协议，它定义了 AI 模型与外部工具和资源交互的标准方式。通过此插件，您可以：

1. 无需编写代码，将现有的 REST API 转换为 AI 助手可调用的工具
2. 利用 Higress 网关提供的统一认证、鉴权、限流和可观测性能力
3. 快速构建和部署 AI 工具和服务

![](https://img.alicdn.com/imgextra/i1/O1CN01wv8H4g1mS4MUzC1QC_!!6000000004952-2-tps-1764-597.png)

通过 Higress 托管 MCP Server，可以实现：
- 统一的认证和鉴权机制，确保 AI 工具调用的安全性
- 精细化的速率限制，防止滥用和资源耗尽
- 完整的审计日志，记录所有工具调用行为
- 丰富的可观测性，监控工具调用的性能和健康状况
- 简化的部署和管理，通过 Higress 插件机制快速添加新的 MCP Server

## 运行属性

插件执行阶段：`默认阶段`
插件执行优先级：`30`

## 配置字段

### 服务器配置

| 名称         | 数据类型   | 填写要求 | 默认值 | 描述                           |
| ------------ | ---------- | -------- | ------ | ------------------------------ |
| `server.name` | string     | 必填     | -      | MCP 服务器的名称。如果使用插件内置的 MCP 服务器（如 quark-search），只需配置此字段为对应的名称，无需配置 tools 字段。如果是 REST-to-MCP 场景，此字段可以填写任意值。 |
| `server.config` | object     | 选填     | {}     | 服务器配置，如 API 密钥等      |
| `server.securitySchemes` | array of object | 选填 | - | 定义可重用的认证方案，供工具引用。详见“认证与安全”章节。 |

### 允许的工具配置

| 名称         | 数据类型        | 填写要求 | 默认值 | 描述                                   |
| ------------ | --------------- | -------- | ------ | -------------------------------------- |
| `allowTools` | array of string | 选填     | -      | 允许调用的工具列表。如不指定，则允许所有工具 |

### REST-to-MCP 工具配置

| 名称                          | 数据类型        | 填写要求 | 默认值 | 描述                           |
| ----------------------------- | --------------- | -------- | ------ | ------------------------------ |
| `tools`                       | array of object | 选填     | []     | REST-to-MCP 工具配置列表       |
| `tools[].name`                | string          | 必填     | -      | 工具名称                       |
| `tools[].description`         | string          | 必填     | -      | 工具功能描述                   |
| `tools[].args`                | array of object | 必填     | []     | 工具参数定义                   |
| `tools[].args[].name`         | string          | 必填     | -      | 参数名称                       |
| `tools[].args[].description`  | string          | 必填     | -      | 参数描述                       |
| `tools[].args[].type`         | string          | 选填     | string | 参数类型（string, number, integer, boolean, array, object） |
| `tools[].args[].required`     | boolean         | 选填     | false  | 参数是否必需                   |
| `tools[].args[].default`      | any             | 选填     | -      | 参数默认值                     |
| `tools[].args[].enum`         | array           | 选填     | -      | 参数允许的值列表               |
| `tools[].args[].items`        | object          | 选填     | -      | 数组项的模式（当type为array时）  |
| `tools[].args[].properties`   | object          | 选填     | -      | 对象属性的模式（当type为object时）|
| `tools[].args[].position`     | string          | 选填     | -      | 参数在请求中的位置（query, path, header, cookie, body） |
| `tools[].requestTemplate`     | object          | 必填     | -      | HTTP 请求模板                  |
| `tools[].requestTemplate.url` | string          | 必填     | -      | 请求 URL 模板                  |
| `tools[].requestTemplate.method` | string       | 必填     | -      | HTTP 方法(GET/POST等)          |
| `tools[].requestTemplate.headers` | array of object | 选填 | [] | 请求头模板                     |
| `tools[].requestTemplate.headers[].key` | string | 必填   | -      | 请求头名称                     |
| `tools[].requestTemplate.headers[].value` | string | 必填 | -      | 请求头值模板                   |
| `tools[].requestTemplate.body` | string         | 选填     | -      | 请求体模板（与argsToJsonBody、argsToUrlParam、argsToFormBody互斥） |
| `tools[].requestTemplate.argsToJsonBody` | boolean | 选填  | false  | 当为true时，参数将直接用作JSON请求体（与body、argsToUrlParam、argsToFormBody互斥） |
| `tools[].requestTemplate.argsToUrlParam` | boolean | 选填  | false  | 当为true时，参数将作为查询参数添加到URL中（与body、argsToJsonBody、argsToFormBody互斥） |
| `tools[].requestTemplate.argsToFormBody` | boolean | 选填  | false  | 当为true时，参数将以application/x-www-form-urlencoded格式编码在请求体中（与body、argsToJsonBody、argsToUrlParam互斥） |
| `tools[].responseTemplate`    | object          | 必填     | -      | HTTP 响应转换模板              |
| `tools[].responseTemplate.body` | string        | 选填     | -      | 响应体转换模板（与prependBody和appendBody互斥） |
| `tools[].responseTemplate.prependBody` | string | 选填     | -      | 在响应体前插入的文本（与body互斥） |
| `tools[].responseTemplate.appendBody` | string  | 选填     | -      | 在响应体后插入的文本（与body互斥） |
| `tools[].security`                    | object  | 选填     | -      | 工具级别安全配置，用于定义 MCP Client 和 MCP Server 之间的认证方式，并支持凭证透传。 |
| `tools[].security.id`                 | string  | 当 `tools[].security` 配置时必填 | -      | 引用在 `server.securitySchemes` 中定义的认证方案 ID。 |
| `tools[].security.passthrough`        | boolean | 选填     | false  | 是否启用透明认证。如果为 `true`，则从 MCP Client 请求中提取的凭证将用于 `requestTemplate.security` 定义的认证方案。 |
| `tools[].requestTemplate.security`    | object  | 选填     | -      | HTTP 请求模板的安全配置，用于定义 MCP Server 和 REST API 之间的认证方式。 |
| `tools[].requestTemplate.security.id` | string  | 当 `tools[].requestTemplate.security` 配置时必填 | - | 引用在 `server.securitySchemes` 中定义的认证方案 ID。 |
| `tools[].requestTemplate.security.credential` | string | 选填 | - | 覆盖 `server.securitySchemes` 中定义的默认凭证。如果同时启用了 `tools[].security.passthrough`，则此字段将被忽略，优先使用透传的凭证。 |
| `tools[].errorResponseTemplate`       | string  | 选填     | -      | HTTP响应Status>=300 \\|\\| <200 时的错误响应转换模板 |

## 认证与安全

MCP Server 插件支持灵活的认证配置，以确保与后端 REST API 通信的安全性。

### 定义认证方案 (`server.securitySchemes`)

您可以在服务器级别定义一组可重用的认证方案。这些方案之后可以被各个工具引用，用于配置 MCP Server 向后端 REST API 发起请求时的认证方式。

**配置字段 (`server.securitySchemes[]`)**:

| 名称                | 数据类型 | 填写要求 | 描述                                                                 |
| ------------------- | -------- | -------- | -------------------------------------------------------------------- |
| `id`                | string   | 必填     | 认证方案的唯一标识符，供工具配置引用。                                 |
| `type`              | string   | 必填     | 认证类型，支持 `http` (用于 Basic 和 Bearer认证) 和 `apiKey`。         |
| `scheme`            | string   | 选填     | 当 `type` 为 `http` 时指定具体的方案，如 `basic` 或 `bearer`。           |
| `in`                | string   | 选填     | 当 `type` 为 `apiKey` 时指定 API 密钥的位置，如 `header` 或 `query`。    |
| `name`              | string   | 选填     | 当 `type` 为 `apiKey` 时指定 Header 名称或查询参数名称。                 |
| `defaultCredential` | string   | 选填     | 此方案的默认凭证。例如，对于 Basic Auth，可以是 "user:password"；对于 Bearer Token，是 Token 本身；对于 API Key，是 Key 本身。 |

**示例 (`server.securitySchemes`)**:

```yaml
server:
  name: my-api-server
  securitySchemes:
  - id: MyBasicAuth
    type: http
    scheme: basic
    defaultCredential: "admin:secretpassword" # 默认的用户名和密码
  - id: MyBearerToken
    type: http
    scheme: bearer
    defaultCredential: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." # 默认的Bearer Token
  - id: MyApiKeyInHeader
    type: apiKey
    in: header
    name: X-Custom-API-Key # API Key 在名为 X-Custom-API-Key 的 Header 中
    defaultCredential: "abcdef123456" # 默认的 API Key
  - id: MyApiKeyInQuery
    type: apiKey
    in: query
    name: "api_token" # API Key 在名为 api_token 的查询参数中
    defaultCredential: "uvwxyz789012"
```

### 在工具中应用认证方案

定义了 `server.securitySchemes` 后，您可以在每个工具的 `requestTemplate.security` 中通过 `id` 引用这些方案，以指定 MCP Server 调用后端 REST API 时使用的认证方式。

- **`tools[].requestTemplate.security.id`**: 引用 `server.securitySchemes` 中定义的认证方案的 `id`。
- **`tools[].requestTemplate.security.credential`**: 可选。如果提供，它将覆盖所引用方案中的 `defaultCredential`。这允许您为特定工具使用不同的凭证，即使它们共享相同的认证机制。

**示例**:

```yaml
tools:
- name: get-user-details
  # ... 其他工具配置 ...
  requestTemplate:
    url: "https://api.example.com/users/{{.args.userId}}"
    method: GET
    security:
      id: MyBearerToken # 使用上面定义的 MyBearerToken 方案
      # credential: "override_token_for_this_tool" # 可选：为此工具覆盖默认Token
# ...
- name: update-inventory
  # ... 其他工具配置 ...
  requestTemplate:
    url: "https://api.example.com/inventory/{{.args.itemId}}"
    method: POST
    security:
      id: MyApiKeyInHeader # 使用 MyApiKeyInHeader 方案
      # 此工具将使用 MyApiKeyInHeader 中定义的 defaultCredential
```

### 透明认证 (Passthrough Authentication)

透明认证功能允许将 MCP Client (例如 AI 助手) 调用 MCP Server 时提供的凭证，透传给 MCP Server 调用后端 REST API 时的认证过程。

**配置方式**:

1.  **确保相关认证方案已在 `server.securitySchemes` 中定义**。这包括客户端用于连接到 MCP Server 的方案，以及 MCP Server 用于连接到后端 REST API 的方案。
2.  **配置工具级别认证 (`tools[].security`)**:
    在需要透传凭证的工具中，配置 `security` 字段：
    - `id`: 引用 `server.securitySchemes` 中定义的、用于 **MCP Client 与 MCP Server 之间**的认证方案。插件将根据此方案从客户端请求中提取凭证，并清理原始请求中的该凭证。
    - `passthrough: true`: 启用透明认证。

3.  **配置请求模板认证 (`tools[].requestTemplate.security`)**:
    在工具的 `requestTemplate` 中，配置 `security` 字段：
    - `id`: 引用 `server.securitySchemes` 中定义的、用于 **MCP Server 与后端 REST API 之间**的认证方案。
    - 当 `tools[].security.passthrough` 为 `true` 时，从客户端提取的凭证将根据此 `requestTemplate.security` 方案应用于对后端 REST API 的调用。

**示例**:

假设 MCP Client 使用 Bearer Token 调用 MCP Server，而 MCP Server 需要使用 API Key 调用后端的 REST API。

```yaml
server:
  name: product-api-server
  securitySchemes:
  - id: ClientSideBearer # 客户端使用Bearer Token
    type: http
    scheme: bearer
  - id: BackendApiKey    # 后端API使用X-API-Key
    type: apiKey
    in: header
    name: X-API-Key
    # defaultCredential: "optional_default_backend_key"

tools:
- name: get-product-securely
  description: "获取产品信息（安全透传）"
  security: # 客户端 -> MCP Server 认证配置
    id: ClientSideBearer # MCP Server期望客户端使用此方案，并会尝试提取此类型的凭证
    passthrough: true   # 启用透传
  args:
  - name: product_id
    description: "产品ID"
    type: string
    required: true
  requestTemplate:
    security: # MCP Server -> 后端 REST API 认证配置
      id: BackendApiKey # 后端API需要此方案。透传的凭证将按此方案应用。
    url: "https://api.example.com/products/{{.args.product_id}}"
    method: GET
```

**工作流程**:

1.  MCP Client 发起请求到 MCP Server 的 `get-product-securely` 工具，并在 `Authorization` 头中携带 `Bearer <client_token>`。
2.  MCP Server 根据 `tools[].security` (id: `ClientSideBearer`) 识别出客户端使用的是 Bearer Token。它会从请求中提取 `<client_token>` 并移除原始的 `Authorization` 头。
3.  因为 `passthrough: true`，提取出的 `<client_token>` 被标记为透传凭证。
4.  MCP Server 准备调用后端 REST API。它查看 `requestTemplate.security` (id: `BackendApiKey`)。
5.  由于启用了透传，MCP Server 将之前提取的 `<client_token>` 作为凭证值，按照 `BackendApiKey` 方案（即作为名为 `X-API-Key` 的 HTTP Header）添加到对 `https://api.example.com/products/...` 的请求中。
6.  后端 REST API 收到请求，其中 `X-API-Key` Header 的值为 `<client_token>`。

**注意事项**:
- 当 `tools[].security.passthrough` 为 `true` 时，`requestTemplate.security.credential` 字段会被忽略，优先使用透传的凭证。
- 透传的凭证值会直接用于 `requestTemplate.security` 指定的认证方案。请确保凭证的格式与目标认证方案兼容。`extractAndRemoveIncomingCredential` 函数会尝试提取核心凭证部分（例如，Bearer token 值，Basic auth 的 base64 编码部分）。

## 参数类型支持

REST-to-MCP 工具支持多种参数类型，使您可以更精确地定义工具参数：

- **string**: 字符串类型（默认）
- **number**: 数字类型（浮点数）
- **integer**: 整数类型
- **boolean**: 布尔类型（true/false）
- **array**: 数组类型，使用 `items` 字段定义数组元素的模式
- **object**: 对象类型，使用 `properties` 字段定义对象属性的模式

示例：

```yaml
args:
- name: query
  description: "搜索关键词"
  type: string
  required: true
- name: limit
  description: "返回结果数量"
  type: integer
  default: 10
- name: filters
  description: "过滤条件"
  type: object
  properties:
    category:
      type: string
      enum: ["food", "hotel", "attraction"]
    price:
      type: integer
      minimum: 0
- name: coordinates
  description: "坐标点列表"
  type: array
  items:
    type: object
    properties:
      lat:
        type: number
      lng:
        type: number
```

## 参数位置控制

REST-to-MCP 工具支持通过 `position` 字段精确控制每个参数在请求中的位置。这使您可以更灵活地构建 API 请求，例如同时使用路径参数、查询参数和请求体参数。

### 支持的位置类型

- **query**: 参数将作为查询参数添加到 URL 中
- **path**: 参数将替换 URL 中的路径占位符，例如 `/pet/{petId}` 中的 `{petId}`
- **header**: 参数将作为 HTTP 头添加到请求中
- **cookie**: 参数将作为 Cookie 添加到请求中
- **body**: 参数将添加到请求体中（根据内容类型自动格式化为 JSON 或表单）

### 使用示例

```yaml
args:
- name: petId
  description: "宠物ID"
  type: string
  required: true
  position: path
- name: token
  description: "认证令牌"
  type: string
  required: true
  position: header
- name: sessionId
  description: "会话ID"
  type: string
  position: cookie
- name: limit
  description: "返回结果数量"
  type: integer
  default: 10
  position: query
- name: tags
  description: "标签列表"
  type: array
  position: body
```

在上面的示例中：
- `petId` 将替换 URL 中的 `{petId}` 占位符
- `token` 将作为 HTTP 头添加到请求中
- `sessionId` 将作为 Cookie 添加到请求中
- `limit` 将作为查询参数添加到 URL 中
- `tags` 将添加到请求体中

### 与批量参数处理选项的关系

当使用 `position` 指定参数位置时，这些参数将按照指定的位置处理，而不会受到批量参数处理选项（`argsToJsonBody`、`argsToUrlParam`、`argsToFormBody`）的影响。只有未指定 `position` 的参数才会受到这些批量选项的影响。

例如，如果您同时使用了 `position` 和 `argsToJsonBody`：
- 指定了 `position: query` 的参数会添加到 URL 查询字符串中
- 指定了 `position: header` 的参数会添加到 HTTP 头中
- 指定了 `position: path` 的参数会替换 URL 中的占位符
- 指定了 `position: cookie` 的参数会添加到 Cookie 中
- 指定了 `position: body` 的参数会添加到 JSON 请求体中
- 未指定 `position` 的参数会通过 `argsToJsonBody` 添加到 JSON 请求体中

此外，如果在 `requestTemplate` 中明确指定了 `body`，则所有 `position: body` 的参数都将被忽略，以避免冲突。

## 请求参数传递方式

除了使用 `position` 精确控制每个参数的位置外，REST-to-MCP 工具还支持四种批量参数处理方式，这些选项是**互斥的**，只能选择其中一种：

1. **body**: 使用模板手动构建请求体。这是最灵活的方式，允许您完全控制请求体的格式。
   ```yaml
   requestTemplate:
     body: |
       {
         "query": "{{.args.query}}",
         "filters": {{toJson .args.filters}},
         "options": {
           "limit": {{.args.limit}}
         }
       }
   ```

2. **argsToJsonBody**: 当设置为 `true` 时，未指定 `position` 的参数将直接作为 JSON 对象发送到请求体中，并自动添加 `Content-Type: application/json; charset=utf-8` 头。
   ```yaml
   requestTemplate:
     argsToJsonBody: true
   ```

3. **argsToUrlParam**: 当设置为 `true` 时，未指定 `position` 的参数将作为查询参数添加到 URL 中。
   ```yaml
   requestTemplate:
     argsToUrlParam: true
   ```

4. **argsToFormBody**: 当设置为 `true` 时，未指定 `position` 的参数将以 `application/x-www-form-urlencoded` 格式编码在请求体中，并自动添加相应的 Content-Type 头。
   ```yaml
   requestTemplate:
     argsToFormBody: true
   ```

这些选项简化了常见 API 调用模式的配置，无需手动构建请求体或 URL 参数。请注意，这四个选项是互斥的，在一个工具配置中只能使用其中一种。如果同时配置了多个选项，系统会报错并拒绝加载该工具配置。

## 模板语法

REST-to-MCP 功能使用 [GJSON Template](https://github.com/higress-group/gjson_template) 库进行模板渲染，它结合了 Go 的模板语法和 GJSON 的强大路径语法：

### 请求模板

用于构造 HTTP 请求 URL、头部和正文：
- 访问配置值：`.config.字段名`
- 访问工具参数：`.args.参数名`

### 响应模板

用于将 HTTP 响应转换为适合 AI 消费的格式：
- 使用 GJSON 路径语法访问 JSON 响应字段
- 使用模板函数如 `add`、`upper`、`lower` 等
- 使用控制结构如 `if`、`range` 等

GJSON Template 包含了所有 [Sprig](https://github.com/Masterminds/sprig) 的函数，提供了 70+ 种用于字符串操作、数学运算、日期格式化等的模板函数，功能等同于 Helm 的模板能力。

常用的 Sprig 函数包括：

- **字符串操作**：`trim`、`upper`、`lower`、`replace`、`plural`、`nospace`
- **数学运算**：`add`、`sub`、`mul`、`div`、`max`、`min`
- **日期格式化**：`now`、`date`、`dateInZone`、`dateModify`
- **列表操作**：`list`、`first`、`last`、`uniq`、`sortAlpha`
- **字典操作**：`dict`、`get`、`set`、`hasKey`、`pluck`
- **流程控制**：`ternary`、`default`、`empty`、`coalesce`
- **类型转换**：`toString`、`toJson`、`toPrettyJson`、`toRawJson`
- **编码/解码**：`b64enc`、`b64dec`、`urlquery`、`urlqueryescape`
- **UUID 生成**：`uuidv4`

有关所有可用函数的完整参考，请参阅 [Helm 函数文档](https://helm.sh/docs/chart_template_guide/function_list/)，因为 GJSON Template 包含了相同的函数集。

### GJSON 路径语法

GJSON 提供了强大的 JSON 查询能力：

- **点表示法**：`address.city`
- **数组索引**：`users.0.name`
- **数组迭代**：`users.#.name`
- **数组过滤**：`users.#(age>=30)#.name`
- **修饰符**：`users.@reverse.#.name`
- **多路径**：`{name:users.0.name,count:users.#}`
- **转义字符**：`path.with\.dot`

对于更复杂的查询，可以使用 `gjson` 函数：

```
<!-- 使用 gjson 函数进行复杂查询 -->
活跃用户: {{gjson "users.#(active==true)#.name"}}

<!-- 带有多个条件的数组过滤 -->
30岁以上的活跃开发者: {{gjson "users.#(active==true && age>30)#.name"}}

<!-- 使用修饰符 -->
用户名（倒序）: {{gjson "users.@reverse.#.name"}}

<!-- 迭代过滤结果 -->
管理员:
{{range $user := gjson "users.#(roles.#(==admin)>0)#"}}
  - {{$user.name}} ({{$user.age}})
{{end}}
```

完整的 GJSON 路径语法参考可查看 [GJSON 文档](https://github.com/tidwall/gjson#path-syntax)。

## 配置示例

### 使用内置 MCP 服务器示例：配置 quark-search

```yaml
server:
  name: "quark-search"
  config:
    apiKey: "xxxx"
```

此配置使用了 Higress 内置的 quark-search MCP 服务器。在这种情况下，只需要指定服务器名称和必要的配置（如 API 密钥），无需配置 tools 字段，因为工具已经在服务器中预定义好了。

### 基础配置示例：转换高德地图 API

```yaml
server:
  name: rest-amap-server
  config:
    apiKey: your-api-key-here
tools:
- name: maps-geo
  description: "将详细的结构化地址转换为经纬度坐标。支持对地标性名胜景区、建筑物名称解析为经纬度坐标"
  args:
  - name: address
    description: "待解析的结构化地址信息"
    type: string
    required: true
  - name: city
    description: "指定查询的城市"
    type: string
    required: false
  - name: output
    description: "输出格式"
    type: string
    enum: ["json", "xml"]
    default: "json"
  requestTemplate:
    url: "https://restapi.amap.com/v3/geocode/geo"
    method: GET
    argsToUrlParam: true
    headers:
    - key: x-api-key
      value: "{{.config.apiKey}}"
  responseTemplate:
    body: |
      # 地理编码信息
      {{- range $index, $geo := .geocodes }}
      ## 地点 {{add $index 1}}

      - **国家**: {{ $geo.country }}
      - **省份**: {{ $geo.province }}
      - **城市**: {{ $geo.city }}
      - **城市代码**: {{ $geo.citycode }}
      - **区/县**: {{ $geo.district }}
      - **街道**: {{ $geo.street }}
      - **门牌号**: {{ $geo.number }}
      - **行政编码**: {{ $geo.adcode }}
      - **坐标**: {{ $geo.location }}
      - **级别**: {{ $geo.level }}
      {{- end }}
```

此配置将高德地图的地理编码 API 转换为 AI 可调用的工具。当 AI 调用此工具时：

1. 使用提供的地址和城市参数构建 API 请求
2. 调用高德地图 API
3. 将 JSON 响应转换为易于阅读的 Markdown 格式
4. 将格式化后的结果返回给 AI 助手

### 高级配置示例：带有条件逻辑的复杂响应处理

```yaml
server:
  name: weather-api-server
  config:
    apiKey: your-weather-api-key
tools:
- name: get-weather
  description: "获取指定城市的天气预报信息"
  args:
  - name: city
    description: "城市名称"
    type: string
    required: true
  - name: days
    description: "天数(1-7)"
    type: integer
    required: false
    default: 3
  - name: include_hourly
    description: "是否包含每小时预报"
    type: boolean
    default: true
  requestTemplate:
    url: "https://api.weatherapi.com/v1/forecast.json"
    method: GET
    argsToUrlParam: true
    headers:
    - key: x-api-key
      value: "{{.config.apiKey}}"
  responseTemplate:
    body: |
      # {{.location.name}}, {{.location.country}} 天气预报

      **当前温度**: {{.current.temp_c}}°C
      **体感温度**: {{.current.feelslike_c}}°C
      **天气状况**: {{.current.condition.text}}
      **湿度**: {{.current.humidity}}%
      **风速**: {{.current.wind_kph}} km/h

      ## 未来预报
      {{range $index, $day := .forecast.forecastday}}
      ### {{$day.date}} ({{dateFormat "Monday" $day.date_epoch | title}})
      
      {{if gt $day.day.maxtemp_c 30}}**高温预警!**{{end}}
      {{if lt $day.day.mintemp_c 0}}**低温预警!**{{end}}
      
      - **最高温度**: {{$day.day.maxtemp_c}}°C
      - **最低温度**: {{$day.day.mintemp_c}}°C
      - **降水概率**: {{$day.day.daily_chance_of_rain}}%
      - **天气状况**: {{$day.day.condition.text}}
      
      #### 分时预报
      {{range $hour := slice $day.hour 6 24 3}}
      - **{{dateFormat "15:04" $hour.time_epoch}}**: {{$hour.temp_c}}°C, {{$hour.condition.text}}
      {{end}}
      {{end}}
```

此示例展示了：
- 使用条件语句 (`if`) 进行温度警告
- 使用日期格式化函数 (`dateFormat`)
- 使用数组切片 (`slice`) 选择特定时间的天气
- 嵌套循环遍历多天和多时段的天气数据

### 使用 PrependBody 和 AppendBody 的示例：OpenAPI 转换

当您想保留原始 API 响应但添加额外的上下文信息时，`prependBody` 和 `appendBody` 字段非常有用。这在将 OpenAPI/Swagger 规范转换为 MCP 工具时特别有价值，因为您可以保留原始 JSON 响应，同时为 AI 助手提供字段含义的说明。

```yaml
server:
  name: product-api-server
  config:
    apiKey: your-api-key-here
tools:
- name: get-product
  description: "获取产品详细信息"
  args:
  - name: product_id
    description: "产品ID"
    type: string
    required: true
  requestTemplate:
    url: "https://api.example.com/products/{{.args.product_id}}"
    method: GET
    headers:
    - key: Authorization
      value: "Bearer {{.config.apiKey}}"
  responseTemplate:
    prependBody: |
      # 产品信息
      
      以下是产品的详细信息，以JSON格式返回。字段说明：
      
      - **id**: 产品唯一标识符
      - **name**: 产品名称
      - **description**: 产品描述
      - **price**: 产品价格（美元）
      - **category**: 产品类别
      - **inventory**: 库存信息
        - **quantity**: 当前库存数量
        - **warehouse**: 仓库位置
      - **ratings**: 用户评分列表
        - **score**: 评分（1-5）
        - **comment**: 评论内容
      
      原始JSON响应：
      
    appendBody: |
      
      您可以使用这些信息来了解产品的详细信息、价格、库存状态和用户评价。
```

此示例展示了：
- 使用 `prependBody` 在原始 JSON 响应前添加字段说明
- 使用 `appendBody` 在响应末尾添加使用建议
- 保留原始 JSON 响应，使 AI 助手可以直接访问所有数据

### 使用 errorResponseTemplate自定义错误响应的示例

errorResponseTemplate用于在HTTP响应status code>=300 || <200时自定义响应转换模板。支持通过_headers访问map结构的header key value, 以便在errorResponseTemplate中引用header中的值自定义错误响应结果。

```yaml
server:
  config:
    appCode: ""
  name: "银行卡二三四要素"
tools:
- args:
  - description: "银行卡号"
    name: "cardno"
    position: "query"
    required: true
    type: "string"
  - description: "姓名（注意UrlEncode编码）"
    name: "name"
    position: "query"
    required: false
    type: "string"
  - description: "预留手机号"
    name: "mobile"
    position: "query"
    required: false
    type: "string"
  - description: "身份证号码"
    name: "idcard"
    position: "query"
    required: false
    type: "string"
  description: "验证卡号、姓名、手机号、证件号是否一致"
  errorResponseTemplate: |-
    statusCode: {{._headers.\\:status}}
    errorCode: {{gjson "_headers.x-ca-error-code"}}
    data: {{.data.value}}
  name: "银行卡二三四要素验证"
  requestTemplate:
    argsToFormBody: false
    argsToJsonBody: false
    argsToUrlParam: true
    method: "GET"
    url: "https://ckid.market.alicloudapi.com/lundear/verifyBank"
  responseTemplate:
    appendBody: |2-
        - 以下是返回参数说明
        - 参数名称: code, 参数类型: integer, 参数描述: 响应状态码
        - 参数名称: desc, 参数类型: string, 参数描述: 描述信息
        - 参数名称: data, 参数类型: object, 参数描述: 无描述
        - 参数名称: data.bankId, 参数类型: string, 参数描述: 银行编码
        - 参数名称: data.bankName, 参数类型: string, 参数描述: 银行名称
        - 参数名称: data.abbr, 参数类型: string, 参数描述: 银行英文缩写
        - 参数名称: data.cardName, 参数类型: string, 参数描述: 卡名称
        - 参数名称: data.cardType, 参数类型: string, 参数描述: 卡类型
        - 参数名称: data.cardBin, 参数类型: string, 参数描述: 卡bin
        - 参数名称: data.binLen, 参数类型: integer, 参数描述: 卡bin长度
        - 参数名称: data.area, 参数类型: string, 参数描述: 卡所在地区
        - 参数名称: data.bankPhone, 参数类型: string, 参数描述: 银行电话
        - 参数名称: data.bankUrl, 参数类型: string, 参数描述: 银行网址
        - 参数名称: data.bankLogo, 参数类型: string, 参数描述: 银行logo

```
此示例展示了：
- {{._headers.\\:status}} -> 访问HTTP响应code
- {{gjson "_headers.x-ca-error-code"}} -> 访问Header中"x-ca-error-code"的值
- {{.data.value}} -> 访问响应体 (e.g., JSON 字段 "data.value")

## AI 提示词生成模板

在与 AI 助手一起生成 REST-to-MCP 配置的模板时，您可以使用以下提示词：

```
请帮我创建一个 Higress 的 REST-to-MCP 配置，将 REST API 转换为 MCP 工具。

## 配置格式

配置应遵循以下格式：

```yaml
server:
  name: rest-api-server
  config:
    apiKey: 您的API密钥
tools:
- name: tool-name
  description: "详细描述这个工具的功能"
  args:
  - name: arg1
    description: "参数1的描述"
    type: string  # 可选类型: string, number, integer, boolean, array, object
    required: true
    position: path  # 可选位置: query, path, header, cookie, body
  - name: arg2
    description: "参数2的描述"
    type: integer
    required: false
    default: 10
    position: query
  - name: arg3
    description: "参数3的描述"
    type: array
    items:
      type: string
    position: body
  - name: arg4
    description: "参数4的描述"
    type: object
    properties:
      subfield1:
        type: string
      subfield2:
        type: number
    # 未指定position，将根据argsToJsonBody/argsToUrlParam/argsToFormBody处理
  requestTemplate:
    url: "https://api.example.com/endpoint"
    method: POST
    # 以下四个选项互斥，只能选择其中一种
    argsToUrlParam: true  # 将参数添加到URL查询参数
    # 或者
    # argsToJsonBody: true  # 将参数作为JSON对象发送到请求体
    # 或者
    # argsToFormBody: true  # 将参数以表单编码发送到请求体
    # 或者
    # body: |  # 手动构建请求体
    #   {
    #     "param1": "{{.args.arg1}}",
    #     "param2": {{.args.arg2}},
    #     "complex": {{toJson .args.arg4}}
    #   }
    headers:
    - key: x-api-key
      value: "{{.config.apiKey}}"
  responseTemplate:
    # 以下三个选项互斥，只能选择其中一种
    body: |
      # 结果
      {{- range $index, $item := .items }}
      ## 项目 {{add $index 1}}
      - **名称**: {{ $item.name }}
      - **值**: {{ $item.value }}
      {{- end }}
    # 或者
    # prependBody: |
    #   # API响应说明
    #   
    #   以下是原始JSON响应，字段含义如下：
    #   - field1: 字段1的含义
    #   - field2: 字段2的含义
    #   
    # appendBody: |
    #   
    #   您可以使用这些数据来...
```

## 模板语法

模板使用 GJSON Template 语法 (https://github.com/higress-group/gjson_template)，该语法结合了 Go 模板和 GJSON 路径语法进行 JSON 处理。模板引擎支持：

1. 基本点表示法访问字段：{{.fieldName}}
2. 用于复杂查询的 gjson 函数：{{gjson "users.#(active==true)#.name"}}
3. 所有 Sprig 模板函数（类似 Helm）：{{add}}、{{upper}}、{{lower}}、{{date}} 等
4. 控制结构：{{if}}、{{range}}、{{with}} 等
5. 变量赋值：{{$var := .value}}

对于复杂的 JSON 响应，请考虑使用 GJSON 强大的过滤和查询能力来提取和格式化最相关的信息。

## 我的 API 信息

我想转换的 REST API 是：

[在此描述您的 API，包括端点、参数和响应格式，或者粘贴 Swagger/OpenAPI 规范]
```

请根据以上信息生成一个完整的配置，包括：
1. 具有描述性名称和适当的服务器配置
2. 定义所有必要的参数，并提供清晰的描述和适当的类型、必填/默认值
3. 选择合适的参数传递方式（argsToUrlParam、argsToJsonBody、argsToFormBody 或自定义 body）
4. 创建将 API 响应转换为适合 AI 消费的可读格式的 responseTemplate
