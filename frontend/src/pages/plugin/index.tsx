import { WasmPluginData } from '@/interfaces/route';
import { createWasmPlugin, deleteWasmPlugin, getGatewayRoutesDetail, updateWasmPlugin } from '@/services';
import { RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, PageHeader, Row, Spin, message } from 'antd';
import { history, useSearchParams } from 'ice';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PluginDrawer from './components/PluginDrawer';
import PluginList, { ListRef } from './components/PluginList';
import { WasmFormRef, WasmPluginDrawer } from './components/Wasm';
import styles from './index.module.css';

export default function RouterConfig() {
  const { t } = useTranslation();

  const [routerDetail, setRouterDetail] = useState({});
  const [searchParams] = useSearchParams();

  const wasmFormRef = useRef<WasmFormRef>();
  const listRef = useRef<ListRef>();
  let pluginDrawerRef = useRef({
    onOpen: (_key) => { },
  });
  const name = searchParams.get('name');
  const type = searchParams.get('type') || '';

  const handleClickPlugin = (activeItem: Object) => {
    pluginDrawerRef?.current?.onOpen(activeItem);
  };

  const handleBack = () => {
    if (type === 'route') history?.push('/route');
    if (type === 'domain') history?.push('/domain');
  };

  const pageHeader = useMemo(() => {
    if (type === 'domain') return { title: t('plugins.title'), subTitle: `${t('plugins.subTitle.domain')}${name}` };
    if (type === 'route') return { title: t('plugins.title'), subTitle: `${t('plugins.subTitle.route')}${name}` };
    return { title: '', subTitle: '' };
  }, [type, name]);

  const { loading, run, refresh } = useRequest(getGatewayRoutesDetail, {
    manual: true,
    onSuccess: (res) => {
      setRouterDetail(res || {});
    },
  });

  const onEdit = (v: WasmPluginData) => {
    wasmFormRef.current?.open(v);
  };

  const formOperatorBack = () => {
    wasmFormRef.current?.close();
    listRef.current?.refresh();
  };

  const onDelete = (v: string) => {
    deleteWasmPlugin(v).then(() => {
      message.success(t('plugins.deleteSuccess'));
      formOperatorBack();
    });
  };

  const onSubmitWasm = (val: WasmPluginData, isEdit: boolean) => {
    if (isEdit) {
      updateWasmPlugin(val.name, val).then(() => {
        message.success(t('plugins.updateSuccess'));
        formOperatorBack();
      });
    } else {
      createWasmPlugin(val).then(() => {
        message.success(t('plugins.addSuccess'));
        formOperatorBack();
      });
    }
  };

  const init = () => {
    if (name && type === 'route') {
      run(name);
    }
  };

  useEffect(() => {
    init();
  }, [name]);

  return (
    <div className={styles.routeConfig}>
      {!!pageHeader.title && (
        <PageHeader
          className="hi-page-container-warp"
          title={pageHeader.title}
          onBack={handleBack}
          subTitle={pageHeader.subTitle}
        />
      )}
      <Spin spinning={loading}>
        <PageContainer>
          <div
            style={{
              background: '#fff',
              height: 64,
              paddingTop: 16,
              marginBottom: 16,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            <Row gutter={24}>
              <Col span={4}>
                <Button
                  type="primary"
                  onClick={() => {
                    wasmFormRef?.current?.open();
                  }}
                >
                  {t('plugins.addPlugin')}
                </Button>
              </Col>
              <Col span={20} style={{ textAlign: 'right' }}>
                <Button
                  icon={<RedoOutlined />}
                  onClick={() => {
                    listRef.current?.refresh();
                  }}
                />
              </Col>
            </Row>
          </div>
          <PluginList
            onOpen={handleClickPlugin}
            data={routerDetail}
            ref={listRef}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <PluginDrawer pluginDrawerRef={pluginDrawerRef} routerDetail={routerDetail} onSuccess={init} />
          <WasmPluginDrawer ref={wasmFormRef} onSubmit={onSubmitWasm} />
        </PageContainer>
      </Spin>
    </div>
  );
}
