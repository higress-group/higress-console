import { TinyColumn } from '@ant-design/charts';
import { Card } from 'antd';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';
import mock from './mock';

interface CardConfig {
  title?: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  value?: string;
  chartData?: number[];
  des?: string;
  rate?: number;
  chartHeight?: number;
}

const DEFAULT_DATA: CardConfig = {
  subTitle: 'chart.bar.defaultData.subTitle',
  value: mock.value,
  chartData: mock.saleList,
  des: 'chart.bar.defaultData.des',
  rate: 10.1,
  chartHeight: 100,
};

export interface CardBarChartProps {
  cardConfig?: CardConfig;
}

const CardBarChart: React.FunctionComponent<CardBarChartProps> = (props: CardBarChartProps): JSX.Element => {
  const { t } = useTranslation();

  const {
    cardConfig = DEFAULT_DATA,
  } = props;

  const { title, subTitle, value, chartData, des, rate, chartHeight } = cardConfig;

  return (
    <Card title={typeof title === 'string' ? t(title) : title}>
      <div className={styles.cardSubTitle}>{typeof subTitle === 'string' ? t(subTitle) : subTitle}</div>
      <div className={styles.cardValue}>{value}</div>
      <div className={styles.cardDes}>{typeof des === 'string' ? t(des) : des}<span>{rate}↑</span></div>
      <TinyColumn
        data={chartData!}
        width={10}
        height={chartHeight}
      />
    </Card>
  );
};

export default CardBarChart;
