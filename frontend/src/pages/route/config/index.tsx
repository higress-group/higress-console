import { PageContainer } from '@ant-design/pro-layout';
import { PageHeader, Spin, Row, Col, Button, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { history, useSearchParams } from 'ice';
import { RedoOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import PluginList, { ListRef } from './components/PluginList';
import PluginDrawer from './components/PluginDrawer';
import { WasmPluginData } from '@/interfaces/route';
import { WasmPluginDrawer, WasmFormRef } from './components/Wasm';
import { getGatewayRoutesDetail, createWasmPlugin, updateWasmPlugin, deleteWasmPlugin } from '@/services';
import styles from './index.module.css';

export default function RouterConfig() {
  const [routerDetail, setRouterDetail] = useState({});
  const [searchParams] = useSearchParams();

  const wasmFormRef = useRef<WasmFormRef>();
  const listRef = useRef<ListRef>();
  let pluginDrawerRef = useRef({
    onOpen: (_key) => {},
  });
  const name = searchParams.get('name');

  const handleClickPlugin = (activeItem: Object) => {
    pluginDrawerRef?.current?.onOpen(activeItem);
  };

  const handleBack = () => {
    history?.push('/route');
  };

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
      message.success('删除成功');
      formOperatorBack();
    });
  };

  const onSubmitWasm = (val: WasmPluginData, isEdit: boolean) => {
    if (isEdit) {
      updateWasmPlugin(val.name, val).then(() => {
        message.success('修改成功');
        formOperatorBack();
      });
    } else {
      createWasmPlugin(val).then(() => {
        message.success('添加成功');
        formOperatorBack();
      });
    }
  };

  const init = () => {
    name && run(name);
  };

  useEffect(() => {
    init();
  }, [name]);

  return (
    <div className={styles.routeConfig}>
      <PageHeader className="hi-page-container-warp" title="策略配置" onBack={handleBack} subTitle="" />

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
                  创建
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
