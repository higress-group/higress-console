import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Form } from 'antd';
import { useNavigate, useLocation } from 'ice';
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
}

const HighSearch: React.FC<HighSearchProps> = ({ searchParamsList }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [form] = Form.useForm();

  const [activeSearchName, setActiveSearchName] = useState<string>('');
  const [activeSearchValue, setActiveSearchValue] = useState<string>('');

  const defaultName = searchParamsList[0]?.name || '';
  const currentType = searchParamsList.find((item) => item.name === activeSearchName)?.type;
  const currentOptions = searchParamsList.find((item) => item.name === activeSearchName)?.optionList || [];
  const currentPlaceholder = searchParamsList.find((item) => item.name === activeSearchName)?.placeholder || '';

  useEffect(() => {
    initSearch();
  }, []);

  const initSearch = () => {
    const selectOne = searchParamsList.find(
      (item) => searchParams.get(item.name) && searchParams.get(item.name) !== undefined,
    );
    const newActiveSearchName = searchParams.get('activeSearchName') || selectOne?.name || defaultName;
    setActiveSearchName(newActiveSearchName);
    handleFill(newActiveSearchName);
  };

  const handleFill = (name: string) => {
    setActiveSearchValue(searchParams.get(name) || '');
  };

  const handleSearch = () => {
    const newParams = new URLSearchParams(location.search);
    newParams.set(activeSearchName, activeSearchValue);
    newParams.set('current', '1');
    newParams.set('activeSearchName', activeSearchName);

    navigate({
      pathname: location.pathname,
      search: newParams.toString(),
    });
  };


  return (
    <div className="high-search">
      <Form form={form} layout="inline">
        <Form.Item className="high-search__left">
          <Select
            value={activeSearchName}
            onChange={(value) => {
              setActiveSearchName(value);
              handleFill(value);
            }}
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
              onChange={setActiveSearchValue}
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
              onChange={(e) => setActiveSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
              addonAfter={<Button type="text" size="small" onClick={handleSearch} icon={<SearchOutlined />} />}
            />
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default HighSearch;
