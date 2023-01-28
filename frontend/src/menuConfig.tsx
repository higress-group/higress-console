import { GlobalOutlined, UnorderedListOutlined, FullscreenExitOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-layout';

const asideMenuConfig: MenuDataItem[] = [
  {
    name: 'menu.serviceSources',
    path: '/service-source',
    icon: <FullscreenExitOutlined />,
  },
  {
    name: 'menu.serviceList',
    path: '/service',
    icon: <UnorderedListOutlined />,
  },
  {
    name: 'menu.routeConfig',
    path: '/route',
    icon: <DeploymentUnitOutlined />,
  },
  {
    name: 'menu.domainManagement',
    path: '/domain',
    icon: <GlobalOutlined />,
  },
];

export { asideMenuConfig };
