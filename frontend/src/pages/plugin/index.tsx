import { WasmPluginData } from '@/interfaces/route';
import { createWasmPlugin, deleteWasmPlugin, getGatewayRouteDetail, updateWasmPlugin } from '@/services';
import { RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, PageHeader, Row, Spin, message } from 'antd';
import { history, useSearchParams } from 'ice';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CategoryFilter from './components/CategoryFilter';
import PluginDrawer from './components/PluginDrawer';
import PluginList, { ListRef } from './components/PluginList';
import { WasmFormRef, WasmPluginDrawer } from './components/Wasm';
import styles from './index.module.css';
import { QueryType } from './utils';

const QUERY_TYPE_2_BACK_PATH = {};
QUERY_TYPE_2_BACK_PATH[QueryType.ROUTE] = '/route';
QUERY_TYPE_2_BACK_PATH[QueryType.DOMAIN] = '/domain';
QUERY_TYPE_2_BACK_PATH[QueryType.AI_ROUTE] = '/ai/route';

export default function RouterConfig() {
  const { t } = useTranslation();

  const [routeDetail, setRouteDetail] = useState({});
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
    const path = QUERY_TYPE_2_BACK_PATH[type];
    path && history?.push(path);
  };

  const pageHeader = useMemo(() => {
    if (type) {
      return { title: t('plugins.title'), subTitle: `${t(`plugins.subTitle.${type}`)}${name}` };
    }
    return { title: '', subTitle: '' };
  }, [type, name]);

  const { loading, run: loadRouteDetail } = useRequest(getGatewayRouteDetail, {
    manual: true,
    onSuccess: (res) => {
      setRouteDetail(res || {});
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
        listRef.current?.refresh();
      });
    } else {
      createWasmPlugin(val).then(() => {
        message.success(t('plugins.addSuccess'));
        formOperatorBack();
        listRef.current?.refresh();
      });
    }
  };

  const init = () => {
    if (name && type === 'route') {
      loadRouteDetail(name)
      listRef.current?.refresh();
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
              <Col span={20}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      wasmFormRef?.current?.open();
                    }}
                    style={{ marginRight: '12px' }}
                  >
                    {t('plugins.addPlugin')}
                  </Button>
                  <div style={{ display: 'inline-block' }}>
                    <CategoryFilter
                      onChange={(categories) => {
                        setSelectedCategories(categories);
                      }}
                    />
                  </div>
                </div>
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
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
            data={routeDetail}
            ref={listRef}
            onEdit={onEdit}
            onDelete={onDelete}
            selectedCategories={selectedCategories}
          />
          <PluginDrawer pluginDrawerRef={pluginDrawerRef} routerDetail={routeDetail} onSuccess={init} />
          <WasmPluginDrawer ref={wasmFormRef} onSubmit={onSubmitWasm} />
        </PageContainer>
      </Spin>
    </div>
  );
}
