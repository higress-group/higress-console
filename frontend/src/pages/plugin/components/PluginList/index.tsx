import i18n from '@/i18n';
import { fetchPluginsByRoute, WasmPluginData } from '@/interfaces/route';
import { getGatewayRouteDetail, getWasmPlugins } from '@/services';
import { EllipsisOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Avatar, Button, Card, Col, Dropdown, Popconfirm, Row, Typography, Tag } from 'antd';
import { useSearchParams } from 'ice';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BUILTIN_ROUTE_PLUGIN_LIST, DEFAULT_PLUGIN_IMG } from './constant';
import { getI18nValue, QueryType } from '../../utils';

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

  const type = searchParams.get('type') || '';

  const HIDDEN_PLUGINS_BY_QUERY_TYPE = {};
  HIDDEN_PLUGINS_BY_QUERY_TYPE[QueryType.AI_ROUTE] = ['ai-proxy', 'key-auth', 'model-router', 'model-mapper'];

  const handleClickPlugin = (item) => {
    onOpen(item);
  };

  const [pluginList, setPluginList] = useState<WasmPluginData[]>([]);

  const { loading, run: loadWasmPlugins } = useRequest(() => {
    return getWasmPlugins(i18n.language);
  }, {
    manual: true,
    onSuccess: async (result = []) => {
      let plugins = result || [];
      const hiddenPlugins = HIDDEN_PLUGINS_BY_QUERY_TYPE[type];
      if (Array.isArray(hiddenPlugins)) {
        plugins = plugins.filter(p => p.builtIn && hiddenPlugins.indexOf(p.name) === -1);
      }
      if (type === QueryType.ROUTE) {
        const routeName = searchParams.get('name');
        if (routeName) {
          const currentRoute = await getGatewayRouteDetail(routeName);
          if (!currentRoute) {
            plugins = BUILTIN_ROUTE_PLUGIN_LIST.concat(plugins);
            setPluginList(plugins);
            return
          }

          const pluginByRoutes = await fetchPluginsByRoute(currentRoute);
          const builtInPlugins: WasmPluginData[] = BUILTIN_ROUTE_PLUGIN_LIST.map((plugin) => {
            const foundPlugin = pluginByRoutes.find((p) => p.name === plugin.key && p.internal);
            return {
              ...plugin,
              name: plugin.key,
              enabled: foundPlugin ? foundPlugin.enabled : false,
            };
          });
          const updatedPlugins = result.map((plugin: { name: string }) => {
            const foundPlugin = pluginByRoutes.find((p) => p.name === plugin.name);
            return {
              ...plugin,
              enabled: foundPlugin ? foundPlugin.enabled : false,
            };
          });
          plugins = builtInPlugins.concat(updatedPlugins)
        }
      }
      setPluginList(plugins);
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
        const showTag = type === QueryType.ROUTE;
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
