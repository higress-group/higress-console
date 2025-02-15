import i18n from '@/i18n';
import { fetchPluginsByRoute, getRouteBuiltInPlugins, Route, WasmPluginData } from '@/interfaces/route';
import { getGatewayRoutesDetail, getRoutePluginInstances, getWasmPlugins } from '@/services';
import { EllipsisOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Avatar, Button, Card, Col, Dropdown, Popconfirm, Row, Typography, Tag, message } from 'antd';
import { useSearchParams } from 'ice';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BUILTIN_ROUTE_PLUGIN_LIST, DEFAULT_PLUGIN_IMG } from './constant';
import { getI18nValue } from '../../utils';

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
  const { t } = useTranslation();
  const { data, onOpen, onEdit, onDelete } = props;
  const [searchParams] = useSearchParams();

  const handleClickPlugin = (item) => {
    onOpen(item);
  };

  const [pluginList, setPluginList] = useState<WasmPluginData[]>([]);

  const { loading, run: loadWasmPlugins } = useRequest(() => {
    return getWasmPlugins(i18n.language);
  }, {
    manual: true,
    onSuccess: async (result = []) => {
      try {
        if (searchParams.get('type') === 'route') {
          const routeName = searchParams.get('name');
          if (routeName) {
            // 获取当前 route 的插件信息
            const currentRoute = await getGatewayRoutesDetail(routeName);
            if (!currentRoute) {
              message.error('No route found with the given name');
              setPluginList(BUILTIN_ROUTE_PLUGIN_LIST.concat(result) as any); // 设置默认插件列表
              return;
            }

            const plugins = await fetchPluginsByRoute(currentRoute);
            const builtInPlugins: WasmPluginData[] = BUILTIN_ROUTE_PLUGIN_LIST.map((plugin) => {
              const foundPlugin = plugins.find((p) => p.name === plugin.key);
              return {
                ...plugin,
                name: plugin.key,
                description: plugin.description,
                builtIn: true,
                enabled: foundPlugin ? foundPlugin.enabled : false,
              };
            });

            const updatedPlugins = result.map((plugin: { name: string; enabled: any }) => {
              const foundPlugin = plugins.find((p) => p.name === plugin.name);
              return {
                ...plugin,
                enabled: foundPlugin ? foundPlugin.enabled : plugin.enabled,
              };
            });

            setPluginList(builtInPlugins.concat(updatedPlugins) as any); // 更新插件列表
            return;
          } else {
            // 如果没有 routeName，设置默认插件列表
            setPluginList(BUILTIN_ROUTE_PLUGIN_LIST.concat(result) as any);
            return;
          }
        }

        // 默认情况下，直接设置插件列表
        setPluginList(result);
      } catch (error) {
        message.error('Failed to load plugins');
        setPluginList([]); // 出错时设置为空列表或默认值
      }
    },
  });

  useImperativeHandle(ref, () => {
    return {
      refresh: () => {
        loadWasmPlugins();
      },
    }
  });

  useEffect(() => {
    loadWasmPlugins();
  }, []);

  i18n.on('languageChanged', () => loadWasmPlugins());

  const createPluginDropdown = (plugin) => {
    if (BUILTIN_ROUTE_PLUGIN_LIST.some(p => p.key === plugin.key)) {
      return null;
    }
    const items = [
      {
        key: 'edit',
        label: (
          <span
            onClick={() => {
              onEdit?.(plugin);
            }}
          >
            {t('misc.edit')}
          </span>
        ),
      },
    ];
    if (!plugin.builtIn) {
      items.push({
        key: 'delete',
        label: (
          <Popconfirm
            title={t('plugins.deleteConfirmation')}
            onConfirm={() => {
              onDelete?.(plugin.name);
            }}
          >
            <span>{t('misc.delete')}</span>
          </Popconfirm>
        ),
        danger: true,
      });
    }
    return (
      <Dropdown
        menu={{
          items,
        }}
      >
        <EllipsisOutlined />
      </Dropdown>
    )
  };

  return (
    <Row gutter={[16, 16]}>
      {pluginList.map((item) => {
        const key = item.key || `${item.name}:${item.imageVersion}`;
        const showTag = searchParams.get('type') === 'route';
        return (
          <Col span={6} key={key} xl={6} lg={12} md={12} sm={12} xs={24}>
            <Card
              hoverable
              actions={[
                <div onClick={() => handleClickPlugin(item)}>
                  <Button type="text" size="small">
                    {t('misc.configure')}
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
                      {getI18nValue(item, 'title')}
                    </div>
                    {showTag && item.enabled && (
                      <Tag
                        color="green"
                        style={{ marginLeft: 6, fontSize: '10px', lineHeight: '16px', padding: '0 4px', borderRadius: '2px' }}
                      >{t('plugins.enabled')}
                      </Tag>
                    )}
                    {
                      createPluginDropdown(item)
                    }
                  </div>
                }
                description={
                  <Paragraph ellipsis={{ rows: 3 }} style={{ minHeight: '64px', color: '#00000073' }}>
                    {getI18nValue(item, 'description')}
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
