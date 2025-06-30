import yaml from 'js-yaml';

// 默认的YAML模板
const DEFAULT_YAML_TEMPLATE = {
  server: {
    name: 'rest-amap-server',
    config: {
      apiKey: '<your-api-key>',
    },
    securitySchemes: [],
  },
  tools: [],
};

class YamlUtil {
  // 将YAML字符串转换为JS对象
  static parseYaml(yamlString: string): any {
    try {
      return yaml.load(yamlString);
    } catch (error: any) {
      throw new Error(`YAML 解析失败: ${error.message}`);
    }
  }

  // 将JS对象转换为YAML字符串
  static stringifyYaml(obj: any): string {
    try {
      return yaml.dump(obj, {
        indent: 2,
        lineWidth: -1, // 不限制行宽
        noRefs: true, // 不处理循环引用
        sortKeys: false, // 保持键的顺序
      });
    } catch (error: any) {
      throw new Error(`YAML 序列化失败: ${error.message}`);
    }
  }

  // 添加安全方案
  static addSecurityScheme(yamlObj: any, scheme: any) {
    if (!yamlObj.server) {
      yamlObj.server = { securitySchemes: [] };
    }
    if (!yamlObj.server.securitySchemes) {
      yamlObj.server.securitySchemes = [];
    }
    yamlObj.server.securitySchemes.push(scheme);
    return yamlObj;
  }

  // 添加工具
  static addTool(yamlObj: any, tool: any) {
    if (!yamlObj.tools) {
      yamlObj.tools = [];
    }
    yamlObj.tools.push(tool);
    return yamlObj;
  }

  // 更新API Key
  static updateApiKey(yamlObj: any, apiKey: string) {
    if (!yamlObj.server) {
      yamlObj.server = {};
    }
    if (!yamlObj.server.config) {
      yamlObj.server.config = {};
    }
    yamlObj.server.config.apiKey = apiKey;
    return yamlObj;
  }

  // 更新工具参数
  static updateToolArgs(yamlObj: any, toolName: string, args: any) {
    const tool = yamlObj.tools?.find((t: any) => t.name === toolName);
    if (tool) {
      tool.args = args;
    }
    return yamlObj;
  }

  // 验证YAML格式
  static validateYaml(yamlString: string) {
    try {
      yaml.load(yamlString);
      return { valid: true };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  // 创建新的YAML对象
  static createNewYaml() {
    return { ...DEFAULT_YAML_TEMPLATE };
  }
}

export default YamlUtil;
