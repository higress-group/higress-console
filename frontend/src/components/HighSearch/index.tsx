import React from 'react';
import { Select, Input, Button, Form } from 'antd';
import './index.scss';
import { SearchOutlined } from '@ant-design/icons';

interface SearchParam {
  label: string;
  name: string;
  placeholder: string;
  type?: 'select';
  optionList?: Array<{ label: string; value: string }>;
}

interface HighSearchProps {
  searchParamsList: SearchParam[];
  activeSearchName: string;
  activeSearchValue: string;
  onSearchNameChange: (name: string) => void;
  onSearchValueChange: (value: string) => void;
  onSearch: () => void;
  width?: string;
  size?: 'small' | 'middle' | 'large';
}

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
  const [form] = Form.useForm();

  const currentType = searchParamsList.find((item) => item.name === activeSearchName)?.type;
  const currentOptions = searchParamsList.find((item) => item.name === activeSearchName)?.optionList || [];
  const currentPlaceholder = searchParamsList.find((item) => item.name === activeSearchName)?.placeholder || '';

  return (
    <div className="high-search">
      <Form form={form} layout="inline" size={size} style={{ width }}>
        <Form.Item className="high-search__left">
          <Select
            value={activeSearchName}
            onChange={onSearchNameChange}
          >
            {searchParamsList.map((item) => (
              <Select.Option key={item.name} value={item.name}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item className="high-search__right">
          {currentType === 'select' ? (
            <Select
              placeholder={currentPlaceholder}
              value={activeSearchValue}
              onChange={onSearchValueChange}
              allowClear
            >
              {currentOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <Input
              placeholder={currentPlaceholder}
              value={activeSearchValue}
              onChange={(e) => onSearchValueChange(e.target.value)}
              onPressEnter={onSearch}
              allowClear
              addonAfter={<Button type="text" size="small" onClick={onSearch} icon={<SearchOutlined />} />}
            />
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default HighSearch;
