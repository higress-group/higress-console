import { Pie } from '@ant-design/charts';
import type { RadioChangeEvent } from 'antd';
import { Card, Radio } from 'antd';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const { useState } = React;

interface CardConfig {
  title?: string;
  value?: number;
  chartData?: Array<Record<string, any>>;
  chartHeight?: number;
}

const DEFAULT_DATA: CardConfig = {
  title: 'chart.pie.defaultData.title',
  value: 183112,
  chartData: [
    {
      type: 'chart.pie.defaultData.sample_1',
      value: 40,
    },
    {
      type: 'chart.pie.defaultData.sample_2',
      value: 21,
    },
    {
      type: 'chart.pie.defaultData.sample_3',
      value: 17,
    },
    {
      type: 'chart.pie.defaultData.sample_4',
      value: 13,
    },
    {
      type: 'chart.pie.defaultData.sample_5',
      value: 9,
    },
  ],
  chartHeight: 500,
};

export interface CardPieChartProps {
  cardConfig?: CardConfig;
}

const CardPieChart: React.FunctionComponent<CardPieChartProps> = (props): JSX.Element => {
  const { t } = useTranslation();

  const {
    cardConfig = DEFAULT_DATA,
  } = props;

  let { title, chartData, chartHeight } = cardConfig;

  if (Array.isArray(chartData)) {
    for (let i = 0, n = chartData.length; i < n; ++i) {
      const item = chartData[i];
      chartData[i] = Object.assign({}, item, {
        type: typeof item.type === 'string' ? t(item.type) : item.type,
        title: typeof item.title === 'string' ? t(item.title) : item.title,
      });
    }
  }

  const [type, setType] = useState('one');
  const changeType = (e: RadioChangeEvent) => {
    setType(e.target.value);
  };

  return (
    <Card title={typeof title === 'string' ? t(title) : title}>
      <Radio.Group
        value={type}
        onChange={changeType}
        className={styles.radioGroup}
        optionType="button"
      >
        <Radio value="one" className={styles.radioFlex}>
          {t('chart.pie.category_1')}
        </Radio>
        <Radio value="two" className={styles.radioFlex}>
          {t('chart.pie.category_2')}
        </Radio>
        <Radio value="three" className={styles.radioFlex}>
          {t('chart.pie.category_3')}
        </Radio>
      </Radio.Group>
      <Pie
        data={chartData!}
        angleField="value"
        colorField="type"
        appendPadding={10}
        legend={{
          position: 'bottom',
        }}
        height={chartHeight}
        label={{
          type: 'inner',
          offset: '-50%',
          autoRotate: false,
          style: { textAlign: 'center' },
          formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
        }}
        radius={1}
        innerRadius={0.64}
        meta={{
          value: {
            formatter: (v) => `¥ ${v}`,
          },
        }}
        statistic={{
          title: {
            offsetY: -8,
          },
          content: {
            offsetY: -4,
          },
        }}
        interactions={[
          { type: 'element-selected' },
          { type: 'element-active' },
          {
            type: 'pie-statistic-active',
            cfg: {
              start: [
                { trigger: 'element:mouseenter', action: 'pie-statistic:change' },
                { trigger: 'legend-item:mouseenter', action: 'pie-statistic:change' },
              ],
              end: [
                { trigger: 'element:mouseleave', action: 'pie-statistic:reset' },
                { trigger: 'legend-item:mouseleave', action: 'pie-statistic:reset' },
              ],
            },
          },
        ]}
      />
    </Card>
  );
};

export default CardPieChart;
