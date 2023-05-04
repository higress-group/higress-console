import { Button, Result } from 'antd';
import { history } from 'ice';
import React from 'react';

import { useTranslation } from 'react-i18next';

const NoFoundPage: React.FC = () => {
  const { t } = useTranslation();

  if (window.frameElement) {
    // Embedded in a same-origin iframe or object
    return (<Result
      status="500"
      title={t('error.nestedFrame.title')}
      subTitle={t('error.nestedFrame.subTitle')}
    />)
  }

  return (<Result
    status="404"
    title={t('error.404.title')}
    subTitle={t('error.404.subTitle')}
    extra={
      <Button type="primary" onClick={() => history?.push('/')}>
        {t('misc.return')}
      </Button>
    }
  />)
};

export default NoFoundPage;
