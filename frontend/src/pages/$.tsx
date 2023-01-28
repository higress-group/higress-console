import { Button, Result } from 'antd';
import { history } from 'ice';
import React from 'react';

import { useTranslation } from 'react-i18next';

const NoFoundPage: React.FC = () => {
  const { t } = useTranslation();
  return <Result
    status="404"
    title={t('error.404.title')}
    subTitle={t('error.404.subTitle')}
    extra={
      <Button type="primary" onClick={() => history?.push('/dashboard')}>
        {t('misc.return')}
      </Button>
    }
  />
};

export default NoFoundPage;
