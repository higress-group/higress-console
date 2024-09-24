---
title: AI 代理
keywords: [ AI网关, AI代理 ]
description: AI 代理插件配置参考
---

## 功能说明

`AI 代理`插件实现了基于 OpenAI API 契约的 AI 代理功能。目前支持 OpenAI、Azure OpenAI、月之暗面（Moonshot）和通义千问等 AI
服务提供商。

> **注意：**

> 请求路径后缀匹配 `/v1/chat/completions` 时，对应文生文场景，会用 OpenAI 的文生文协议解析请求 Body，再转换为对应 LLM 厂商的文生文协议

> 请求路径后缀匹配 `/v1/embeddings` 时，对应文本向量场景，会用 OpenAI 的文本向量协议解析请求 Body，再转换为对应 LLM 厂商的文本向量协议

## 运行属性

插件执行阶段：`默认阶段`
插件执行优先级：`100`


## 配置字段

### 基本配置

| 名称         | 数据类型   | 填写要求 | 默认值 | 描述               |
|------------|--------|------|-----|------------------|
| `provider` | object | 必填   | -   | 配置目标 AI 服务提供商的信息 |

`provider`的配置字段说明如下：

| 名称           | 数据类型        | 填写要求 | 默认值 | 描述                                                                                                                                                                                                                                                           |
| -------------- | --------------- | -------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------                                                                                                  |
| `type`         | string          | 必填     | -      | AI 服务提供商名称                                                                                                                                                                                                                                              |
| `apiTokens`    | array of string | 非必填   | -      | 用于在访问 AI 服务时进行认证的令牌。如果配置了多个 token，插件会在请求时随机进行选择。部分服务提供商只支持配置一个 token。                                                                                                                                     |
| `timeout`      | number          | 非必填   | -      | 访问 AI 服务的超时时间。单位为毫秒。默认值为 120000，即 2 分钟                                                                                                                                                                                                 |
| `modelMapping` | map of string   | 非必填   | -      | AI 模型映射表，用于将请求中的模型名称映射为服务提供商支持模型名称。<br/>1. 支持前缀匹配。例如用 "gpt-3-*" 匹配所有名称以“gpt-3-”开头的模型；<br/>2. 支持使用 "*" 为键来配置通用兜底映射关系；<br/>3. 如果映射的目标名称为空字符串 ""，则表示保留原模型名称。 |
| `protocol`     | string          | 非必填   | -      | 插件对外提供的 API 接口契约。目前支持以下取值：openai（默认值，使用 OpenAI 的接口契约）、original（使用目标服务提供商的原始接口契约）                                                                                                                          |
| `context`      | object          | 非必填   | -      | 配置 AI 对话上下文信息                                                                                                                                                                                                                                         |
| `customSettings` | array of customSetting | 非必填   | -      | 为AI请求指定覆盖或者填充参数                                                                                                                                                                                                                                 |

`context`的配置字段说明如下：

| 名称            | 数据类型   | 填写要求 | 默认值 | 描述                               |
|---------------|--------|------|-----|----------------------------------|
| `fileUrl`     | string | 必填   | -   | 保存 AI 对话上下文的文件 URL。仅支持纯文本类型的文件内容 |
| `serviceName` | string | 必填   | -   | URL 所对应的 Higress 后端服务完整名称        |
| `servicePort` | number | 必填   | -   | URL 所对应的 Higress 后端服务访问端口        |


`customSettings`的配置字段说明如下：

| 名称        | 数据类型              | 填写要求 | 默认值 | 描述                                                                                                                         |
| ----------- | --------------------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `name`      | string                | 必填     | -      | 想要设置的参数的名称，例如`max_tokens`                                                                                       |
| `value`     | string/int/float/bool | 必填     | -      | 想要设置的参数的值，例如0                                                                                                    |
| `mode`      | string                | 非必填   | "auto" | 参数设置的模式，可以设置为"auto"或者"raw"，如果为"auto"则会自动根据协议对参数名做改写，如果为"raw"则不会有任何改写和限制检查 |
| `overwrite` | bool                  | 非必填   | true   | 如果为false则只在用户没有设置这个参数时填充参数，否则会直接覆盖用户原有的参数设置                                            |


custom-setting会遵循如下表格，根据`name`和协议来替换对应的字段，用户需要填写表格中`settingName`列中存在的值。例如用户将`name`设置为`max_tokens`，在openai协议中会替换`max_tokens`，在gemini中会替换`maxOutputTokens`。
`none`表示该协议不支持此参数。如果`name`不在此表格中或者对应协议不支持此参数，同时没有设置raw模式，则配置不会生效。


| settingName | openai      | baidu             | spark       | qwen        | gemini          | hunyuan     | claude      | minimax            |
| ----------- | ----------- | ----------------- | ----------- | ----------- | --------------- | ----------- | ----------- | ------------------ |
| max_tokens  | max_tokens  | max_output_tokens | max_tokens  | max_tokens  | maxOutputTokens | none        | max_tokens  | tokens_to_generate |
| temperature | temperature | temperature       | temperature | temperature | temperature     | Temperature | temperature | temperature        |
| top_p       | top_p       | top_p             | none        | top_p       | topP            | TopP        | top_p       | top_p              |
| top_k       | none        | none              | top_k       | none        | topK            | none        | top_k       | none               |
| seed        | seed        | none              | none        | seed        | none            | none        | none        | none               |

如果启用了raw模式，custom-setting会直接用输入的`name`和`value`去更改请求中的json内容，而不对参数名称做任何限制和修改。
对于大多数协议，custom-setting都会在json内容的根路径修改或者填充参数。对于`qwen`协议，ai-proxy会在json的`parameters`子路径下做配置。对于`gemini`协议，则会在`generation_config`子路径下做配置。


### 提供商特有配置

#### OpenAI

OpenAI 所对应的 `type` 为 `openai`。它特有的配置字段如下:

| 名称              | 数据类型 | 填写要求 | 默认值 | 描述                                                                          |
|-------------------|----------|----------|--------|-------------------------------------------------------------------------------|
| `openaiCustomUrl` | string   | 非必填   | -      | 基于OpenAI协议的自定义后端URL，例如: www.example.com/myai/v1/chat/completions |
| `responseJsonSchema` | object | 非必填 | - | 预先定义OpenAI响应需满足的Json Schema, 注意目前仅特定的几种模型支持该用法|


#### Azure OpenAI

Azure OpenAI 所对应的 `type` 为 `azure`。它特有的配置字段如下：

| 名称                | 数据类型   | 填写要求 | 默认值 | 描述                                           |
|-------------------|--------|------|-----|----------------------------------------------|
| `azureServiceUrl` | string | 必填   | -   | Azure OpenAI 服务的 URL，须包含 `api-version` 查询参数。 |

**注意：** Azure OpenAI 只支持配置一个 API Token。

#### 月之暗面（Moonshot）

月之暗面所对应的 `type` 为 `moonshot`。它特有的配置字段如下：

| 名称               | 数据类型   | 填写要求 | 默认值 | 描述                                                          |
|------------------|--------|------|-----|-------------------------------------------------------------|
| `moonshotFileId` | string | 非必填  | -   | 通过文件接口上传至月之暗面的文件 ID，其内容将被用做 AI 对话的上下文。不可与 `context` 字段同时配置。 |

#### 通义千问（Qwen）

通义千问所对应的 `type` 为 `qwen`。它特有的配置字段如下：

| 名称                 | 数据类型            | 填写要求 | 默认值 | 描述                                                               |
|--------------------|-----------------|------|-----|------------------------------------------------------------------|
| `qwenEnableSearch` | boolean         | 非必填  | -   | 是否启用通义千问内置的互联网搜索功能。                          |
| `qwenFileIds`      | array of string | 非必填  | -   | 通过文件接口上传至Dashscope的文件 ID，其内容将被用做 AI 对话的上下文。不可与 `context` 字段同时配置。 |

#### 百川智能 (Baichuan AI)

百川智能所对应的 `type` 为 `baichuan` 。它并无特有的配置字段。

#### 零一万物（Yi）

零一万物所对应的 `type` 为 `yi`。它并无特有的配置字段。

#### 智谱AI（Zhipu AI）

智谱AI所对应的 `type` 为 `zhipuai`。它并无特有的配置字段。

#### DeepSeek（DeepSeek）

DeepSeek所对应的 `type` 为 `deepseek`。它并无特有的配置字段。

#### Groq

Groq 所对应的 `type` 为 `groq`。它并无特有的配置字段。

#### 文心一言（Baidu）

文心一言所对应的 `type` 为 `baidu`。它并无特有的配置字段。

#### 360智脑

360智脑所对应的 `type` 为 `ai360`。它并无特有的配置字段。

#### Mistral

Mistral 所对应的 `type` 为 `mistral`。它并无特有的配置字段。

#### MiniMax

MiniMax所对应的 `type` 为 `minimax`。它特有的配置字段如下：

| 名称             | 数据类型 | 填写要求                                                     | 默认值 | 描述                                                         |
| ---------------- | -------- | ------------------------------------------------------------ | ------ | ------------------------------------------------------------ |
| `minimaxGroupId` | string   | 当使用`abab6.5-chat`, `abab6.5s-chat`, `abab5.5s-chat`, `abab5.5-chat`四种模型时必填 | -      | 当使用`abab6.5-chat`, `abab6.5s-chat`, `abab5.5s-chat`, `abab5.5-chat`四种模型时会使用ChatCompletion Pro，需要设置groupID |

#### Anthropic Claude

Anthropic Claude 所对应的 `type` 为 `claude`。它特有的配置字段如下：

| 名称        | 数据类型   | 填写要求 | 默认值 | 描述                               |
|-----------|--------|------|-----|----------------------------------|
| `claudeVersion` | string | 可选   | -   | Claude 服务的 API 版本，默认为 2023-06-01 |

#### Ollama

Ollama 所对应的 `type` 为 `ollama`。它特有的配置字段如下：

| 名称                | 数据类型   | 填写要求 | 默认值 | 描述                                           |
|-------------------|--------|------|-----|----------------------------------------------|
| `ollamaServerHost` | string | 必填   | -   | Ollama 服务器的主机地址 |
| `ollamaServerPort` | number | 必填   | -   | Ollama 服务器的端口号，默认为11434 |

#### 混元

混元所对应的 `type` 为 `hunyuan`。它特有的配置字段如下：

| 名称                | 数据类型   | 填写要求 | 默认值 | 描述                                           |
|-------------------|--------|------|-----|----------------------------------------------|
| `hunyuanAuthId` | string | 必填   | -   | 混元用于v3版本认证的id |
| `hunyuanAuthKey` | string | 必填   | -   | 混元用于v3版本认证的key |

#### 阶跃星辰 (Stepfun)

阶跃星辰所对应的 `type` 为 `stepfun`。它并无特有的配置字段。

#### Cloudflare Workers AI

Cloudflare Workers AI 所对应的 `type` 为 `cloudflare`。它特有的配置字段如下：

| 名称                | 数据类型   | 填写要求 | 默认值 | 描述                                                                                                                         |
|-------------------|--------|------|-----|----------------------------------------------------------------------------------------------------------------------------|
| `cloudflareAccountId` | string | 必填   | -   | [Cloudflare Account ID](https://developers.cloudflare.com/workers-ai/get-started/rest-api/#1-get-api-token-and-account-id) |

#### 星火 (Spark)

星火所对应的 `type` 为 `spark`。它并无特有的配置字段。

讯飞星火认知大模型的`apiTokens`字段值为`APIKey:APISecret`。即填入自己的APIKey与APISecret，并以`:`分隔。

#### Gemini

Gemini 所对应的 `type` 为 `gemini`。它特有的配置字段如下：

| 名称                  | 数据类型 | 填写要求 | 默认值 | 描述                                                                                              |
| --------------------- | -------- | -------- |-----|-------------------------------------------------------------------------------------------------|
| `geminiSafetySetting` | map of string   | 非必填     | -   | Gemini AI内容过滤和安全级别设定。参考[Safety settings](https://ai.google.dev/gemini-api/docs/safety-settings) |

#### DeepL

DeepL 所对应的 `type` 为 `deepl`。它特有的配置字段如下：

| 名称         | 数据类型 | 填写要求 | 默认值 | 描述                         |
| ------------ | -------- | -------- | ------ | ---------------------------- |
| `targetLang` | string   | 必填     | -      | DeepL 翻译服务需要的目标语种 |

#### Cohere

Cohere 所对应的 `type` 为 `cohere`。它并无特有的配置字段。

## 用法示例

### 使用 OpenAI 协议代理 Azure OpenAI 服务

使用最基本的 Azure OpenAI 服务，不配置任何上下文。

**配置信息**

```yaml
provider:
  type: azure
  apiTokens:
    - "YOUR_AZURE_OPENAI_API_TOKEN"
  azureServiceUrl: "https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/chat/completions?api-version=2024-02-15-preview",
```

### 使用 OpenAI 协议代理通义千问服务

使用通义千问服务，并配置从 OpenAI 大模型到通义千问的模型映射关系。

**配置信息**

```yaml
provider:
  type: qwen
  apiTokens:
    - "YOUR_QWEN_API_TOKEN"
  modelMapping:
    'gpt-3': "qwen-turbo"
    'gpt-35-turbo': "qwen-plus"
    'gpt-4-turbo': "qwen-max"
    'gpt-4-*': "qwen-max"
    'gpt-4o': "qwen-vl-plus"
    'text-embedding-v1': 'text-embedding-v1'
    '*': "qwen-turbo"
```

### 使用original协议代理百炼智能体应用
**配置信息**

```yaml
provider:
  type: qwen
  apiTokens:
    - "YOUR_DASHSCOPE_API_TOKEN"
  protocol: original
```

### 使用 OpenAI 协议代理豆包大模型服务

**配置信息**

```yaml
provider:
  type: doubao
  apiTokens:
    - YOUR_DOUBAO_API_KEY
  modelMapping:
    '*': YOUR_DOUBAO_ENDPOINT
  timeout: 1200000
```

### 使用月之暗面配合其原生的文件上下文

提前上传文件至月之暗面，以文件内容作为上下文使用其 AI 服务。

**配置信息**

```yaml
provider:
  type: moonshot
  apiTokens:
    - "YOUR_MOONSHOT_API_TOKEN"
  moonshotFileId: "YOUR_MOONSHOT_FILE_ID",
  modelMapping:
    '*': "moonshot-v1-32k"
```

### 使用 OpenAI 协议代理 Groq 服务

**配置信息**

```yaml
provider:
  type: groq
  apiTokens:
    - "YOUR_GROQ_API_TOKEN"
```

### 使用 OpenAI 协议代理 Claude 服务

**配置信息**

```yaml
provider:
  type: claude
  apiTokens:
    - "YOUR_CLAUDE_API_TOKEN"
  version: "2023-06-01"
```

### 使用 OpenAI 协议代理混元服务

**配置信息**

```yaml
provider:
  type: "hunyuan"
  hunyuanAuthKey: "<YOUR AUTH KEY>"
  apiTokens:
    - ""
  hunyuanAuthId: "<YOUR AUTH ID>"
  timeout: 1200000
  modelMapping:
    "*": "hunyuan-lite"
```

### 使用 OpenAI 协议代理百度文心一言服务

**配置信息**

```yaml
provider:
  type: baidu
  apiTokens:
    - "YOUR_BAIDU_API_TOKEN"
  modelMapping:
    'gpt-3': "ERNIE-4.0"
    '*': "ERNIE-4.0"
```

### 使用 OpenAI 协议代理MiniMax服务

**配置信息**

```yaml
provider:
  type: minimax
  apiTokens:
    - "YOUR_MINIMAX_API_TOKEN"
  modelMapping:
    "gpt-3": "abab6.5g-chat"
    "gpt-4": "abab6.5-chat"
    "*": "abab6.5g-chat"
  minimaxGroupId: "YOUR_MINIMAX_GROUP_ID"
```

### 使用 OpenAI 协议代理360智脑服务

**配置信息**

```yaml
provider:
  type: ai360
  apiTokens:
    - "YOUR_MINIMAX_API_TOKEN"
  modelMapping:
    "gpt-4o": "360gpt-turbo-responsibility-8k"
    "gpt-4": "360gpt2-pro"
    "gpt-3.5": "360gpt-turbo"
    "text-embedding-3-small": "embedding_s1_v1.2"
    "*": "360gpt-pro"
```

### 使用 OpenAI 协议代理 Cloudflare Workers AI 服务

**配置信息**

```yaml
provider:
  type: cloudflare
  apiTokens:
    - "YOUR_WORKERS_AI_API_TOKEN"
  cloudflareAccountId: "YOUR_CLOUDFLARE_ACCOUNT_ID"
  modelMapping:
    "*": "@cf/meta/llama-3-8b-instruct"
```

### 使用 OpenAI 协议代理Spark服务

**配置信息**

```yaml
provider:
  type: spark
  apiTokens:
    - "APIKey:APISecret"
  modelMapping:
    "gpt-4o": "generalv3.5"
    "gpt-4": "generalv3"
    "*": "general"
```

### 使用 OpenAI 协议代理 gemini 服务

**配置信息**

```yaml
provider:
  type: gemini
  apiTokens:
    - "YOUR_GEMINI_API_TOKEN"
  modelMapping:
    "*": "gemini-pro"
  geminiSafetySetting:
    "HARM_CATEGORY_SEXUALLY_EXPLICIT" :"BLOCK_NONE"
    "HARM_CATEGORY_HATE_SPEECH" :"BLOCK_NONE"
    "HARM_CATEGORY_HARASSMENT" :"BLOCK_NONE"
    "HARM_CATEGORY_DANGEROUS_CONTENT" :"BLOCK_NONE"
```

### 使用 OpenAI 协议代理 DeepL 文本翻译服务

**配置信息**

```yaml
provider:
  type: deepl
  apiTokens:
    - "YOUR_DEEPL_API_TOKEN"
  targetLang: "ZH"
```

**请求示例**
此处 `model` 表示 DeepL 的服务类型，只能填 `Free` 或 `Pro`。`content` 中设置需要翻译的文本；在 `role: system` 的 `content` 中可以包含可能影响翻译但本身不会被翻译的上下文，例如翻译产品名称时，可以将产品描述作为上下文传递，这种额外的上下文可能会提高翻译的质量。

```json
{
  "model": "Free",
  "messages": [
    {
      "role": "system",
      "content": "money"
    },
    {
      "content": "sit by the bank"
    },
    {
      "content": "a bank in China"
    }
  ]
}
```

**响应示例**
```json
{
  "choices": [
    {
      "index": 0,
      "message": { "name": "EN", "role": "assistant", "content": "坐庄" }
    },
    {
      "index": 1,
      "message": { "name": "EN", "role": "assistant", "content": "中国银行" }
    }
  ],
  "created": 1722747752,
  "model": "Free",
  "object": "chat.completion",
  "usage": {}
}
```

