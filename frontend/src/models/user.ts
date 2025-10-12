/**
 * 用户状态管理模型
 * 管理当前用户的信息状态，包括用户基本信息、权限等
 * 使用 ICE 框架的 createModel 创建可观察的状态模型
 */

// 禁用 TypeScript 的类型断言一致性检查，允许使用 as 语法
/* eslint-disable @typescript-eslint/consistent-type-assertions */

// 导入用户信息的类型定义
import { UserInfo } from '@/interfaces/user';

// 导入 ICE 框架的状态模型创建函数
import { createModel } from 'ice';

/**
 * 用户模型的状态接口
 * 定义了用户模型中包含的状态数据结构
 */
interface ModelState {
  currentUser: UserInfo;  // 当前用户的信息对象
}

/**
 * 创建用户状态管理模型
 * 提供用户状态的存储和更新功能
 */
export default createModel({
  // 初始状态
  state: {
    currentUser: {},  // 初始化为空对象，等待登录后填充用户信息
  } as ModelState,
  
  // 状态更新函数（reducers）
  reducers: {
    /**
     * 更新当前用户信息
     * 用新的用户信息替换当前存储的用户信息
     * 
     * @param prevState - 当前的状态对象
     * @param payload - 新的用户信息对象
     */
    updateCurrentUser(prevState: ModelState, payload) {
      prevState.currentUser = payload;  // 直接修改状态（ICE 使用 Immer 实现不可变更新）
    },
  },
});
