/**
 * 服务源相关接口定义文件
 * 定义了服务发现和服务源相关的数据结构，包括服务源配置、服务源类型、协议等
 * 服务源用于配置服务的发现机制，支持多种注册中心和服务发现方式
 */

/**
 * 服务源接口
 * 定义了服务源的基本信息数据结构
 * 服务源用于配置服务的发现机制，如注册中心地址、认证信息等
 */
export interface ServiceSource {
  name: string;                              // 服务源名称，唯一标识
  version?: string;                          // 服务源版本（可选）
  type: string;                              // 服务源类型，如 nacos、zookeeper 等
  builtIn?: boolean;                         // 是否为内置服务源（可选）
  domain?: string;                             // 服务源域名或地址（可选）
  port?: number;                             // 服务源端口号（可选）
  properties?: ServiceSourceProperties;      // 服务源特定属性配置（可选）
  [propName: string]: any;                   // 支持额外的自定义属性
}

/**
 * 服务源属性接口
 * 定义了不同类型服务源的特定配置属性
 */
export interface ServiceSourceProperties {
  nacosNamespaceId?: string;   // Nacos 命名空间 ID（Nacos 专用）
  nacosGroups?: string[];       // Nacos 分组列表（Nacos 专用）
  zkServicesPath?: string[];    // Zookeeper 服务路径列表（Zookeeper 专用）
}

/**
 * 服务源表单属性接口
 * 定义了服务源表单的数据结构，用于前端表单展示和编辑
 */
export interface ServiceSourceFormProps {
  name: string;    // 服务源名称
  type: string;    // 服务源类型
  domain: string;  // 服务源域名
  port: number;    // 服务源端口
  [propName: string]: any; // 支持额外的自定义属性
}

/**
 * 服务源响应接口
 * 定义了服务源列表查询的响应数据结构，包含分页信息
 */
export interface ServiceSourceResponse {
  data: ServiceSource[];    // 服务源配置列表
  pageNum: number;          // 当前页码
  pageSize: number;         // 每页大小
  total: number;            // 总记录数
}

/**
 * 服务源类型配置接口
 * 定义了服务源类型的配置信息，包括显示名称、启用状态等
 */
export interface ServiceSourceTypeConfig {
  key: string;          // 类型键名
  name: string;         // 类型显示名称
  enabled?: boolean;    // 是否启用（可选）
  i18n?: boolean;       // 是否需要国际化（可选）
  mcpSupported?: boolean; // 是否支持 MCP（可选）
}

/**
 * 服务源类型常量定义
 * 定义了系统支持的各种服务源类型及其配置
 */
export const ServiceSourceTypes = {
  nacos3: { key: 'nacos3', name: 'Nacos 3.x', enabled: true, mcpSupported: true },    // Nacos 3.x 版本
  nacos2: { key: 'nacos2', name: 'Nacos 2.x', enabled: true },                      // Nacos 2.x 版本
  nacos: { key: 'nacos', name: 'Nacos 1.x', enabled: true },                          // Nacos 1.x 版本
  zookeeper: { key: 'zookeeper', name: 'Zookeeper', enabled: true },                  // Zookeeper 注册中心
  consul: { key: 'consul', name: 'Consul', enabled: true },                          // Consul 注册中心
  eureka: { key: 'eureka', name: 'Eureka', enabled: true },                          // Eureka 注册中心
  static: { key: 'static', name: 'serviceSource.types.static.name', i18n: true, enabled: true }, // 静态服务列表
  dns: { key: 'dns', name: 'serviceSource.types.dns.name', i18n: true, enabled: true },          // DNS 服务发现
};

/**
 * 服务协议常量定义
 * 定义了服务通信支持的协议类型及其配置
 */
export const ServiceProtocols = {
  unspecified: { key: '', name: 'serviceSource.protocols.unspecified', i18n: true, tlsEnabled: false }, // 未指定协议
  http: { key: 'http', name: 'HTTP', tlsEnabled: false },                                              // HTTP 协议
  https: { key: 'https', name: 'HTTPS', tlsEnabled: true },                                            // HTTPS 协议（支持 TLS）
  grpc: { key: 'grpc', name: 'gRPC', tlsEnabled: false },                                            // gRPC 协议
  grpcs: { key: 'grpcs', name: 'gRPCS', tlsEnabled: true },                                          // gRPCS 协议（支持 TLS）
};

/**
 * 列表项接口
 * 用于自定义组件的列表项处理
 */
interface ListEntry {
  provider: string;   // 提供商名称
  width: number;      // 宽度
}

/**
 * 自定义组件处理接口
 * 定义了自定义组件的方法接口
 */
export interface CustomComponentHandles {
  addItem: (any) => void;           // 添加列表项
  getList: () => ListEntry[];       // 获取列表
}

/**
 * 判断是否为 Nacos 类型
 * 检查给定的服务源类型是否为 Nacos 系列（包括 1.x、2.x、3.x）
 * 
 * @param type - 服务源类型字符串
 * @returns 如果是 Nacos 类型返回 true，否则返回 false
 */
export function isNacosType(type: string): boolean {
  switch (type) {
    case ServiceSourceTypes.nacos.key:
    case ServiceSourceTypes.nacos2.key:
    case ServiceSourceTypes.nacos3.key:
      return true;
    default:
      return false;
  }
}

/**
 * 根据键名获取服务源类型配置
 * 从服务源类型常量中获取指定键名的配置信息
 * 
 * @param key - 服务源类型键名
 * @returns 返回对应的服务源类型配置，如果不存在返回 null
 */
export function getServiceSourceTypeConfig(key: string): ServiceSourceTypeConfig | null {
  return ServiceSourceTypes[key] || null;
}