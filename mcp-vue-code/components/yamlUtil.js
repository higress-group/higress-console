import yaml from 'js-yaml'

// 默认的YAML模板
const DEFAULT_YAML_TEMPLATE = {
  server: {
    name: 'rest-amap-server',
    config: {
      apiKey: 'your-api-key-here',
    },
    securitySchemes: [],
  },
  tools: [],
}

class YamlUtil {
  // 将YAML字符串转换为JS对象
  static parseYaml(yamlString) {
    try {
      return yaml.load(yamlString)
    } catch (error) {
      throw new Error(`YAML解析错误: ${error.message}`)
    }
  }

  // 将JS对象转换为YAML字符串
  static stringifyYaml(obj) {
    try {
      return yaml.dump(obj, {
        indent: 2,
        lineWidth: -1, // 不限制行宽
        noRefs: true, // 不处理循环引用
        sortKeys: false, // 保持键的顺序
      })
    } catch (error) {
      throw new Error(`YAML序列化错误: ${error.message}`)
    }
  }

  // 添加安全方案
  static addSecurityScheme(yamlObj, scheme) {
    if (!yamlObj.server) {
      yamlObj.server = { securitySchemes: [] }
    }
    if (!yamlObj.server.securitySchemes) {
      yamlObj.server.securitySchemes = []
    }
    yamlObj.server.securitySchemes.push(scheme)
    return yamlObj
  }

  // 添加工具
  static addTool(yamlObj, tool) {
    if (!yamlObj.tools) {
      yamlObj.tools = []
    }
    yamlObj.tools.push(tool)
    return yamlObj
  }

  // 更新API Key
  static updateApiKey(yamlObj, apiKey) {
    if (!yamlObj.server) {
      yamlObj.server = {}
    }
    if (!yamlObj.server.config) {
      yamlObj.server.config = {}
    }
    yamlObj.server.config.apiKey = apiKey
    return yamlObj
  }

  // 更新工具参数
  static updateToolArgs(yamlObj, toolName, args) {
    const tool = yamlObj.tools?.find((t) => t.name === toolName)
    if (tool) {
      tool.args = args
    }
    return yamlObj
  }

  // 验证YAML格式
  static validateYaml(yamlString) {
    try {
      yaml.load(yamlString)
      return { valid: true }
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      }
    }
  }

  // 创建新的YAML对象
  static createNewYaml() {
    return { ...DEFAULT_YAML_TEMPLATE }
  }
}

export default YamlUtil
