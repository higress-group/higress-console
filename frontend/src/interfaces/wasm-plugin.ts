/**
 * WASM 插件相关接口定义文件
 * 定义了 WASM 插件相关的数据结构，包括插件配置、镜像拉取策略、插件阶段等
 * WASM 插件用于扩展网关功能，支持自定义的业务逻辑处理
 */

/**
 * WASM 插件数据接口
 * 定义了 WASM 插件的完整配置信息数据结构
 */
export interface WasmPluginData {
  id?: string;                          // 插件唯一标识符（可选）
  name: string;                        // 插件名称，用于标识插件
  version?: string;                    // 插件版本号（可选）
  category?: string;                   // 插件分类（可选）
  title?: string;                      // 插件标题，用于界面显示（可选）
  description?: string;                // 插件描述信息（可选）
  icon?: string;                       // 插件图标路径（可选）
  builtIn?: boolean;                   // 是否为内置插件（可选）
  imageRepository?: string;          // 插件镜像仓库地址（可选）
  imageVersion?: string;               // 插件镜像版本（可选）
  phase?: string;                      // 插件执行阶段（可选）
  priority?: number;                   // 插件执行优先级（可选）
  imagePullPolicy?: string;           // 镜像拉取策略（可选）
  imagePullSecret?: string;           // 镜像拉取密钥（可选）
  customConfigs?: {                    // 自定义配置项（可选）
    [key: string]: string;              // 键值对形式的自定义配置
  };
  enabled?: boolean;                   // 插件是否启用（可选）
  internal?: boolean;                  // 是否为内部插件（可选）
  resKey?: string;                     // 资源键名（可选）
  key?: string;                        // 插件键名（可选）
  [key: string]: any;                  // 支持额外的自定义属性
}

/**
 * 镜像拉取策略枚举
 * 定义了容器镜像拉取的不同策略
 */
export enum ImagePullPolicy {
  UNSPECIFIED = "UNSPECIFIED_POLICY",    // 未指定策略，使用默认策略
  IF_NOT_PRESENT = "IfNotPresent",      // 如果本地不存在则拉取
  ALWAYS = "Always",                    // 总是拉取最新镜像
}

/**
 * 插件执行阶段枚举
 * 定义了 WASM 插件在请求处理管道中的执行阶段
 */
export enum PluginPhase {
  UNSPECIFIED = "UNSPECIFIED_PHASE",    // 未指定阶段
  AUTHN = "AUTHN",                      // 认证阶段，用于身份验证
  AUTHZ = "AUTHZ",                      // 授权阶段，用于权限验证
  STATS = "STATS",                      // 统计阶段，用于指标收集
}
