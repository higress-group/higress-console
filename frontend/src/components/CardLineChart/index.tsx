import { TinyLine } from '@ant-design/charts';
import { Card } from 'antd';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';
import mock from './mock';

interface CardConfig {
  title?: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  value?: string;
  values?: number[];
  nums?: number[];
  des?: string;
  rate?: string;
  chartHeight?: number;
}

const DEFAULT_DATA: CardConfig = {
  subTitle: 'chart.line.defaultData.subTitle',
  value: mock.value,
  values: mock.values,
  nums: mock.nums,
  des: 'chart.line.defaultData.desc:',
  rate: '10.1',
  chartHeight: 100,
};

export interface CardLineChartProps {
  cardConfig?: CardConfig;
}

const CardLineChart: React.FunctionComponent<CardLineChartProps> = (props: CardLineChartProps): JSX.Element => {
  const { t } = useTranslation();

  const {
    cardConfig = DEFAULT_DATA,
  } = props;

  const { title, subTitle, value, values, des, rate, chartHeight } = cardConfig;

  return (
    <Card title={typeof title === 'string' ? t(title) : title}>
      <div className={styles.cardSubTitle}>{typeof subTitle === 'string' ? t(subTitle) : subTitle}</div>
      <div className={styles.cardValue}>{value}</div>
      <div className={styles.cardDes}>{des ? t(des) : des}<span>{rate}↑</span></div>
      <TinyLine
        data={values!}
        width={10}
        height={chartHeight}
        smooth
      />
    </Card>
  );
};

export default CardLineChart;
