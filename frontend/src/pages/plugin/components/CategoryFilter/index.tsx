import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const getPluginCategories = (t: any) => [
  { value: 'ai', label: 'AI' },
  { value: 'auth', label: t('plugins.categories.auth') },
  { value: 'security', label: t('plugins.categories.security') },
  { value: 'traffic', label: t('plugins.categories.traffic') },
  { value: 'transform', label: t('plugins.categories.transform') },
  { value: 'o11y', label: t('plugins.categories.o11y') },
  { value: 'custom', label: t('plugins.categories.custom') },
];

interface CategoryFilterProps {
  onChange: (categories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onChange }) => {
  const { t } = useTranslation();
  const pluginCategories = getPluginCategories(t);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAllPlugins, setShowAllPlugins] = useState<boolean>(true);

  const handleChange = (values: string[]) => {
    setSelectedCategories(values);
    setShowAllPlugins(values.length === 0);

    if (values.length === 0) {
      onChange(pluginCategories.map(category => category.value));
    } else {
      onChange(values);
    }
  };

  useEffect(() => {
    onChange(pluginCategories.map(category => category.value));
  }, []);

  const getSelectWidth = () => {
    if (showAllPlugins) {
      return '100px';
    } else {
      const baseWidth = 50;
      const itemWidth = 80;
      const calculatedWidth = baseWidth + selectedCategories.length * itemWidth;
      const maxWidth = 600;
      return `${Math.min(calculatedWidth, maxWidth)}px`;
    }
  };

  return (
    <div className={styles.categoryFilterWrapper} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <Select
        mode="multiple"
        style={{
          width: getSelectWidth(),
          transition: 'width 0.3s',
          height: '32px',
          fontSize: '14px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        placeholder={t('plugins.allPlugins')}
        value={selectedCategories}
        onChange={handleChange}
        options={pluginCategories}
        maxTagCount={100}
        maxTagTextLength={10}
        maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}...`}
        allowClear
        showArrow
        showSearch={false}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ minWidth: '180px' }}
        listHeight={256}
        className="category-filter-select"
      />
    </div>
  );
};

export default CategoryFilter;
