/**
 * Higress 控制台通用工具函数库
 * 提供项目中常用的工具函数，包括对象处理、YAML 操作等
 */

import yaml from 'js-yaml';

/**
 * 深度清除对象值函数
 * 递归遍历对象的所有属性，将非对象类型的值替换为占位符'######'
 * 用于生成 YAML 模板或清空表单数据
 *
 * @param obj - 要处理的对象
 * @param hash - WeakMap 用于防止循环引用，默认为新的 WeakMap
 * @returns 返回处理后的对象，所有非对象类型的值都被替换为占位符
 */
export const clearObjectVal = (obj, hash = new WeakMap()) => {
  if (obj === null) return obj; // 如果是 null 或者 undefined 就不进行拷贝操作
  if (obj instanceof Date) return new Date(obj); // 如果是 Date 对象，返回新的 Date 实例
  if (obj instanceof RegExp) return new RegExp(obj); // 如果是正则表达式，返回新的 RegExp 实例

  // 可能是对象或者普通的值，如果是函数的话是不需要深拷贝
  if (typeof obj !== 'object') return '######'; // 非对象类型返回占位符

  // 是对象的话就要进行深拷贝
  if (hash.get(obj)) return hash.get(obj); // 如果已经处理过这个对象，直接返回缓存结果

  // eslint-disable-next-line
  let cloneObj = new obj.constructor(); // 创建相同类型的空对象

  // 找到的是所属类原型上的 constructor，而原型上的 constructor 指向的是当前类本身
  hash.set(obj, ''); // 标记当前对象已处理，防止循环引用

  for (let key in obj) {
    // eslint-disable-next-line
    if (obj && obj?.hasOwnProperty(key)) {
      // 实现一个递归清除，处理对象的所有属性
      cloneObj[key] = clearObjectVal(obj[key], hash);
    }
  }
  return cloneObj;
};

/**
 * 生成 YAML 空值字符串函数
 * 将对象转换为 YAML 字符串，并用空字符串替换占位符
 * 用于生成配置文件模板或清空 YAML 内容
 *
 * @param value - 要转换的对象
 * @returns 返回处理后的 YAML 字符串，占位符被替换为空字符串
 */
export const getYamlEmptyValString = (value) => {
  // 首先清除对象值，将所有非对象类型替换为占位符
  const clearObj = clearObjectVal(value);

  // 将处理后的对象转换为 YAML 字符串
  let yamlString = yaml.dump(clearObj, {});

  // 移除 YAML 字符串中的占位符
  // eslint-disable-next-line @iceworks/best-practices/recommend-polyfill
  yamlString = yamlString.replaceAll("'######'", '');
  return yamlString;
};

/**
 * 判断是否为内部资源
 * 检查资源名称是否以 .internal 结尾
 *
 * @param name - 资源名称
 * @returns 如果是内部资源返回 true，否则返回 false
 */
export const isInternalResource = (name: string) => {
  // 检查名称是否存在且以 .internal 结尾
  return name && name.endsWith('.internal');
};
