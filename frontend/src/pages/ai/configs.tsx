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
      if (!record.rawConfigs) {
        return null;
      }
      const customUrl = record.rawConfigs.openaiCustomUrl;
      if (!customUrl) {
        return null;
      }
      const customUrls = [customUrl];
      if (Array.isArray(record.rawConfigs.openaiExtraCustomUrls)) {
        customUrls.push(...record.rawConfigs.openaiExtraCustomUrls)
      }
      return customUrls;
    },
    normalizeRawConfigs: (rawConfigs) => {
      if (rawConfigs && Array.isArray(rawConfigs.openaiCustomUrls)) {
        rawConfigs.openaiExtraCustomUrls = [...rawConfigs.openaiCustomUrls];
        rawConfigs.openaiCustomUrl = rawConfigs.openaiExtraCustomUrls.shift();
        delete rawConfigs.openaiCustomUrls;
      }
    },
  },
  {
    label: 'Qwen',
    value: 'qwen',
    serviceAddress: 'https://dashscope.aliyuncs.com/api/v1/services/aigc',
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
        label: 'claude-opus-4-1',
        value: 'claude-opus-4-1',
      },
      {
        label: 'claude-opus-4-0',
        value: 'claude-opus-4-0',
      },
      {
        label: 'claude-sonnet-4-0',
        value: 'claude-sonnet-4-0',
      },
      {
        label: 'claude-3-7-sonnet-latest',
        value: 'claude-3-7-sonnet-latest',
      },
      {
        label: 'claude-3-5-haiku-latest',
        value: 'claude-3-5-haiku-latest',
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
  {
    label: 'AWS Bedrock',
    value: 'bedrock',
    availableRegions: [
      'af-south-1',
      'ap-east-1',
      'ap-northeast-1',
      'ap-northeast-2',
      'ap-northeast-3',
      'ap-south-1',
      'ap-south-2',
      'ap-southeast-1',
      'ap-southeast-2',
      'ap-southeast-3',
      'ap-southeast-4',
      'ap-southeast-5',
      'ap-southeast-7',
      'ca-central-1',
      'ca-west-1',
      'eu-central-1',
      'eu-central-2',
      'eu-north-1',
      'eu-south-1',
      'eu-south-2',
      'eu-west-1',
      'eu-west-2',
      'eu-west-3',
      'il-central-1',
      'me-central-1',
      'me-south-1',
      'mx-central-1',
      'sa-east-1',
      'us-east-1',
      'us-east-2',
      'us-west-1',
      'us-west-2',
    ],
    useCustomCredentials: true,
    getCredentialsForDisplay: (record): string[] => {
      if (!record.rawConfigs) {
        return [];
      }
      const accessKey = record.rawConfigs.awsAccessKey;
      const secretKey = record.rawConfigs.awsSecretKey;
      return accessKey && secretKey ? [`${accessKey}:${secretKey}`] : [];
    },
    getProviderEndpoints: (record): string[] => {
      const region = record.rawConfigs && record.rawConfigs.awsRegion;
      return region && [`https://bedrock-runtime.${region}.amazonaws.com`] || [];
    },
    targetModelList: [],
  },
  {
    label: 'Google Vertex',
    value: 'vertex',
    availableRegions: [
      'africa-south1',
      'asia-east1',
      'asia-east2',
      'asia-northeast1',
      'asia-northeast2',
      'asia-northeast3',
      'asia-south1',
      'asia-southeast1',
      'asia-southeast2',
      'australia-southeast1',
      'australia-southeast2',
      'europe-central2',
      'europe-north1',
      'europe-southwest1',
      'europe-west1',
      'europe-west2',
      'europe-west3',
      'europe-west4',
      'europe-west6',
      'europe-west8',
      'europe-west9',
      'europe-west12',
      'me-central1',
      'me-central2',
      'me-west1',
      'northamerica-northeast1',
      'northamerica-northeast2',
      'southamerica-east1',
      'southamerica-west1',
      'us-central1',
      'us-east1',
      'us-east4',
      'us-south1',
      'us-west1',
      'us-west2',
      'us-west3',
      'us-west4',
      'us-east5',
    ],
    safetySettings: {
      categories: [
        'HARM_CATEGORY_HATE_SPEECH',
        'HARM_CATEGORY_DANGEROUS_CONTENT',
        'HARM_CATEGORY_HARASSMENT',
        'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      ],
      thresholds: [
        'HARM_BLOCK_THRESHOLD_UNSPECIFIED',
        'OFF',
        'BLOCK_NONE',
        'BLOCK_LOW_AND_ABOVE',
        'BLOCK_MEDIUM_AND_ABOVE',
        'BLOCK_ONLY_HIGH',
      ],
    },
    useCustomCredentials: true,
    getCredentialsForDisplay: (record): string[] => {
      if (!record.rawConfigs) {
        return [];
      }
      const authKey = record.rawConfigs.vertexAuthKey;
      if (!authKey) {
        return [];
      }
      try {
        const authKeyObj = JSON.parse(authKey);
        if (typeof authKeyObj !== 'object' || !authKeyObj.client_email || !authKeyObj.private_key_id) {
          return [];
        }
        return [`${authKeyObj.client_email}:${authKeyObj.private_key_id}`];
      } catch (e) {
        return [];
      }
    },
    getProviderEndpoints: (record): string[] => {
      const region = record.rawConfigs && record.rawConfigs.vertexRegion;
      return region && [`https://${region}-aiplatform.googleapis.com`] || [];
    },
    parseRawConfigs: (rawConfigs) => {
      if (!rawConfigs) {
        return;
      }
      delete rawConfigs.parsed;
      if (typeof rawConfigs.geminiSafetySettings !== 'object') {
        return;
      }
      const parsedSafetySettings: any[] = [];
      for (const [key, value] of Object.entries(rawConfigs.geminiSafetySettings)) {
        parsedSafetySettings.push({
          category: key,
          threshold: value,
        });
      }
      rawConfigs.parsed = { geminiSafetySettings: parsedSafetySettings };
    },
    normalizeRawConfigs: (rawConfigs) => {
      if (!rawConfigs) {
        return;
      }
      const parsed = rawConfigs.parsed;
      delete rawConfigs.parsed;
      delete rawConfigs.geminiSafetySettings;
      if (typeof parsed !== 'object' || !Array.isArray(parsed.geminiSafetySettings)) {
        return;
      }
      for (const setting of parsed.geminiSafetySettings) {
        if (typeof setting.category !== 'string' || typeof setting.threshold !== 'string') {
          continue;
        }
        rawConfigs.geminiSafetySettings = rawConfigs.geminiSafetySettings || {};
        rawConfigs.geminiSafetySettings[setting.category] = setting.threshold;
      }
    },
    targetModelList: [],
  },
  {
    label: 'OpenRouter',
    value: 'openrouter',
    serviceAddress: 'https://openrouter.ai',
    modelNamePattern: '*',
    targetModelList: [
      {
        label: 'anthropic/claude-sonnet-4',
        value: 'anthropic/claude-sonnet-4',
      },
      {
        label: 'google/gemini-2.5-flash',
        value: 'google/gemini-2.5-flash',
      },
      {
        label: 'google/gemini-2.0-flash-001',
        value: 'google/gemini-2.0-flash-001',
      },
      {
        label: 'deepseek/deepseek-chat-v3.1',
        value: 'deepseek/deepseek-chat-v3.1',
      },
      {
        label: 'deepseek/deepseek-chat-v3-0324',
        value: 'deepseek/deepseek-chat-v3-0324',
      },
      {
        label: 'google/gemini-2.5-pro',
        value: 'google/gemini-2.5-pro',
      },
      {
        label: 'qwen/qwen3-coder',
        value: 'qwen/qwen3-coder',
      },
      {
        label: 'anthropic/claude-3.7-sonnet',
        value: 'anthropic/claude-3.7-sonnet',
      },
      {
        label: 'x-ai/grok-code-fast-1',
        value: 'x-ai/grok-code-fast-1',
      },
      {
        label: 'x-ai/grok-4',
        value: 'x-ai/grok-4',
      },
      {
        label: 'deepseek/deepseek-r1-0528:free',
        value: 'deepseek/deepseek-r1-0528:free',
      },
      {
        label: 'google/gemini-2.5-flash-lite',
        value: 'google/gemini-2.5-flash-lite',
      },
      {
        label: 'openai/gpt-5',
        value: 'openai/gpt-5',
      },
    ],
  },
  {
    label: 'Grok',
    value: 'grok',
    serviceAddress: 'https://api.x.ai',
    modelNamePattern: 'grok-*',
    targetModelList: [
      {
        label: 'grok-code-fast-1',
        value: 'grok-code-fast-1',
      },
      {
        label: 'grok-4-0709',
        value: 'grok-4-0709',
      },
      {
        label: 'grok-3',
        value: 'grok-3',
      },
      {
        label: 'grok-3-mini',
        value: 'grok-3-mini',
      },
      {
        label: 'grok-2-image-1212',
        value: 'grok-2-image-1212',
      },
    ],
  },
];

for (const provider of aiModelProviders) {
  if (Array.isArray(provider.availableRegions)) {
    provider.availableRegions.sort();
  }
}
