/**
 * Higress 控制台状态管理主配置文件
 * 创建和配置应用的全局状态存储
 */

// 导入 ICE 框架的存储创建函数
import { createStore } from 'ice';

// 导入各个模块的状态管理模型
import user from '../src/models/user';      // 用户模块状态管理
import config from '../src/models/config';  // 配置模块状态管理
import system from '../src/models/system';  // 系统模块状态管理

/**
 * 创建应用的全局状态存储
 * 将各个模块的状态管理模型组合到主存储中
 */
export default createStore({
  user,    // 用户模块：管理用户登录状态、用户信息等
  config,  // 配置模块：管理应用配置、系统设置等
  system,  // 系统模块：管理系统信息、运行状态等
});
