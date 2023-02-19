import { DashboardOutlined, DeploymentUnitOutlined, FullscreenExitOutlined, GlobalOutlined, UnorderedListOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-layout';

const asideMenuConfig: MenuDataItem[] = [
  {
    name: 'menu.dashboard',
    path: '/dashboard',
    icon: <DashboardOutlined />,
  },
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
  {
    name: 'menu.certManagement',
    path: '/tls-certificate',
    icon: <SafetyCertificateOutlined />,
  },
];

export { asideMenuConfig };

