export const aiModelProviders = [
  {
    label: 'OpenAI',
    value: 'openai',
    serviceAddress: 'https://api.openai.com/v1',
    modelNamePattern: 'gpt-*',
    targetModelList: [
      {
        label: 'gpt-3',
        value: 'gpt-3',
      },
      {
        label: 'gpt-35-turbo',
        value: 'gpt-35-turbo',
      },
      {
        label: 'gpt-4',
        value: 'gpt-4',
      },
      {
        label: 'gpt-4o',
        value: 'gpt-4o',
      },
      {
        label: 'gpt-4o-mini',
        value: 'gpt-4o-mini',
      },
    ],
    isTokenRequired: record => {
      if (record.openaiServerType) {
        // For form validation
        return record.openaiServerType === 'official';
      }
      // For generic logic
      return !record.rawConfigs || !record.rawConfigs.openaiCustomUrl;
    },
    getProviderEndpoints: (record) => {
      const customUrl = record.rawConfigs && record.rawConfigs.openaiCustomUrl;
      return customUrl && [customUrl] || null;
    },
  },
  {
    label: 'Qwen',
    value: 'qwen',
    serviceAddress: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    modelNamePattern: 'qwen-*',
    targetModelList: [
      {
        label: 'qwen-max',
        value: 'qwen-max',
      },
      {
        label: 'qwen-plus',
        value: 'qwen-plus',
      },
      {
        label: 'qwen-turbo',
        value: 'qwen-turbo',
      },
      {
        label: 'qwen-long',
        value: 'qwen-long',
      },
    ],
  },
  {
    label: 'Moonshot',
    value: 'moonshot',
    serviceAddress: 'https://api.moonshot.cn/v1',
    modelNamePattern: 'moonshot-*',
    targetModelList: [
      {
        label: 'moonshot-v1-8k',
        value: 'moonshot-v1-8k',
      },
      {
        label: 'moonshot-v1-32k',
        value: 'moonshot-v1-32k',
      },
      {
        label: 'moonshot-v1-128k',
        value: 'moonshot-v1-128k',
      },
    ],
  },
  {
    label: 'Azure',
    value: 'azure',
    serviceAddress: '',
    modelNamePattern: 'gpt-*',
    targetModelList: [
      {
        label: 'gpt-3',
        value: 'gpt-3',
      },
      {
        label: 'gpt-35-turbo',
        value: 'gpt-35-turbo',
      },
      {
        label: 'gpt-4',
        value: 'gpt-4',
      },
      {
        label: 'gpt-4o',
        value: 'gpt-4o',
      },
      {
        label: 'gpt-4o-mini',
        value: 'gpt-4o-mini',
      },
    ],
    getProviderEndpoints: (record) => {
      if (!record.rawConfigs) {
        return null;
      }
      return [record.rawConfigs['azureServiceUrl']];
    },
  },
  {
    label: 'Claude',
    value: 'claude',
    serviceAddress: 'https://api.anthropic.com',
    modelNamePattern: 'claude-*',
    targetModelList: [
      {
        label: 'claude-3-5-sonnet-latest',
        value: 'claude-3-5-sonnet-latest',
      },
      {
        label: 'claude-3-5-haiku-latest',
        value: 'claude-3-5-haiku-latest',
      },
      {
        label: 'claude-3-opus-latest',
        value: 'claude-3-opus-latest',
      },
    ],
  },
  {
    label: 'Baichuan',
    value: 'baichuan',
    serviceAddress: 'https://api.baichuan-ai.com/v1',
    modelNamePattern: 'Baichuan*',
    targetModelList: [
      {
        label: 'Baichuan4-Turbo',
        value: 'Baichuan4-Turbo',
      },
      {
        label: 'Baichuan4-Air',
        value: 'Baichuan4-Air',
      },
      {
        label: 'Baichuan4',
        value: 'Baichuan4',
      },
      {
        label: 'Baichuan3-Turbo',
        value: 'Baichuan3-Turbo',
      },
      {
        label: 'Baichuan3-Turbo-128k',
        value: 'Baichuan3-Turbo-128k',
      },
      {
        label: 'Baichuan2-Turbo',
        value: 'Baichuan2-Turbo',
      },
    ],
  },
  {
    label: 'Yi',
    value: 'yi',
    serviceAddress: 'https://api.lingyiwanwu.com',
    modelNamePattern: 'yi-*',
    targetModelList: [
      {
        label: 'yi-lightning',
        value: 'yi-lightning',
      },
      {
        label: 'yi-large',
        value: 'yi-large',
      },
      {
        label: 'yi-medium',
        value: 'yi-medium',
      },
      {
        label: 'yi-medium-200k',
        value: 'yi-medium-200k',
      },
      {
        label: 'yi-spark',
        value: 'yi-spark',
      },
      {
        label: 'yi-large-rag',
        value: 'yi-large-rag',
      },
      {
        label: 'yi-large-fc',
        value: 'yi-large-fc',
      },
      {
        label: 'yi-large-turbo',
        value: 'yi-large-turbo',
      },
    ],
  },
  {
    label: 'Zhipuai',
    value: 'zhipuai',
    serviceAddress: 'https://open.bigmodel.cn',
    modelNamePattern: 'GLM-*',
    targetModelList: [
      {
        label: 'GLM-4-Plus',
        value: 'GLM-4-Plus',
      },
      {
        label: 'GLM-4-0520',
        value: 'GLM-4-0520',
      },
      {
        label: 'GLM-4-Long',
        value: 'GLM-4-Long',
      },
      {
        label: 'GLM-4-AirX',
        value: 'GLM-4-AirX',
      },
      {
        label: 'GLM-4-Air',
        value: 'GLM-4-Air',
      },
      {
        label: 'GLM-4-FlashX',
        value: 'GLM-4-FlashX',
      },
      {
        label: 'GLM-4-Flash',
        value: 'GLM-4-Flash',
      },
      {
        label: 'GLM-4-AllTools',
        value: 'GLM-4-AllTools',
      },
      {
        label: 'GLM-4',
        value: 'GLM-4',
      },
    ],
  },
  {
    label: '360智脑',
    value: 'ai360',
    serviceAddress: 'https://api.360.cn',
    targetModelList: [],
  },
  {
    label: '文心一言',
    value: 'baidu',
    serviceAddress: 'https://aip.baidubce.com',
    targetModelList: [
      {
        label: 'ERNIE-4.0-8K',
        value: 'ERNIE-4.0-8K',
      },
      {
        label: 'ERNIE-4.0-8K-Latest',
        value: 'ERNIE-4.0-8K-Latest',
      },
      {
        label: 'ERNIE-4.0-Turbo-8K',
        value: 'ERNIE-4.0-Turbo-8K',
      },
      {
        label: 'ERNIE-3.5-8K',
        value: 'ERNIE-3.5-8K',
      },
      {
        label: 'ERNIE-3.5-128K',
        value: 'ERNIE-3.5-128K',
      },
    ],
  },
  {
    label: 'Hunyuan',
    value: 'hunyuan',
    enabled: false,
    serviceAddress: 'https://hunyuan.tencentcloudapi.com',
    modelNamePattern: 'hunyuan-*',
    targetModelList: [
      {
        label: 'hunyuan-turbo-latest',
        value: 'hunyuan-turbo-latest',
      },
      {
        label: 'hunyuan-turbo',
        value: 'hunyuan-turbo',
      },
      {
        label: 'hunyuan-large',
        value: 'hunyuan-large',
      },
      {
        label: 'hunyuan-pro',
        value: 'hunyuan-pro',
      },
      {
        label: 'hunyuan-standard-256K',
        value: 'hunyuan-standard-256K',
      },
      {
        label: 'hunyuan-standard',
        value: 'hunyuan-standard',
      },
      {
        label: 'hunyuan-lite',
        value: 'hunyuan-lite',
      },
    ],
  },
  {
    label: 'Stepfun',
    value: 'stepfun',
    serviceAddress: 'https://api.stepfun.com',
    modelNamePattern: 'step-*',
    targetModelList: [
      {
        label: 'step-1-8k',
        value: 'step-1-8k',
      },
      {
        label: 'step-1-32k',
        value: 'step-1-32k',
      },
      {
        label: 'step-1-128k',
        value: 'step-1-128k',
      },
      {
        label: 'step-1-256k',
        value: 'step-1-256k',
      },
      {
        label: 'step-2-16k',
        value: 'step-2-16k',
      },
      {
        label: 'step-1-flash',
        value: 'step-1-flash',
      },
    ],
  },
  {
    label: 'Spark',
    value: 'spark',
    enabled: false,
    serviceAddress: 'https://spark-api-open.xf-yun.com',
    targetModelList: [
      {
        label: 'lite',
        value: 'lite',
      },
      {
        label: 'generalv3',
        value: 'generalv3',
      },
      {
        label: 'pro-128k',
        value: 'pro-128k',
      },
      {
        label: 'generalv3.5',
        value: 'generalv3.5',
      },
      {
        label: 'max-32k',
        value: 'max-32k',
      },
      {
        label: '4.0Ultra',
        value: '4.0Ultra',
      },
    ],
  },
  {
    label: 'Doubao',
    value: 'doubao',
    serviceAddress: 'https://ark.cn-beijing.volces.com',
    modelNamePattern: 'doubao-*',
    targetModelList: [
      {
        label: 'doubao-pro-32k',
        value: 'doubao-pro-32k',
      },
      {
        label: 'doubao-pro-128k',
        value: 'doubao-pro-128k',
      },
      {
        label: 'doubao-lite-32k',
        value: 'doubao-lite-32k',
      },
    ],
  },
  {
    label: 'MiniMax',
    value: 'minimax',
    serviceAddress: 'https://api.minimax.chat',
    modelNamePattern: 'abab*',
    targetModelList: [
      {
        label: 'abab6.5s',
        value: 'abab6.5s',
      },
      {
        label: 'abab6.5g',
        value: 'abab6.5g',
      },
      {
        label: 'abab6.5t',
        value: 'abab6.5t',
      },
      {
        label: 'abab5.5s',
        value: 'abab5.5s',
      },
    ],
  },
  {
    label: 'Gemini',
    value: 'gemini',
    serviceAddress: 'https://generativelanguage.googleapis.com',
    modelNamePattern: 'gemini-*',
    targetModelList: [
      {
        label: 'gemini-1.5-flash',
        value: 'gemini-1.5-flash',
      },
      {
        label: 'gemini-1.5-pro',
        value: 'gemini-1.5-pro',
      },
    ],
  },
  {
    label: 'Cohere',
    value: 'cohere',
    serviceAddress: 'https://api.cohere.com',
    targetModelList: [],
  },
  {
    label: 'Coze',
    value: 'coze',
    serviceAddress: 'https://api.coze.cn',
    targetModelList: [],
  },
  {
    label: 'DeepSeek',
    value: 'deepseek',
    serviceAddress: 'https://api.deepseek.com',
    targetModelList: [],
  },
  {
    label: 'GitHub Models',
    value: 'github',
    serviceAddress: 'https://models.inference.ai.azure.com',
    targetModelList: [],
  },
  {
    label: 'Groq',
    value: 'groq',
    serviceAddress: 'https://api.groq.com',
    targetModelList: [],
  },
  {
    label: 'Ollama',
    value: 'ollama',
    tokenRequired: false,
    targetModelList: [],
    getProviderEndpoints: (record) => {
      if (!record.rawConfigs) {
        return null;
      }
      const host = record.rawConfigs['ollamaServerHost'];
      const port = record.rawConfigs['ollamaServerPort'];
      return host && port ? [`http://${host}:${port}`] : null;
    },
  },
  {
    label: 'Mistral',
    value: 'mistral',
    serviceAddress: 'https://api.mistral.ai',
    targetModelList: [],
  },
  {
    label: 'Cloudflare',
    value: 'cloudflare',
    enabled: false,
    serviceAddress: 'https://api.cloudflare.com',
    targetModelList: [],
  },
  {
    label: 'DeepL',
    value: 'deepl',
    enabled: false,
    serviceAddress: 'https://api.deepl.com',
    targetModelList: [],
  },
  {
    label: 'Together AI',
    value: 'together-ai',
    enabled: false,
    serviceAddress: 'https://api.together.xyz',
    targetModelList: [],
  },
];
