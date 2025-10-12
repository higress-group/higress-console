/**
 * TLS 证书相关接口定义文件
 * 定义了 TLS 证书相关的数据结构，包括证书基本信息、证书响应等
 * TLS 证书用于 HTTPS 加密通信，确保数据传输安全
 */

/**
 * TLS 证书接口
 * 定义了 TLS 证书的基本信息数据结构
 */
export interface TlsCertificate {
  name: string;            // 证书名称，用于标识和管理证书
  version: string;         // 证书版本号，用于版本管理
  cert: string;            // 证书内容（PEM 格式），包含公钥和证书信息
  key: string;             // 私钥内容（PEM 格式），用于解密和签名
  domains: string[];       // 证书绑定的域名列表，证书对这些域名有效
  validityStart: string;   // 证书有效期开始时间（ISO 格式字符串）
  validityEnd: string;     // 证书有效期结束时间（ISO 格式字符串）
  [propName: string]: any; // 支持额外的自定义属性
}

/**
 * TLS 证书响应接口
 * 定义了 TLS 证书列表查询的响应数据结构，包含分页信息
 */
export interface TlsCertificateResponse {
  data: TlsCertificate[];  // TLS 证书配置列表
  pageNum: number;        // 当前页码
  pageSize: number;       // 每页大小
  total: number;          // 总记录数
}
