import { Card, Result } from 'antd';
import { definePageConfig } from 'ice';
import { useTranslation } from 'react-i18next';

export default function SourcePage() {
  const { t } = useTranslation();
  return (
    <div>
      <Card bordered={false}>
        <Result
          status="403"
          title=""
          subTitle={t('misc.tbd')}
        />
      </Card>
    </div>
  );
}

export const pageConfig = definePageConfig(() => {
  return {
    title: 'Higress Console'
  };
});
