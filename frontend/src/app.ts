/**
 * Higress 控制台前端应用主配置文件
 * 定义了应用级别的配置、权限配置、状态管理配置和数据加载器
 */

// 导入 ICE 框架的核心配置函数和类型定义
import { defineAuthConfig } from '@ice/plugin-auth/esm/types';
import { defineStoreConfig } from '@ice/plugin-store/esm/types';
import { defineAppConfig, defineDataLoader } from 'ice';

// 导入国际化配置，确保应用启动时加载多语言支持
import './i18n';

// 导入用户相关的类型定义和服务函数
import { UserInfo } from './interfaces/user';
import { getConfigs, getSystemInfo } from './services/system';
import { fetchUserInfo } from './services/user';

/**
 * 应用主配置
 * 定义 ICE 框架的应用级别配置
 * 参考文档：https://v3.ice.work/docs/guide/basic/app
 */
export default defineAppConfig(() => ({
  // 在这里设置应用级别的配置项
}));

/**
 * 权限配置
 * 根据用户信息定义不同角色的权限
 * @param appData - 应用数据，包含用户信息等
 * @returns 返回权限配置对象，定义管理员和普通用户的权限
 */
export const authConfig = defineAuthConfig(async (appData) => {
  const { userInfo = {} } = appData;
  return {
    initialAuth: {
      // 判断用户是否为管理员角色
      admin: userInfo && userInfo.type === 'admin',
      // 判断用户是否为普通用户角色
      user: userInfo && userInfo.type === 'user',
    },
  };
});

/**
 * 状态管理配置
 * 定义应用的全局状态初始值
 * @param appData - 应用数据，包含用户信息、配置信息和系统信息
 * @returns 返回状态管理配置，设置各个模块的初始状态
 */
export const storeConfig = defineStoreConfig(async (appData) => {
  const { userInfo = {}, config = {}, systemInfo = {} } = appData;
  return {
    initialStates: {
      // 用户模块的初始状态
      user: {
        currentUser: userInfo,
      },
      // 配置模块的初始状态
      config: {
        properties: config,
      },
      // 系统模块的初始状态
      system: systemInfo,
    },
  };
});

/**
 * 数据加载器
 * 在应用启动时加载必要的初始数据
 * 包括用户信息、配置信息和系统信息
 * @returns 返回加载的数据对象
 */
export const dataLoader = defineDataLoader(async () => {
  let userInfo: UserInfo;
  try {
    // 尝试获取用户信息
    userInfo = await getUserInfo();
  } catch (e) {
    // 如果获取失败，使用默认的空用户信息
    userInfo = {
      username: '',
      displayName: '',
    };
  }

  let config;
  try {
    // 尝试获取系统配置
    config = await getConfigs();
  } catch (e) {
    // 如果获取失败，使用空的配置对象
    config = {};
  }

  let systemInfo;
  try {
    // 尝试获取系统信息
    systemInfo = await getSystemInfo();
  } catch (e) {
    // 如果获取失败，使用空的系统信息对象
    systemInfo = {};
  }

  return {
    userInfo, // 用户信息
    config, // 系统配置
    systemInfo, // 系统信息
  };
});

/**
 * 获取用户信息的辅助函数
 * 封装了用户信息获取的逻辑，提供统一的错误处理
 * @returns 返回用户信息的 Promise
 */
async function getUserInfo(): Promise<UserInfo> {
  // 调用用户服务获取用户信息
  const userInfo = await fetchUserInfo();
  return userInfo;
}
