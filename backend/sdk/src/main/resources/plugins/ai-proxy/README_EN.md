---
title: AI Agent
keywords: [AI Gateway, AI Agent]
description: AI Agent plugin configuration reference
---
## Function Description
`AI Agent` plugin implements AI agent functionality based on OpenAI API contracts. It currently supports AI service providers such as OpenAI, Azure OpenAI, Moonshot, and Qwen.

> **Note:**
> When the request path suffix matches `/v1/chat/completions`, corresponding to text generation scenarios, the request body will be parsed using OpenAI's text generation protocol and then converted to the corresponding LLM vendor's text generation protocol.
>
> When the request path suffix matches `/v1/embeddings`, corresponding to text vector scenarios, the request body will be parsed using OpenAI's text vector protocol and then converted to the corresponding LLM vendor's text vector protocol.

## Running Attributes
Plugin execution phase: `Default phase`  
Plugin execution priority: `100`

## Configuration Fields
### Basic Configuration
| Name         | Data Type   | Requirement | Default Value | Description                            |
|--------------|-------------|-------------|---------------|----------------------------------------|
| `provider`   | object      | Required    | -             | Information about the target AI service provider |

The description of fields in `provider` is as follows:

| Name              | Data Type        | Requirement | Default Value | Description                                                                                               |
|-------------------|------------------|-------------|---------------|-----------------------------------------------------------------------------------------------------------|
| `type`            | string           | Required    | -             | Name of the AI service provider                                                                             |
| `apiTokens`       | array of string  | Optional    | -             | Tokens for authentication when accessing the AI service. If multiple tokens are provided, the plugin will randomly choose one when making requests. Some service providers only support one token configuration. |
| `timeout`         | number           | Optional    | -             | Timeout for accessing the AI service, in milliseconds. The default value is 120000, which is 2 minutes. |
| `modelMapping`    | map of string    | Optional    | -             | AI model mapping table for mapping model names in requests to supported model names by the service provider. <br/>1. Supports prefix matching. For example, "gpt-3-*" matches all models whose names start with "gpt-3-"; <br/>2. Supports using "*" as a key to configure a general fallback mapping; <br/>3. If the target name in the mapping is an empty string "", it means to retain the original model name. |
| `protocol`        | string           | Optional    | -             | The API interface contract provided by the plugin. Currently supports the following values: openai (default, uses OpenAI's interface contract), original (uses the original interface contract of the target service provider) |
| `context`         | object           | Optional    | -             | Configuration for AI conversation context information                                                         |
| `customSettings`  | array of customSetting | Optional | -             | Specify override or fill parameters for AI requests                                                         |

The description of fields in `context` is as follows:

| Name            | Data Type   | Requirement | Default Value | Description                                      |
|-----------------|-------------|-------------|---------------|--------------------------------------------------|
| `fileUrl`       | string      | Required    | -             | URL of the file that stores AI conversation context. Only pure text file content is supported. |
| `serviceName`   | string      | Required    | -             | The complete name of the Higress backend service corresponding to the URL.    |
| `servicePort`   | number      | Required    | -             | The access port of the Higress backend service corresponding to the URL.     |

The description of fields in `customSettings` is as follows:

| Name        | Data Type                | Requirement | Default Value | Description                                                              |
|-------------|-------------------------|-------------|---------------|--------------------------------------------------------------------------|
| `name`      | string                  | Required    | -             | Name of the parameter to set, e.g., `max_tokens`                       |
| `value`     | string/int/float/bool   | Required    | -             | Value for the parameter to set, e.g., 0                                 |
| `mode`      | string                  | Optional    | "auto"        | Mode for parameter settings, can be set to "auto" or "raw". If "auto", parameter names will be automatically rewritten based on the protocol; if "raw", no rewriting or validation checks will be done. |
| `overwrite` | bool                    | Optional    | true          | If false, the parameter will only be filled if the user hasn't set it; otherwise, it will overwrite the user's original parameter settings.  |

Custom settings will follow the table below to replace corresponding fields based on `name` and protocol. Users need to fill in values that exist in the `settingName` column of the table. For example, if the user sets `name` to `max_tokens`, it will be replaced by `max_tokens` in the OpenAI protocol, and by `maxOutputTokens` in Gemini. `none` indicates that the protocol does not support this parameter. If `name` is not in this table or the corresponding protocol does not support this parameter, and if raw mode is not set, the configuration will not take effect.

| settingName  | openai      | baidu             | spark       | qwen        | gemini          | hunyuan     | claude      | minimax            |
|--------------|-------------|-------------------|-------------|-------------|------------------|-------------|-------------|--------------------|
| max_tokens   | max_tokens  | max_output_tokens  | max_tokens  | max_tokens  | maxOutputTokens  | none        | max_tokens  | tokens_to_generate  |
| temperature   | temperature | temperature        | temperature | temperature | temperature      | Temperature | temperature | temperature        |
| top_p        | top_p       | top_p              | none        | top_p       | topP             | TopP        | top_p       | top_p              |
| top_k        | none        | none               | top_k       | none        | topK             | none        | top_k       | none               |
| seed         | seed        | none               | none        | seed        | none             | none        | none        | none               |

If raw mode is enabled, custom settings will directly use the input `name` and `value` to change the JSON content of the request without any restrictions or modifications to the parameter names. 

For most protocols, custom settings will modify or fill parameters at the root path of the JSON content. For the `qwen` protocol, the ai-proxy will configure under the `parameters` sub-path in JSON. For the `gemini` protocol, it will be configured under the `generation_config` sub-path.

### Provider-Specific Configuration
#### OpenAI
The `type` corresponding to OpenAI is `openai`. Its specific configuration fields are as follows:

| Name                   | Data Type | Requirement | Default Value | Description                                                                        |
|------------------------|-----------|-------------|---------------|------------------------------------------------------------------------------------|
| `openaiCustomUrl`      | string    | Optional    | -             | Custom backend URL based on OpenAI protocol, e.g., www.example.com/myai/v1/chat/completions |
| `responseJsonSchema`   | object    | Optional    | -             | Predefined Json Schema that OpenAI responses must satisfy, currently only supported by specific models. |

#### Azure OpenAI
The `type` corresponding to Azure OpenAI is `azure`. Its specific configuration fields are as follows:

| Name                   | Data Type | Requirement | Default Value | Description                                                           |
|------------------------|-----------|-------------|---------------|-----------------------------------------------------------------------|
| `azureServiceUrl`      | string    | Required    | -             | URL of Azure OpenAI service, must include `api-version` query parameter. |
**Note:** Azure OpenAI only supports the configuration of one API Token.

#### Moonshot
The `type` corresponding to Moonshot is `moonshot`. Its specific configuration fields are as follows:

| Name                   | Data Type | Requirement | Default Value | Description                                                           |
|------------------------|-----------|-------------|---------------|-----------------------------------------------------------------------|
| `moonshotFileId`       | string    | Optional    | -             | File ID uploaded to Moonshot via the file interface, its content will be used as the context for AI conversation. Cannot be configured simultaneously with the `context` field. |

#### Qwen
The `type` corresponding to Qwen is `qwen`. Its specific configuration fields are as follows:

| Name                   | Data Type            | Requirement | Default Value | Description                                                          |
|------------------------|----------------------|-------------|---------------|----------------------------------------------------------------------|
| `qwenEnableSearch`     | boolean              | Optional    | -             | Whether to enable the built-in internet search functionality of Qwen. |
| `qwenFileIds`          | array of string      | Optional    | -             | File IDs uploaded to Dashscope via the file interface, its contents will be used as the context for AI conversation. Cannot be configured simultaneously with the `context` field. |

#### Baichuan AI
The `type` corresponding to Baichuan AI is `baichuan`. It has no specific configuration fields.

#### Yi
The `type` corresponding to Yi is `yi`. It has no specific configuration fields.

#### Zhipu AI
The `type` corresponding to Zhipu AI is `zhipuai`. It has no specific configuration fields.

#### DeepSeek
The `type` corresponding to DeepSeek is `deepseek`. It has no specific configuration fields.

#### Groq
The `type` corresponding to Groq is `groq`. It has no specific configuration fields.

#### Baidu
The `type` corresponding to Baidu is `baidu`. It has no specific configuration fields.

#### AI360
The `type` corresponding to AI360 is `ai360`. It has no specific configuration fields.

#### Mistral
The `type` corresponding to Mistral is `mistral`. It has no specific configuration fields.

#### MiniMax
The `type` corresponding to MiniMax is `minimax`. Its specific configuration fields are as follows:

| Name                   | Data Type | Requirement                             | Default Value | Description                                                        |
|------------------------|-----------|-----------------------------------------|---------------|--------------------------------------------------------------------|
| `minimaxGroupId`       | string    | Required when using `abab6.5-chat`, `abab6.5s-chat`, `abab5.5s-chat`, or `abab5.5-chat` models | -             | When using these models, ChatCompletion Pro will be used, and `groupID` needs to be set. |

#### Anthropic Claude
The `type` corresponding to Anthropic Claude is `claude`. Its specific configuration fields are as follows:

| Name                   | Data Type | Requirement | Default Value | Description                                                          |
|------------------------|-----------|-------------|---------------|----------------------------------------------------------------------|
| `claudeVersion`        | string    | Optional    | -             | The API version for Claude service, defaults to 2023-06-01         |

#### Ollama
The `type` corresponding to Ollama is `ollama`. Its specific configuration fields are as follows:

| Name                   | Data Type | Requirement | Default Value | Description                                                         |
|------------------------|-----------|-------------|---------------|---------------------------------------------------------------------|
| `ollamaServerHost`     | string    | Required    | -             | Host address for the Ollama server                                 |
| `ollamaServerPort`     | number    | Required    | -             | Port number for the Ollama server, defaults to 11434              |

#### Hunyuan
The `type` corresponding to Hunyuan is `hunyuan`. Its specific configuration fields are as follows:

| Name                   | Data Type | Requirement | Default Value | Description                                                         |
|------------------------|-----------|-------------|---------------|---------------------------------------------------------------------|
| `hunyuanAuthId`        | string    | Required    | -             | ID used for Hunyuan authentication with version v3                |
| `hunyuanAuthKey`       | string    | Required    | -             | Key used for Hunyuan authentication with version v3                |

#### Stepfun
The `type` corresponding to Stepfun is `stepfun`. It has no specific configuration fields.

#### Cloudflare Workers AI
The `type` corresponding to Cloudflare Workers AI is `cloudflare`. Its specific configuration fields are as follows:

| Name                   | Data Type | Requirement | Default Value | Description                                                         |
|------------------------|-----------|-------------|---------------|---------------------------------------------------------------------|
| `cloudflareAccountId`  | string    | Required    | -             | [Cloudflare Account ID](https://developers.cloudflare.com/workers-ai/get-started/rest-api/#1-get-api-token-and-account-id) |

#### Spark
The `type` corresponding to Spark is `spark`. It has no specific configuration fields. 

The `apiTokens` field value for iFlytek’s Spark cognitive large model is `APIKey:APISecret`. That is, fill in your own APIKey and APISecret, separated by `:`.

#### Gemini
The `type` corresponding to Gemini is `gemini`. Its specific configuration fields are as follows:

| Name                   | Data Type | Requirement | Default Value | Description                                                      |
|------------------------|-----------|-------------|---------------|------------------------------------------------------------------|
| `geminiSafetySetting`  | map of string | Optional  | -             | Gemini AI content filtering and safety level settings. Refer to [Safety settings](https://ai.google.dev/gemini-api/docs/safety-settings). |

#### DeepL
The `type` corresponding to DeepL is `deepl`. Its specific configuration fields are as follows:

| Name                   | Data Type | Requirement | Default Value | Description                                      |
|------------------------|-----------|-------------|---------------|--------------------------------------------------|
| `targetLang`           | string    | Required    | -             | Target language required by DeepL translation service. |

#### Cohere
The `type` corresponding to Cohere is `cohere`. It has no specific configuration fields.

## Usage Examples
### Using OpenAI Protocol to Proxy Azure OpenAI Service
Using the most basic Azure OpenAI service with no context configured.

**Configuration Information**
```yaml
provider:
  type: azure
  apiTokens:
    - "YOUR_AZURE_OPENAI_API_TOKEN"
  azureServiceUrl: "https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/chat/completions?api-version=2024-02-15-preview"
```
### Using OpenAI Protocol to Proxy Qwen Service
Using Qwen service with a model mapping from OpenAI large models to Qwen.

**Configuration Information**
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
### Using original protocol to Proxy Baichuan AI Agent application
**Configuration Information**
```yaml
provider:
  type: qwen
  apiTokens:
    - "YOUR_DASHSCOPE_API_TOKEN"
  protocol: original
```
### Using OpenAI Protocol to Proxy Doubao Large Model Service
**Configuration Information**
```yaml
provider:
  type: doubao
  apiTokens:
    - "YOUR_DOUBAO_API_KEY"
  modelMapping:
    '*': YOUR_DOUBAO_ENDPOINT
  timeout: 1200000
```
### Using Moonshot with its native file context
Pre-upload a file to Moonshot to use its content as context for its AI service.

**Configuration Information**
```yaml
provider:
  type: moonshot
  apiTokens:
    - "YOUR_MOONSHOT_API_TOKEN"
  moonshotFileId: "YOUR_MOONSHOT_FILE_ID"
  modelMapping:
    '*': "moonshot-v1-32k"
```
### Using OpenAI Protocol to Proxy Groq Service
**Configuration Information**
```yaml
provider:
  type: groq
  apiTokens:
    - "YOUR_GROQ_API_TOKEN"
```
### Using OpenAI Protocol to Proxy Claude Service
**Configuration Information**
```yaml
provider:
  type: claude
  apiTokens:
    - "YOUR_CLAUDE_API_TOKEN"
  version: "2023-06-01"
```
### Using OpenAI Protocol to Proxy Hunyuan Service
**Configuration Information**
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
### Using OpenAI Protocol to Proxy Baidu Wenxin Service
**Configuration Information**
```yaml
provider:
  type: baidu
  apiTokens:
    - "YOUR_BAIDU_API_TOKEN"
  modelMapping:
    'gpt-3': "ERNIE-4.0"
    '*': "ERNIE-4.0"
```
### Using OpenAI Protocol to Proxy MiniMax Service
**Configuration Information**
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
### Using OpenAI Protocol to Proxy AI360 Service
**Configuration Information**
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
### Using OpenAI Protocol to Proxy Cloudflare Workers AI Service
**Configuration Information**
```yaml
provider:
  type: cloudflare
  apiTokens:
    - "YOUR_WORKERS_AI_API_TOKEN"
  cloudflareAccountId: "YOUR_CLOUDFLARE_ACCOUNT_ID"
  modelMapping:
    "*": "@cf/meta/llama-3-8b-instruct"
```
### Using OpenAI Protocol to Proxy Spark Service
**Configuration Information**
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
### Using OpenAI Protocol to Proxy Gemini Service
**Configuration Information**
```yaml
provider:
  type: gemini
  apiTokens:
    - "YOUR_GEMINI_API_TOKEN"
  modelMapping:
    "*": "gemini-pro"
  geminiSafetySetting:
    "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE"
    "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE"
    "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE"
    "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_NONE"
```
### Using OpenAI Protocol to Proxy DeepL Text Translation Service
**Configuration Information**
```yaml
provider:
  type: deepl
  apiTokens:
    - "YOUR_DEEPL_API_TOKEN"
  targetLang: "ZH"
```
**Request Example**
In this context, `model` indicates the type of DeepL service, which can only be `Free` or `Pro`. The `content` sets the text to be translated; in the `role: system` `content`, context that may affect the translation but itself will not be translated can be included. For example, when translating product names, product descriptions can be passed as context, and this additional context may improve the quality of the translation.
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
**Response Example**
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
