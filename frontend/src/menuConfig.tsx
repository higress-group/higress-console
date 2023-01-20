import { GlobalOutlined, UnorderedListOutlined, FullscreenExitOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-layout';

const asideMenuConfig: MenuDataItem[] = [
  {
    name: '服务来源',
    path: '/service-source',
    icon: <FullscreenExitOutlined />,
  },
  {
    name: '服务列表',
    path: '/service',
    icon: <UnorderedListOutlined />,
  },
  {
    name: '路由配置',
    path: '/route',
    icon: <DeploymentUnitOutlined />,
  },
  {
    name: '域名管理',
    path: '/domain',
    icon: <GlobalOutlined />,
  },
];

export { asideMenuConfig };
