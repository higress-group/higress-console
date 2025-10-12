// AI模型提供商配置文件
// 该文件定义了各种AI模型提供商的配置信息，包括服务地址、模型名称模式、目标模型列表等

import { serviceToString } from "@/interfaces/service";

// AI模型提供商配置数组
export const aiModelProviders = [
  {
    // OpenAI提供商配置
    label: 'OpenAI',
    value: 'openai',
    // OpenAI服务地址
    serviceAddress: 'https://api.openai.com/v1',
    // 模型名称模式
    modelNamePattern: 'gpt-*',
    // 目标模型列表
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
    // 判断是否需要Token
    isTokenRequired: record => {
      if (record.openaiServerType) {
        // 表单验证
        return record.openaiServerType === 'official';
      }
      // 通用逻辑
      return !record.rawConfigs || !record.rawConfigs.openaiCustomUrl;
    },
    // 获取提供商端点
    getProviderEndpoints: (record) => {
      if (!record.rawConfigs) {
        return null;
      }
      const rawConfigs = record.rawConfigs;
      const customUrl = rawConfigs.openaiCustomUrl;
      if (!customUrl) {
        return null;
      }
      if (rawConfigs.openaiCustomServiceName) {
        const schemeEndIndex = customUrl.indexOf('://');
        const hostEndIndex = customUrl.indexOf('/', schemeEndIndex + '://'.length);
        const scheme = schemeEndIndex !== -1 ? customUrl.substring(0, schemeEndIndex) : 'http';
        const path = hostEndIndex !== -1 ? customUrl.substring(hostEndIndex) : '';
        const portSegment = rawConfigs.openaiCustomServicePort ? `:${rawConfigs.openaiCustomServicePort}` : '';
        return [`${scheme}://${rawConfigs.openaiCustomServiceName}${portSegment}${path}`]
      }
      const customUrls = [customUrl];
      if (Array.isArray(rawConfigs.openaiExtraCustomUrls)) {
        customUrls.push(...rawConfigs.openaiExtraCustomUrls)
      }
      return customUrls;
    },
    // 标准化原始配置
    normalizeRawConfigs: (rawConfigs) => {
      if (!rawConfigs) {
        return;
      }
      if (typeof rawConfigs.openaiCustomServiceObj === 'object') {
        const customService = rawConfigs.openaiCustomServiceObj;
        const host = rawConfigs.openaiCustomServiceHost || (customService.port ? `${customService.name}:${customService.port}` : customService.name);
        const protocol = customService.protocol && customService.protocol.toUpperCase() === 'HTTPS' ? 'https' : 'http';
        let path = rawConfigs.openaiCustomServicePath || ''
        if (!path.startsWith('/')) {
          path = '/' + path;
        }

        rawConfigs.openaiCustomUrl = `${protocol}://${host}${path}`;
        rawConfigs.openaiCustomServiceName = customService.name;
        rawConfigs.openaiCustomServicePort = customService.port || 80;

        delete rawConfigs.openaiCustomServiceObj;
        delete rawConfigs.openaiCustomServiceHost;
        delete rawConfigs.openaiCustomServicePath;
        delete rawConfigs.openaiCustomUrls;
      } else if (Array.isArray(rawConfigs.openaiCustomUrls)) {
        rawConfigs.openaiExtraCustomUrls = [...rawConfigs.openaiCustomUrls];
        rawConfigs.openaiCustomUrl = rawConfigs.openaiExtraCustomUrls.shift();
        delete rawConfigs.openaiCustomUrls;
      }
    },
  },
  {
    // Qwen提供商配置
    label: 'Qwen',
    value: 'qwen',
    // Qwen服务地址
    serviceAddress: 'https://dashscope.aliyuncs.com/api/v1/services/aigc',
    // 模型名称模式
    modelNamePattern: 'qwen-*',
    // 目标模型列表
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
    // 获取提供商端点
    getProviderEndpoints: (record) => {
      if (!record.rawConfigs) {
        return null;
      }
      const { rawConfigs } = record;
      const { qwenDomain, qwenEnableCompatible } = rawConfigs;
      const customDomain = (qwenDomain && qwenDomain !== '') ? rawConfigs.qwenDomain.trim() : 'dashscope.aliyuncs.com';
      const servicePath = qwenEnableCompatible ? 'compatible-mode/v1' : 'api/v1/services/aigc';
      return [`https://${customDomain}/${servicePath}`]
    },
  },
  {
    // Moonshot提供商配置
    label: 'Moonshot',
    value: 'moonshot',
    // Moonshot服务地址
    serviceAddress: 'https://api.moonshot.cn/v1',
    // 模型名称模式
    modelNamePattern: 'moonshot-*',
    // 目标模型列表
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
    // Azure提供商配置
    label: 'Azure',
    value: 'azure',
    // Azure服务地址
    serviceAddress: '',
    // 模型名称模式
    modelNamePattern: 'gpt-*',
    // 目标模型列表
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
    // 获取提供商端点
    getProviderEndpoints: (record) => {
      if (!record.rawConfigs) {
        return null;
      }
      return [record.rawConfigs['azureServiceUrl']];
    },
  },
  {
    // Claude提供商配置
    label: 'Claude',
    value: 'claude',
    // Claude服务地址
    serviceAddress: 'https://api.anthropic.com',
    // 模型名称模式
    modelNamePattern: 'claude-*',
    // 目标模型列表
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
    // Baichuan提供商配置
    label: 'Baichuan',
    value: 'baichuan',
    // Baichuan服务地址
    serviceAddress: 'https://api.baichuan-ai.com/v1',
    // 模型名称模式
    modelNamePattern: 'Baichuan*',
    // 目标模型列表
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
    // Yi提供商配置
    label: 'Yi',
    value: 'yi',
    // Yi服务地址
    serviceAddress: 'https://api.lingyiwanwu.com',
    // 模型名称模式
    modelNamePattern: 'yi-*',
    // 目标模型列表
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
    // Zhipuai提供商配置
    label: 'Zhipuai',
    value: 'zhipuai',
    // Zhipuai服务地址
    serviceAddress: 'https://open.bigmodel.cn',
    // 模型名称模式
    modelNamePattern: 'GLM-*',
    // 目标模型列表
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
    // 360智脑提供商配置
    label: '360智脑',
    value: 'ai360',
    // 360智脑服务地址
    serviceAddress: 'https://api.360.cn',
    // 目标模型列表
    targetModelList: [],
  },
  {
    // 文心一言提供商配置
    label: '文心一言',
    value: 'baidu',
    // 文心一言服务地址
    serviceAddress: 'https://aip.baidubce.com',
    // 目标模型列表
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
    // Hunyuan提供商配置
    label: 'Hunyuan',
    value: 'hunyuan',
    // 是否启用
    enabled: false,
    // Hunyuan服务地址
    serviceAddress: 'https://hunyuan.tencentcloudapi.com',
    // 模型名称模式
    modelNamePattern: 'hunyuan-*',
    // 目标模型列表
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
    // Stepfun提供商配置
    label: 'Stepfun',
    value: 'stepfun',
    // Stepfun服务地址
    serviceAddress: 'https://api.stepfun.com',
    // 模型名称模式
    modelNamePattern: 'step-*',
    // 目标模型列表
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
    // Spark提供商配置
    label: 'Spark',
    value: 'spark',
    // 是否启用
    enabled: false,
    // Spark服务地址
    serviceAddress: 'https://spark-api-open.xf-yun.com',
    // 目标模型列表
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
    // Doubao提供商配置
    label: 'Doubao',
    value: 'doubao',
    // Doubao服务地址
    serviceAddress: 'https://ark.cn-beijing.volces.com',
    // 模型名称模式
    modelNamePattern: 'doubao-*',
    // 目标模型列表
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
    // MiniMax提供商配置
    label: 'MiniMax',
    value: 'minimax',
    // MiniMax服务地址
    serviceAddress: 'https://api.minimax.chat',
    // 模型名称模式
    modelNamePattern: 'abab*',
    // 目标模型列表
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
    // Gemini提供商配置
    label: 'Gemini',
    value: 'gemini',
    // Gemini服务地址
    serviceAddress: 'https://generativelanguage.googleapis.com',
    // 模型名称模式
    modelNamePattern: 'gemini-*',
    // 目标模型列表
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
    // Cohere提供商配置
    label: 'Cohere',
    value: 'cohere',
    // Cohere服务地址
    serviceAddress: 'https://api.cohere.com',
    // 目标模型列表
    targetModelList: [],
  },
  {
    // Coze提供商配置
    label: 'Coze',
    value: 'coze',
    // Coze服务地址
    serviceAddress: 'https://api.coze.cn',
    // 目标模型列表
    targetModelList: [],
  },
  {
    // DeepSeek提供商配置
    label: 'DeepSeek',
    value: 'deepseek',
    // DeepSeek服务地址
    serviceAddress: 'https://api.deepseek.com',
    // 目标模型列表
    targetModelList: [],
  },
  {
    // GitHub Models提供商配置
    label: 'GitHub Models',
    value: 'github',
    // GitHub Models服务地址
    serviceAddress: 'https://models.inference.ai.azure.com',
    // 目标模型列表
    targetModelList: [],
  },
  {
    // Groq提供商配置
    label: 'Groq',
    value: 'groq',
    // Groq服务地址
    serviceAddress: 'https://api.groq.com',
    // 目标模型列表
    targetModelList: [],
  },
  {
    // Ollama提供商配置
    label: 'Ollama',
    value: 'ollama',
    // 是否需要Token
    tokenRequired: false,
    // 目标模型列表
    targetModelList: [],
    // 获取提供商端点
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
    // Mistral提供商配置
    label: 'Mistral',
    value: 'mistral',
    // Mistral服务地址
    serviceAddress: 'https://api.mistral.ai',
    // 目标模型列表
    targetModelList: [],
  },
  {
    // Cloudflare提供商配置
    label: 'Cloudflare',
    value: 'cloudflare',
    // 是否启用
    enabled: false,
    // Cloudflare服务地址
    serviceAddress: 'https://api.cloudflare.com',
    // 目标模型列表
    targetModelList: [],
  },
  {
    // DeepL提供商配置
    label: 'DeepL',
    value: 'deepl',
    // 是否启用
    enabled: false,
    // DeepL服务地址
    serviceAddress: 'https://api.deepl.com',
    // 目标模型列表
    targetModelList: [],
  },
  {
    // Together AI提供商配置
    label: 'Together AI',
    value: 'together-ai',
    // 是否启用
    enabled: false,
    // Together AI服务地址
    serviceAddress: 'https://api.together.xyz',
    // 目标模型列表
    targetModelList: [],
  },
  {
    // AWS Bedrock提供商配置
    label: 'AWS Bedrock',
    value: 'bedrock',
    // 可用区域列表
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
    // 是否使用自定义凭证
    useCustomCredentials: true,
    // 获取用于显示的凭证
    getCredentialsForDisplay: (record): string[] => {
      if (!record.rawConfigs) {
        return [];
      }
      const accessKey = record.rawConfigs.awsAccessKey;
      const secretKey = record.rawConfigs.awsSecretKey;
      return accessKey && secretKey ? [`${accessKey}:${secretKey}`] : [];
    },
    // 获取提供商端点
    getProviderEndpoints: (record): string[] => {
      const region = record.rawConfigs && record.rawConfigs.awsRegion;
      return region && [`https://bedrock-runtime.${region}.amazonaws.com`] || [];
    },
    // 目标模型列表
    targetModelList: [],
  },
  {
    // Google Vertex提供商配置
    label: 'Google Vertex',
    value: 'vertex',
    // 可用区域列表
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
    // 安全设置
    safetySettings: {
      // 类别
      categories: [
        'HARM_CATEGORY_HATE_SPEECH',
        'HARM_CATEGORY_DANGEROUS_CONTENT',
        'HARM_CATEGORY_HARASSMENT',
        'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      ],
      // 阈值
      thresholds: [
        'HARM_BLOCK_THRESHOLD_UNSPECIFIED',
        'OFF',
        'BLOCK_NONE',
        'BLOCK_LOW_AND_ABOVE',
        'BLOCK_MEDIUM_AND_ABOVE',
        'BLOCK_ONLY_HIGH',
      ],
    },
    // 是否使用自定义凭证
    useCustomCredentials: true,
    // 获取用于显示的凭证
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
    // 获取提供商端点
    getProviderEndpoints: (record): string[] => {
      const region = record.rawConfigs && record.rawConfigs.vertexRegion;
      return region && [`https://${region}-aiplatform.googleapis.com`] || [];
    },
    // 解析原始配置
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
    // 标准化原始配置
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
    // 目标模型列表
    targetModelList: [],
  },
  {
    // OpenRouter提供商配置
    label: 'OpenRouter',
    value: 'openrouter',
    // OpenRouter服务地址
    serviceAddress: 'https://openrouter.ai',
    // 模型名称模式
    modelNamePattern: '*',
    // 目标模型列表
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
    // Grok提供商配置
    label: 'Grok',
    value: 'grok',
    // Grok服务地址
    serviceAddress: 'https://api.x.ai',
    // 模型名称模式
    modelNamePattern: 'grok-*',
    // 目标模型列表
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

// 为每个提供商排序可用区域
for (const provider of aiModelProviders) {
  if (Array.isArray(provider.availableRegions)) {
    provider.availableRegions.sort();
  }
}
