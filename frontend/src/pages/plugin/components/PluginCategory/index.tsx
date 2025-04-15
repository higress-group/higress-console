import { WasmPluginData } from '@/interfaces/route';
import { Empty, Row, Collapse } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CaretRightOutlined } from '@ant-design/icons';
import styles from './index.module.css';

const { Panel } = Collapse;

interface CategoryItem {
  key: string;
  label: string;
}

interface Props {
  pluginList: WasmPluginData[];
  renderPluginItem: (item: WasmPluginData) => React.ReactNode;
  categoryList: CategoryItem[];
}

const PluginCategory = (props: Props) => {
  const { t } = useTranslation();
  const { pluginList, renderPluginItem, categoryList = [] } = props;

  // Group plugins by category
  const groupedPlugins = useMemo(() => {
    const grouped: Record<string, WasmPluginData[]> = {};
    pluginList.forEach(plugin => {
      const category = plugin.category || 'custom';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(plugin);
    });

    return grouped;
  }, [pluginList, categoryList]);

  return (
    <div className={styles.categoryContainer}>
      {categoryList.length > 0 ? (
        <Collapse
          defaultActiveKey={categoryList.map(item => item.key)}
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
          {categoryList.map(category => {
            if (groupedPlugins[category.key] && groupedPlugins[category.key].length > 0) {
              return (
                <Panel
                  key={category.key}
                  header={
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: '15px',
                        color: 'rgba(0, 0, 0, 0.85)',
                      }}
                    >
                      {category.label}
                    </span>
                  }
                  className={styles.categoryPanel}
                >
                  <div className={styles.categoryContent}>
                    <Row gutter={[20, 20]}>
                      {groupedPlugins[category.key].map(item => renderPluginItem(item))}
                    </Row>
                  </div>
                </Panel>
              );
            }
            return null;
          })}
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
