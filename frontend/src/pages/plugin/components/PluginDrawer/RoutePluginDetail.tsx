import { message, Spin } from 'antd';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Cors from '../Cors';
import HeaderModify from '../HeaderModify';
import Retries from '../Retries';
import Rewrite from '../Rewrite';

import { updateRouteConfig, updateAiRoute as updateAiRouteConfig } from '@/services';
import { useRequest } from 'ahooks';
import { AiRoute } from '@/interfaces/ai-route';

const PLUGIN_COMP_MAP = {
  rewrite: (props) => <Rewrite {...props} />,
  headerModify: (props) => <HeaderModify {...props} />,
  cors: (props) => <Cors {...props} />,
  retries: (props) => <Retries {...props} />,
};

interface IRouteDetail {
  name: string;
}

interface Props {
  data: object;
  routeDetail: IRouteDetail;
  aiRouteDetail: IRouteDetail;
  onSuccess?: () => void;
}

const RoutePluginDetail = forwardRef((props: Props, ref) => {
  const { onSuccess, data, routeDetail, aiRouteDetail } = props;
  const { t } = useTranslation();

  const formRef = useRef<{ submit: () => {} }>(null);

  const onUpdateSuccess = () => {
    onSuccess?.();
    message.success(t('plugins.saveSuccess'));
  };

  const { loading: updatingRoute, run: updateRoute } = useRequest(updateRouteConfig, {
    manual: true,
    onSuccess: onUpdateSuccess,
  });

  const { loading: updatingAiRoute, run: updateAiRoute } = useRequest(updateAiRouteConfig, {
    manual: true,
    onSuccess: onUpdateSuccess,
  });

  useImperativeHandle(ref, () => ({
    submit: async () => {
      const submitForm = formRef.current?.submit;
      if (!submitForm) {
        return;
      }
      const submitData = await submitForm();
      if (!submitData) {
        return;
      }
      if (routeDetail) {
        updateRoute(routeDetail?.name, {
          ...routeDetail,
          ...submitData,
        });
      } else if (aiRouteDetail) {
        updateAiRoute({
          ...aiRouteDetail,
          ...submitData,
        });
      }
    },
  }));

  const detail = routeDetail || aiRouteDetail;
  return <Spin spinning={updatingAiRoute || updatingRoute}>{PLUGIN_COMP_MAP?.[data.key]?.({ t, data: detail, ref: formRef })}</Spin>;
});

export default RoutePluginDetail;
