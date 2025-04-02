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
| `server.allowTools` | array of string | 选填 | - | 允许调用的工具列表。如不指定，则允许所有工具 |

### REST-to-MCP 工具配置

| 名称                          | 数据类型        | 填写要求 | 默认值 | 描述                           |
| ----------------------------- | --------------- | -------- | ------ | ------------------------------ |
| `tools`                       | array of object | 选填     | []     | REST-to-MCP 工具配置列表       |
| `tools[].name`                | string          | 必填     | -      | 工具名称                       |
| `tools[].description`         | string          | 必填     | -      | 工具功能描述                   |
| `tools[].args`                | array of object | 必填     | []     | 工具参数定义                   |
| `tools[].args[].name`         | string          | 必填     | -      | 参数名称                       |
| `tools[].args[].description`  | string          | 必填     | -      | 参数描述                       |
| `tools[].args[].required`     | boolean         | 选填     | false  | 参数是否必需                   |
| `tools[].args[].default`      | any             | 选填     | -      | 参数默认值                     |
| `tools[].requestTemplate`     | object          | 必填     | -      | HTTP 请求模板                  |
| `tools[].requestTemplate.url` | string          | 必填     | -      | 请求 URL 模板                  |
| `tools[].requestTemplate.method` | string       | 必填     | -      | HTTP 方法(GET/POST等)          |
| `tools[].requestTemplate.headers` | array of object | 选填 | [] | 请求头模板                     |
| `tools[].requestTemplate.headers[].key` | string | 必填   | -      | 请求头名称                     |
| `tools[].requestTemplate.headers[].value` | string | 必填 | -      | 请求头值模板                   |
| `tools[].requestTemplate.body` | string         | 选填     | -      | 请求体模板                     |
| `tools[].responseTemplate`    | object          | 必填     | -      | HTTP 响应转换模板              |
| `tools[].responseTemplate.body` | string        | 必填     | -      | 响应体转换模板                 |

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
    required: true
  - name: city
    description: "指定查询的城市"
    required: false
  requestTemplate:
    url: "https://restapi.amap.com/v3/geocode/geo?key={{.config.apiKey}}&address={{.args.address}}&city={{.args.city}}&source=higress_mcp"
    method: GET
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
    required: true
  - name: days
    description: "天数(1-7)"
    required: false
    default: "3"
  requestTemplate:
    url: "https://api.weatherapi.com/v1/forecast.json?key={{.config.apiKey}}&q={{.args.city}}&days={{.args.days}}&aqi=no&alerts=no"
    method: GET
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
      
      {{if gt $day.day.maxtemp_c 30}}🔥 **高温预警!**{{end}}
      {{if lt $day.day.mintemp_c 0}}❄️ **低温预警!**{{end}}
      
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


## AI 提示词生成模板

在与 AI 助手一起生成 REST-to-MCP 配置的模板时，您可以使用以下提示词：

```
请帮我创建一个 Higress 的 REST-to-MCP 配置，将 REST API 转换为 MCP 工具。配置应遵循以下格式：

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
    required: true
  - name: arg2
    description: "参数2的描述"
    required: false
    default: "默认值"
  requestTemplate:
    url: "https://api.example.com/endpoint?key={{.config.apiKey}}&param={{.args.arg1}}"
    method: GET
    headers:
    - key: x-api-key
      value: "{{.config.apiKey}}"
    - key: Content-Type
      value: application/json
    body: |
      {
        "param1": "{{.args.arg1}}",
        "param2": "{{.args.arg2}}"
      }
  responseTemplate:
    body: |
      # 结果
      {{- range $index, $item := .items }}
      ## 项目 {{add $index 1}}
      - **名称**: {{ $item.name }}
      - **值**: {{ $item.value }}
      {{- end }}
```

我想转换的 REST API 是 [在此描述您的 API，包括端点、参数和响应格式]。

请生成一个完整的配置，包括：
1. 具有描述性名称和适当的服务器配置
2. 定义所有必要的参数，并提供清晰的描述和适当的必填/默认值
3. 创建正确格式化 API 请求的 requestTemplate，包括带有模板值的头部
4. 创建将 API 响应转换为适合 AI 消费的可读格式的 responseTemplate

模板使用 GJSON Template 语法 (https://github.com/higress-group/gjson_template)，该语法结合了 Go 模板和 GJSON 路径语法进行 JSON 处理。模板引擎支持：

1. 基本点表示法访问字段：{{.fieldName}}
2. 用于复杂查询的 gjson 函数：{{gjson "users.#(active==true)#.name"}}
3. 所有 Sprig 模板函数（类似 Helm）：{{add}}、{{upper}}、{{lower}}、{{date}} 等
4. 控制结构：{{if}}、{{range}}、{{with}} 等
5. 变量赋值：{{$var := .value}}

对于复杂的 JSON 响应，请考虑使用 GJSON 强大的过滤和查询能力来提取和格式化最相关的信息。
