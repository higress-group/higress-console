/**
 * 系统状态管理模型
 * 管理系统相关的状态信息，包括系统版本、运行状态等
 * 使用 ICE 框架的 createModel 创建可观察的状态模型
 */

// 禁用 TypeScript 的类型断言一致性检查，允许使用 as 语法
/* eslint-disable @typescript-eslint/consistent-type-assertions */

// 导入 ICE 框架的状态模型创建函数
import { createModel } from 'ice';

/**
 * 系统模型的状态接口
 * 定义了系统模型中包含的状态数据结构
 */
interface ModelState {
  version: string;  // 系统版本号
}

/**
 * 创建系统状态管理模型
 * 提供系统状态的存储和更新功能
 */
export default createModel({
  // 初始状态
  state: {
    version: '',  // 初始化为空字符串，等待加载系统信息
  } as ModelState,
  
  // 状态更新函数（reducers）
  reducers: {
    /**
     * 更新系统信息
     * 将新的系统信息合并到当前状态中
     * 支持批量更新多个系统属性
     * 
     * @param prevState - 当前的状态对象
     * @param payload - 新的系统信息对象
     */
    updateSystemInfo(prevState: ModelState, payload) {
      Object.assign(prevState, payload);  // 合并新的系统信息到当前状态
    },
  },
});
