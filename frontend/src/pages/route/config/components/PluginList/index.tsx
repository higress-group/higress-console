import { Col, Row, Button, Card, Tooltip, Popconfirm, Dropdown, Avatar, Typography, message } from 'antd';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DEFAULT_PLUGIN_IMG, DEFAULT_PLUGIN_LIST } from './constant';
import { EllipsisOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { WasmPluginData } from '@/interfaces/route';
import { getWasmPlugins } from '@/services';

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

  const handleClickPlugin = (item) => {
    onOpen(item);
  };

  const [pluginList, setPluginList] = useState<WasmPluginData[]>(DEFAULT_PLUGIN_LIST);

  const { loading, run, refresh } = useRequest(getWasmPlugins, {
    manual: true,
    onSuccess: (result = []) => {
      setPluginList(DEFAULT_PLUGIN_LIST.concat(result) as any);
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
                !['rewrite', 'cors', 'headerModify', 'retries'].includes(item?.key || '') ? (
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
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* <Tooltip title={item.name}> */}
                    <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </div>
                    {/* </Tooltip> */}
                    {item.category === 'custom' ? (
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
});

export default PluginList;
