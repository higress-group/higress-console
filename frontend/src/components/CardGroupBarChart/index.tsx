import { Column } from '@ant-design/charts';
import { Card } from 'antd';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

interface CardConfig {
  title?: string;
  chartData?: Array<Record<string, any>>;
  chartHeight?: number;
}

const DEFAULT_DATA: CardConfig = {
  title: 'chart.groupBar.defaultData.title',
  chartData: [
    { category: 'chart.groupBar.defaultData.category_1', value: 123, type: 'chart.groupBar.defaultData.shop_1' },
    { category: 'chart.groupBar.defaultData.category_1', value: 231, type: 'chart.groupBar.defaultData.shop_2' },
    { category: 'chart.groupBar.defaultData.category_1', value: 321, type: 'chart.groupBar.defaultData.shop_3' },
    { category: 'chart.groupBar.defaultData.category_2', value: -234, type: 'chart.groupBar.defaultData.shop_1' },
    { category: 'chart.groupBar.defaultData.category_2', value: -342, type: 'chart.groupBar.defaultData.shop_2' },
    { category: 'chart.groupBar.defaultData.category_2', value: -432, type: 'chart.groupBar.defaultData.shop_3' },
    { category: 'chart.groupBar.defaultData.category_3', value: 322, type: 'chart.groupBar.defaultData.shop_1' },
    { category: 'chart.groupBar.defaultData.category_3', value: 211, type: 'chart.groupBar.defaultData.shop_2' },
    { category: 'chart.groupBar.defaultData.category_3', value: 113, type: 'chart.groupBar.defaultData.shop_3' },
    { category: 'chart.groupBar.defaultData.category_4', value: 435, type: 'chart.groupBar.defaultData.shop_1' },
    { category: 'chart.groupBar.defaultData.category_4', value: 543, type: 'chart.groupBar.defaultData.shop_2' },
    { category: 'chart.groupBar.defaultData.category_4', value: 333, type: 'chart.groupBar.defaultData.shop_3' },
    { category: 'chart.groupBar.defaultData.category_5', value: 111, type: 'chart.groupBar.defaultData.shop_1' },
    { category: 'chart.groupBar.defaultData.category_5', value: 452, type: 'chart.groupBar.defaultData.shop_2' },
    { category: 'chart.groupBar.defaultData.category_5', value: 234, type: 'chart.groupBar.defaultData.shop_3' },
  ],
  chartHeight: 500,
};

export interface CardGroupBarChartProps {
  cardConfig?: CardConfig;
}

const CardGroupBarChart: React.FunctionComponent<CardGroupBarChartProps> = (props: CardGroupBarChartProps): JSX.Element => {
  const { t } = useTranslation();

  const {
    cardConfig = DEFAULT_DATA,
  } = props;

  const { title, chartData, chartHeight } = cardConfig;

  if (Array.isArray(chartData)) {
    for (let i = 0, n = chartData.length; i < n; ++i) {
      const item = chartData[i];
      chartData[i] = Object.assign({}, item, { category: t(item.category), type: t(item.type) });
    }
  }

  return (
    <Card title={typeof title === 'string' ? t(title) : title} className={styles.cardGroupBarChart}>
      <Column
        data={chartData!}
        xField="category"
        yField="value"
        seriesField="type"
        isGroup
        width={10}
        height={chartHeight}
        label={{
          // 可手动配置 label 数据标签位置
          position: 'middle',
          // 可配置附加的布局方法
          layout: [
            // 柱形图数据标签位置自动调整
            { type: 'interval-adjust-position' },
            // 数据标签防遮挡
            { type: 'interval-hide-overlap' },
            // 数据标签文颜色自动调整
            { type: 'adjust-color' },
          ],
        }}
      />
    </Card >
  );
};

export default CardGroupBarChart;
