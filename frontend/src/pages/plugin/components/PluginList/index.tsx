import { Col, Row, Button, Card, Tooltip, Popconfirm, Dropdown, Avatar, Typography, message } from 'antd';
import { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { DEFAULT_PLUGIN_IMG, DEFAULT_PLUGIN_LIST } from './constant';
import { EllipsisOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { WasmPluginData } from '@/interfaces/route';
import { getWasmPlugins } from '@/services';
import { useSearchParams } from 'ice';

const { Paragraph } = Typography;
const { Meta } = Card;

interface Props {
  data: Object;
  onOpen: (v: Object) => void;
  onEdit?: (v: WasmPluginData) => void;
  onDelete?: (v: string) => void;
}

export interface ListRef {
  refresh: () => void;
}

const PluginList = forwardRef((props: Props, ref) => {
  const { data, onOpen, onEdit, onDelete } = props;
  const [searchParams] = useSearchParams();

  const type = searchParams.get('type');

  const isShowDefaultPlugin = useMemo(() => {
    return type === 'route';
  }, [type]);

  const handleClickPlugin = (item) => {
    onOpen(item);
  };

  const [pluginList, setPluginList] = useState<WasmPluginData[]>([]);

  const { loading, run, refresh } = useRequest(getWasmPlugins, {
    manual: true,
    onSuccess: (result = []) => {
      if (isShowDefaultPlugin) {
        setPluginList(DEFAULT_PLUGIN_LIST.concat(result) as any);
        return;
      }
      setPluginList(result);
    },
  });

  useImperativeHandle(ref, () => ({
    refresh: () => {
      refresh();
    },
  }));

  useEffect(() => {
    run();
  }, []);

  return (
    <Row gutter={[16, 16]}>
      {pluginList.map((item) => {
        return (
          <Col span={6} key={item.title} xl={6} lg={12} md={12} sm={12} xs={24}>
            <Card
              hoverable
              actions={[
                <div onClick={() => handleClickPlugin(item)}>
                  <Button type="text" size="small">
                    配置
                  </Button>
                </div>,
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
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </div>
                    {item.builtIn === false ? (
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: 'edit',
                              label: (
                                <span
                                  onClick={() => {
                                    onEdit?.(item);
                                  }}
                                >
                                  编辑
                                </span>
                              ),
                            },
                            {
                              key: 'delete',
                              label: (
                                <Popconfirm
                                  title={'是否确认删除？'}
                                  onConfirm={() => {
                                    onDelete?.(item.name);
                                  }}
                                >
                                  <span>删除</span>
                                </Popconfirm>
                              ),
                              danger: true,
                            },
                          ],
                        }}
                      >
                        <EllipsisOutlined />
                      </Dropdown>
                    ) : undefined}
                  </div>
                }
                description={
                  <Paragraph ellipsis={{ rows: 3 }} style={{ minHeight: '64px', color: '#00000073 ' }}>
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
});

export default PluginList;
