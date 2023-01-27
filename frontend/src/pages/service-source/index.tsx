import { Card, Result } from 'antd';
import { useTranslation } from 'react-i18next';

export default function SourcePage() {
  const { t } = useTranslation();
  return (
    <Card bordered={false}>
      <Result
        status="403"
        title=""
        subTitle={t('misc.tbd')}
      />
    </Card>
  );
}
