/**
 * MCP (Model Context Protocol) 服务器相关接口定义文件
 * 定义了 MCP 服务器相关的数据结构，包括服务器配置、消费者信息、分页查询等
 * MCP 服务器用于提供 AI 模型可以调用的工具和 API 接口
 */

// 导入通用分页查询接口
import { PageQuery } from './common';

/**
 * MCP 服务器分页查询接口
 * 扩展了基础分页查询，增加了 MCP 服务器特定的查询参数
 */
export interface McpServerPageQuery extends PageQuery {
  mcpServerName?: string;  // MCP 服务器名称，用于模糊查询
  type?: string;           // MCP 服务器类型，用于类型过滤
}

/**
 * MCP 服务器接口
 * 定义了 MCP 服务器的基本信息数据结构
 */
export interface McpServer {
  name: string;                    // 服务器名称，唯一标识
  type: string;                    // 服务器类型：OPEN_API/DATABASE/REDIRECT_ROUTE
  description?: string;            // 服务器描述信息（可选）
  domains?: string[];              // 服务器绑定的域名列表（可选）
  services?: UpstreamService[];    // 上游服务列表（可选）
  rawConfigurations?: string;      // 原始配置信息，JSON 格式字符串（可选）
  dsn?: string;                    // 数据库连接字符串（数据库类型时可选）
  dbType?: string;                 // 数据库类型：MYSQL/PostgreSQL/Sqlite/Clickhouse（可选）
  upstreamPathPrefix?: string;     // 上游路径前缀（可选）
  consumerAuthInfo?: ConsumerAuthInfo; // 消费者认证信息（可选）
}

/**
 * MCP 服务器消费者接口
 * 定义了 MCP 服务器与消费者关联关系的数据结构
 */
export interface McpServerConsumers {
  mcpServerName: string;  // MCP 服务器名称
  consumers: string[];      // 消费者名称列表
}

/**
 * MCP 服务器消费者详情接口
 * 定义了 MCP 服务器消费者详细关联信息的数据结构
 */
export interface McpServerConsumerDetail {
  mcpServerName: string;  // MCP 服务器名称
  consumerName: string;   // 消费者名称
  type: string;           // 关联类型
}

/**
 * 上游服务接口（局部定义）
 * 定义了 MCP 服务器关联的上游服务信息
 */
interface UpstreamService {
  name: string;    // 服务名称
  port: number;    // 服务端口号
  version: string; // 服务版本
  weight: number;  // 服务权重，用于负载均衡
}

/**
 * 消费者认证信息接口（局部定义）
 * 定义了 MCP 服务器的消费者认证配置信息
 */
interface ConsumerAuthInfo {
  type: string;              // 认证类型
  enable: boolean;           // 是否启用认证
  allowedConsumers: string[]; // 允许访问的消费者列表
}
