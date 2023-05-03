import { message, Spin } from 'antd';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Cors from '../Cors';
import HeaderModify from '../HeaderModify';
import Retries from '../Retries';
import Rewrite from '../Rewrite';

import { updateRouteConfig } from '@/services';
import { useRequest } from 'ahooks';

const PLUGIN_COMP_MAP = {
  rewrite: (props) => <Rewrite {...props} />,
  headerModify: (props) => <HeaderModify {...props} />,
  cors: (props) => <Cors {...props} />,
  retries: (props) => <Retries {...props} />,
};

interface IRouterDetail {
  name: string;
}

interface Props {
  data: object;
  routerDetail: IRouterDetail;
  onSuccess?: () => void;
}

const RoutePluginDetail = forwardRef((props: Props, ref) => {
  const { onSuccess, data, routerDetail } = props;
  const { t } = useTranslation();

  const formRef = useRef<{ submit: () => {} }>(null);

  const { loading, run } = useRequest(updateRouteConfig, {
    manual: true,
    onSuccess: () => {
      onSuccess?.();
      message.success(t('plugins.saveSuccess'));
    },
  });

  useImperativeHandle(ref, () => ({
    submit: async () => {
      const submitForm = formRef.current?.submit;
      if (submitForm) {
        const submitData = await submitForm();
        submitData &&
          run(routerDetail?.name, {
            ...routerDetail,
            ...submitData,
          });
      }
    },
  }));

  return <Spin spinning={loading}>{PLUGIN_COMP_MAP?.[data.key]?.({ t, data: routerDetail, ref: formRef })}</Spin>;
});

export default RoutePluginDetail;
