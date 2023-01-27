import { RingProgress } from '@ant-design/charts';
import { Card } from 'antd';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';
import mock from './mock';

interface CardConfig {
  title?: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  value?: string;
  chartData?: number;
  des?: string;
  rate?: string;
  chartHeight?: number;
}

const DEFAULT_DATA: CardConfig = {
  subTitle: 'chart.typebar.defaultData.subTitle',
  value: mock.value,
  chartData: mock.salePercent,
  des: 'chart.typebar.defaultData.des',
  rate: '10.1',
  chartHeight: 100,
};

export interface CardTypebarChartProps {
  cardConfig?: CardConfig;
}

const CardTypebarChart: React.FunctionComponent<CardTypebarChartProps> = (props: CardTypebarChartProps): JSX.Element => {
  const { t } = useTranslation();

  const {
    cardConfig = DEFAULT_DATA,
  } = props;

  let { title, subTitle, value, des, rate, chartHeight, chartData } = cardConfig;
  if (typeof title === 'string') {
    title = t(title) || title;
  }
  if (typeof subTitle === 'string') {
    subTitle = t(subTitle) || subTitle;
  }
  if (des) {
    des = t(des) || des;
  }

  return (
    <Card title={title}>
      <div className={styles.cardSubTitle}>{subTitle}</div>
      <div className={styles.cardValue}>{value}</div>
      <div className={styles.cardDes}>{des}<span>{rate}↑</span></div>
      <RingProgress
        percent={chartData!}
        height={chartHeight}
        width={10}
        color={['#5B8FF9', '#E8EDF3']}
        progressStyle={{ width: 30 }}
      />
    </Card>
  );
};

export default CardTypebarChart;
