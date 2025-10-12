/**
 * 配置相关常量定义文件
 * 定义了系统中使用的配置键名常量
 * 这些常量用于标识系统配置、登录配置、运行模式等
 */

/**
 * 系统初始化状态配置键
 * 用于标识系统是否已经完成初始化
 */
export const SYSTEM_INITIALIZED = 'system.initialized';

/**
 * 登录提示信息配置键
 * 用于配置登录页面显示的提示信息
 */
export const LOGIN_PROMPT = 'login.prompt';

/**
 * 首页重定向目标配置键
 * 用于配置用户访问首页时的重定向目标页面
 */
export const INDEX_REDIRECT_TARGET = 'index.redirect-target';

/**
 * 系统运行模式配置键
 * 用于标识系统的运行模式（独立模式或 Kubernetes 模式）
 */
export const MODE = 'mode';

/**
 * 系统运行模式枚举
 * 定义了系统支持的运行模式
 */
export enum Mode {
  STANDALONE = 'standalone',  // 独立运行模式，不依赖 Kubernetes
  K8S = 'k8s',                // Kubernetes 模式，运行在 Kubernetes 集群中
}
