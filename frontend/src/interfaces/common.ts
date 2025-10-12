/**
 * 通用接口定义文件
 * 定义了系统中通用的数据结构，如下拉选项、分页查询等
 * 这些接口在多个模块中被复用
 */

/**
 * 下拉选项项接口
 * 定义了下拉选择框中选项的数据结构
 * 支持额外的自定义属性
 */
export interface OptionItem {
  label: string;     // 选项显示文本
  value: string;     // 选项值，通常用于标识和提交
  [propName: string]: any; // 支持额外的自定义属性
}

/**
 * 分页查询参数接口
 * 定义了分页查询时所需的参数数据结构
 */
export interface PageQuery {
  pageNum?: number;  // 页码，从 1 开始计数（可选）
  pageSize?: number; // 每页显示的记录数（可选）
}
