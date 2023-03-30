import { Col, Row, Button, Card, Avatar, Typography, message } from 'antd';
import { useState, useEffect } from 'react';
import { DEFAULT_PLUGIN_IMG, DEFAULT_PLUGIN_LIST } from './constant';
import { useRequest } from 'ahooks';
import { getWasmPlugins } from '@/services';

const { Paragraph } = Typography;
const { Meta } = Card;

export default function PluginList(props) {
  const { data, onOpen } = props;

  const handleClickPlugin = (item) => {
    onOpen(item);
  };

  const [pluginList, setPluginList] = useState(DEFAULT_PLUGIN_LIST);

  const { loading, run } = useRequest(getWasmPlugins, {
    manual: true,
    onSuccess: (result = []) => {
      setPluginList(DEFAULT_PLUGIN_LIST.concat(result) as any);
    },
  });

  useEffect(() => {
    run();
  }, []);

  const getPluginStatus = (key) => {
    const item = data?.[key];
    if (item) {
      return item?.enabled;
    }
    return false;
  };

  return (
    <Row gutter={[16, 16]}>
      {pluginList.map((item) => {
        return (
          <Col span={6} key={item.name} xs={24} sm={12} md={12} lg={6}>
            <Card
              hoverable
              actions={[
                !['rewrite', 'cors', 'headerModify', 'retries'].includes(item?.key) ? (
                  '正在开发中，暂不支持该插件'
                ) : (
                  <div onClick={() => handleClickPlugin(item)}>
                    <Button type="text" size="small">
                      {getPluginStatus(item.resKey) ? '查看' : '开启'}
                    </Button>
                  </div>
                ),
              ]}
            >
              <Meta
                avatar={
                  <Avatar
                    size={'large'}
                    src={item?.icon || DEFAULT_PLUGIN_IMG}
                    style={{
                      opacity: item?.icon ? '0.5' : '0.2',
                      border: '1px solid #ddd',
                      padding: '8px',
                    }}
                  />
                }
                title={item.name}
                description={
                  <Paragraph ellipsis={{ rows: 3 }} style={{ minHeight: '64px' }}>
                    {item?.description}
                  </Paragraph>
                }
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
