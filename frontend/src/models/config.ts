/**
 * 配置状态管理模型
 * 管理应用的配置信息状态，包括系统配置、功能开关等
 * 使用 ICE 框架的 createModel 创建可观察的状态模型
 */

// 禁用 TypeScript 的类型断言一致性检查，允许使用 as 语法
/* eslint-disable @typescript-eslint/consistent-type-assertions */

// 导入 ICE 框架的状态模型创建函数
import { createModel } from 'ice';

/**
 * 配置模型的状态接口
 * 定义了配置模型中包含的状态数据结构
 */
interface ModelState {
  properties: any;  // 配置属性对象，存储各种配置信息
}

/**
 * 创建配置状态管理模型
 * 提供配置状态的存储和更新功能
 */
export default createModel({
  // 初始状态
  state: {
    properties: {},  // 初始化为空对象，等待加载配置数据
  } as ModelState,
  
  // 状态更新函数（reducers）
  reducers: {
    /**
     * 更新配置属性
     * 用新的配置对象替换当前存储的配置信息
     * 
     * @param prevState - 当前的状态对象
     * @param payload - 新的配置对象
     */
    updateProperties(prevState: ModelState, payload) {
      prevState.properties = payload;  // 直接修改状态（ICE 使用 Immer 实现不可变更新）
    },
  },
});
