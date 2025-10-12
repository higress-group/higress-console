/**
 * 高级搜索组件
 * 提供灵活的搜索功能，支持多种搜索类型和搜索方式
 * 左侧为搜索类型选择，右侧为搜索值输入（支持文本输入或下拉选择）
 */

// 导入 React
import React from 'react';

// 导入 Ant Design 组件
import { Select, Input, Button, Form } from 'antd';

// 导入样式文件
import './index.scss';

// 导入搜索图标
import { SearchOutlined } from '@ant-design/icons';

/**
 * 搜索参数接口
 * 定义了搜索类型配置的数据结构
 */
interface SearchParam {
  label: string;                                    // 搜索类型显示名称
  name: string;                                     // 搜索类型标识符
  placeholder: string;                              // 输入框占位符文本
  type?: 'select';                                  // 输入类型：select 表示下拉选择，其他为文本输入
  optionList?: Array<{ label: string; value: string }>; // 下拉选项列表（当 type 为 select 时有效）
}

/**
 * 高级搜索组件属性接口
 */
interface HighSearchProps {
  searchParamsList: SearchParam[];                  // 搜索参数配置列表
  activeSearchName: string;                         // 当前选中的搜索类型名称
  activeSearchValue: string;                        // 当前搜索值
  onSearchNameChange: (name: string) => void;       // 搜索类型变更回调
  onSearchValueChange: (value: string) => void;    // 搜索值变更回调
  onSearch: () => void;                            // 搜索执行回调
  width?: string;                                   // 组件宽度
  size?: 'small' | 'middle' | 'large';            // 组件尺寸
}

/**
 * 高级搜索组件
 * 提供左侧搜索类型选择和右侧搜索值输入的组合搜索功能
 * @param props - 组件属性
 * @returns 返回高级搜索组件
 */
const HighSearch: React.FC<HighSearchProps> = ({
  searchParamsList,
  activeSearchName,
  activeSearchValue,
  onSearchNameChange,
  onSearchValueChange,
  onSearch,
  width,
  size,
}) => {
  // 创建表单实例
  const [form] = Form.useForm();

  // 获取当前搜索类型的配置信息
  const currentType = searchParamsList.find((item) => item.name === activeSearchName)?.type;
  const currentOptions = searchParamsList.find((item) => item.name === activeSearchName)?.optionList || [];
  const currentPlaceholder = searchParamsList.find((item) => item.name === activeSearchName)?.placeholder || '';

  return (
    <div className="high-search">
      {/* 内联表单布局 */}
      <Form form={form} layout="inline" size={size} style={{ width }}>
        {/* 左侧：搜索类型选择 */}
        <Form.Item className="high-search__left">
          <Select
            value={activeSearchName}              // 当前选中的搜索类型
            onChange={onSearchNameChange}         // 类型变更事件
          >
            {/* 渲染所有可用的搜索类型 */}
            {searchParamsList.map((item) => (
              <Select.Option key={item.name} value={item.name}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* 右侧：搜索值输入 */}
        <Form.Item className="high-search__right">
          {/* 如果当前搜索类型是下拉选择 */}
          {currentType === 'select' ? (
            <Select
              placeholder={currentPlaceholder}    // 占位符文本
              value={activeSearchValue}           // 当前选中的值
              onChange={onSearchValueChange}      // 值变更事件
              allowClear                           // 允许清空
            >
              {/* 渲染下拉选项 */}
              {currentOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          ) : (
            /* 如果当前搜索类型是文本输入 */
            <Input
              placeholder={currentPlaceholder}    // 占位符文本
              value={activeSearchValue}           // 当前输入的值
              onChange={(e) => onSearchValueChange(e.target.value)} // 输入变更事件
              onPressEnter={onSearch}             // 回车键触发搜索
              allowClear                           // 允许清空
              addonAfter={
                // 搜索按钮（显示在输入框右侧）
                <Button 
                  type="text" 
                  size="small" 
                  onClick={onSearch} 
                  icon={<SearchOutlined />} 
                />
              }
            />
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default HighSearch;
