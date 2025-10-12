/**
 * Higress 控制台服务模块统一导出文件
 * 集中导出所有业务相关的服务模块，便于在其他地方统一导入
 * 遵循单一职责原则，每个服务模块负责特定的业务领域
 */

// 用户相关服务：用户登录、用户信息管理、权限验证等
export * from './user';

// 服务相关服务：微服务管理、服务发现、服务配置等
export * from './service';

// 路由相关服务：路由规则管理、路由配置、流量转发等
export * from './route';

// 域名相关服务：域名管理、SSL 证书、域名解析等
export * from './domain';

// 服务源相关服务：服务来源管理、服务注册、服务发现配置等
export * from './service-source';

// TLS 证书相关服务：证书管理、证书上传、证书续期等
export * from './tls-certificate';

// 仪表板相关服务：数据统计、监控指标、系统状态等
export * from './dashboard';

// 插件相关服务：插件管理、插件配置、插件生命周期管理等
export * from './plugin';
