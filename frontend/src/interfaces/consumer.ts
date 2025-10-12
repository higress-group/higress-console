/**
 * 消费者相关接口定义文件
 * 定义了消费者相关的数据结构，包括消费者信息、认证凭据、认证类型等
 * 消费者用于 API 的访问控制和认证管理
 */

/**
 * 消费者接口
 * 定义了消费者的基本信息数据结构
 */
export interface Consumer {
  name: boolean;              // 消费者名称（注意：这里类型定义为 boolean，可能是接口定义错误）
  credentials: Credential[]; // 消费者的认证凭据列表
}

/**
 * 认证凭据接口
 * 定义了消费者认证凭据的基本结构
 */
export interface Credential {
  type: string;              // 认证凭据类型，如 key-auth、oauth2、jwt-auth 等
  [propName: string]: any;   // 支持额外的自定义属性
}

/**
 * 认证类型常量定义
 * 定义了系统支持的各种消费者认证方式及其配置
 */
export const CredentialType = {
  KEY_AUTH: { 
    key: 'key-auth', 
    displayName: 'Key Auth', 
    enabled: true, 
    displayColor: '#4095e5' 
  },
  OAUTH2: { 
    key: 'oauth2', 
    displayName: 'OAuth2', 
    enabled: false, 
    displayColor: '#4095e5' 
  },
  JWT_AUTH: { 
    key: 'jwt-auth', 
    displayName: 'JWT', 
    enabled: false, 
    displayColor: '#4095e5' 
  },
};

/**
 * Key Auth 认证凭据接口
 * 扩展了基础认证凭据，定义了 Key 认证的具体配置
 */
export interface KeyAuthCredential extends Credential {
  source: string;   // 认证信息来源位置，如 HEADER、QUERY、BEARER 等
  key?: string;     // 认证信息的键名（可选）
  value: string;    // 认证信息的值
}

/**
 * Key Auth 认证来源枚举
 * 定义了 Key 认证信息可以存放的位置
 */
export enum KeyAuthCredentialSource {
  BEARER = 'BEARER',    // Bearer Token 方式（Authorization 头）
  HEADER = 'HEADER',    // 自定义请求头方式
  QUERY = 'QUERY',      // URL 查询参数方式
}
