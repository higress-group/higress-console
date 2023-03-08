import { Card, Col, Divider, Row } from 'antd';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

interface DataItem {
  name?: string;
  rate?: string;
  color?: string;
}

interface CardConfig {
  title?: string;
  dataSource?: DataItem[];
}

export interface CardRankChartProps {
  cardConfig?: CardConfig;
}

const DEFAULT_DATA: CardConfig = {
  title: 'chart.rank.defaultData.title',
  dataSource: [
    { name: 'chart.rank.defaultData.asia', rate: '40%', color: '#2B7FFB' },
    { name: 'chart.rank.defaultData.europe', rate: '30%', color: '#00D6CB' },
    { name: 'chart.rank.defaultData.africa', rate: '20%', color: '#F0C330' },
    { name: 'chart.rank.defaultData.america', rate: '10%', color: '#3840D9' },
  ],
};

const CardRankChart: React.FunctionComponent<CardRankChartProps> = (props: CardRankChartProps): JSX.Element => {
  const { t } = useTranslation();

  const { cardConfig = DEFAULT_DATA } = props;
  let { title, dataSource } = cardConfig;
  if (typeof title === 'string') {
    title = t(title) || title;
  }
  if (Array.isArray(dataSource)) {
    for (let i = 0, n = dataSource.length; i < n; ++i) {
      const item = dataSource[i];
      dataSource[i] = Object.assign({}, item, {
        name: typeof item.name === 'string' ? t(item.name) : item.name,
      });
    }
  }

  return (
    <Card title={title}>
      <Row>
        <Col span={12}>
          <div className={styles.hisMap} />
        </Col>
        <Col span={6}>
          <div className={styles.histogram}>
            {dataSource &&
              dataSource.map((item, idx) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={idx}
                  style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}
                >
                  <div className={styles.hisTitle}>{item.name}</div>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <div style={{ backgroundColor: item.color, width: item.rate }} />
                    <div className={styles.hisRate}>{item.rate}</div>
                  </div>
                </div>
              ))}
          </div>
        </Col>
        <Col span={6}>
          <div className={styles.subCard}>
            <Divider type="vertical" className={styles.subDiv} />
            <div className={styles.subBody}>
              <div className={styles.subName}>{t('chart.rank.defaultData.asia')}</div>
              <Divider type="horizontal" />
              <div
                className={styles.subMain}
              >
                <div>
                  <div className={styles.subTypeName}>{t('chart.rank.defaultData.category_1')}</div>
                  <div className={styles.subTypeValue}>6,123</div>
                </div>
                <Divider type="vertical" className={styles.subMainDiv} />
                <div>
                  <div className={styles.subTypeName}>{t('chart.rank.defaultData.category_2')}</div>
                  <div className={styles.subTypeValue}>1,324</div>
                </div>
              </div>
              <div className={styles.subFooter}>
                <div>{t('chart.rank.defaultData.des')}</div>
                <div>45%↑</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

    </Card>
  );
};

export default CardRankChart;
