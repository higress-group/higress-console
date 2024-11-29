import { PageContainer } from '@ant-design/pro-layout';
import { Button, Col, PageHeader, Row, Spin } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { history, useSearchParams } from 'ice';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function RouterConfig() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');

  const handleBack = () => {
    history?.push('/ai/route');
  };

  const pageHeader = useMemo(() => {
    return { title: '策略配置', subTitle: `AI 路由名称 ${name}` };
  }, [name]);

  return (
    <div >
      {!!pageHeader.title && (
        <PageHeader
          className="hi-page-container-warp"
          title={pageHeader.title}
          onBack={handleBack}
          subTitle={pageHeader.subTitle}
        />
      )}
      <Spin spinning={false}>
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
                    // wasmFormRef?.current?.open();
                  }}
                >
                  创建
                </Button>
              </Col>
              <Col span={20} style={{ textAlign: 'right' }}>
                <Button
                  icon={<RedoOutlined />}
                  onClick={() => {
                    // listRef.current?.refresh();
                  }}
                />
              </Col>
            </Row>
          </div>
        </PageContainer>
      </Spin>
    </div>
  );
}
