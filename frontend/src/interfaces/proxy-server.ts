/**
 * 代理服务器相关接口定义文件
 * 定义了代理服务器相关的数据结构，包括代理服务器配置、响应类型等
 * 代理服务器用于配置上游服务的代理设置和连接参数
 */

/**
 * 代理服务器接口
 * 定义了代理服务器的基本信息数据结构
 */
export interface ProxyServer {
  type: string;              // 代理服务器类型，如 HTTP、HTTPS 等
  name: string;              // 代理服务器名称，唯一标识
  version?: string;          // 代理服务器版本（可选）
  serverAddress: string;     // 代理服务器地址（IP 或域名）
  serverPort: number;        // 代理服务器端口号
  connectTimeout?: number;   // 连接超时时间，单位为毫秒（可选）
  [propName: string]: any;   // 支持额外的自定义属性
}

/**
 * 服务源表单属性接口
 * 用于代理服务器配置的表单数据结构
 */
export interface ServiceSourceFormProps {
  name: string;              // 名称
  type: string;              // 类型
  [propName: string]: any; // 支持额外的自定义属性
}

/**
 * 代理服务器响应接口
 * 定义了代理服务器列表查询的响应数据结构，包含分页信息
 */
export interface ProxyServerResponse {
  data: ProxyServer[];    // 代理服务器配置列表
  pageNum: number;        // 当前页码
  pageSize: number;       // 每页大小
  total: number;          // 总记录数
}

/**
 * 代理服务器类型常量定义
 * 定义了系统支持的代理服务器类型
 */
export const ProxyServerTypes = {
  http: { key: 'HTTP', name: 'HTTP', enabled: true },  // HTTP 代理服务器
};

/**
 * 默认连接超时时间
 * 单位为毫秒，默认 5 秒
 */
export const DEFAULT_CONNECT_TIMEOUT = 5000; // 默认连接超时时间为 5000 毫秒（5 秒）