import { WasmPluginData } from '@/interfaces/route';
import { Empty, Row, Collapse } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CaretRightOutlined } from '@ant-design/icons';
import styles from './index.module.css';

const { Panel } = Collapse;

interface CategoryMap {
  [key: string]: string;
}

interface Props {
  pluginList: WasmPluginData[];
  renderPluginItem: (item: WasmPluginData) => React.ReactNode;
  categories?: CategoryMap;
}

const PluginCategory = (props: Props) => {
  const { t } = useTranslation();
  const { pluginList, renderPluginItem, categories = {} } = props;

  // Group plugins by category
  const groupedPlugins = useMemo(() => {
    const grouped: Record<string, WasmPluginData[]> = Object.keys(categories).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});

    // Group plugins by their categories
    pluginList.forEach(plugin => {
      const category = plugin.category || 'custom';
      if (grouped[category]) {
        grouped[category].push(plugin);
      } else {
        // If category doesn't exist in our map, add to custom
        grouped['custom'] = grouped['custom'] || [];
        grouped['custom'].push(plugin);
      }
    });

    return grouped;
  }, [pluginList, categories]);

  // Get categories in the defined order
  const sortedCategories = useMemo(() => {
    return Object.keys(categories);
  }, [categories]);

  return (
    <div className={styles.categoryContainer}>
      {sortedCategories.length > 0 ? (
        <Collapse
          defaultActiveKey={sortedCategories}
          ghost
          expandIconPosition="start"
          bordered={false}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              style={{ fontSize: '12px', marginRight: '4px' }}
            />
          )}
        >
          {sortedCategories.map(category => (
            <Panel
              key={category}
              header={
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: '15px',
                    color: 'rgba(0, 0, 0, 0.85)',
                  }}
                >
                  {categories[category] || category}
                </span>
              }
              className={styles.categoryPanel}
            >
              <div className={styles.categoryContent}>
                <Row gutter={[20, 20]}>
                  {groupedPlugins[category].map(item => renderPluginItem(item))}
                </Row>
              </div>
            </Panel>
          ))}
        </Collapse>
      ) : (
        <div className={styles.emptyCategory}>
          <Empty description={t('plugins.noPlugins')} />
        </div>
      )}
    </div>
  );
};

export default PluginCategory;
