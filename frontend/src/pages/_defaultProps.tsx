import {
  DashboardOutlined,
  DeploymentUnitOutlined,
  FullscreenExitOutlined,
  GlobalOutlined,
  UnorderedListOutlined,
  SafetyCertificateOutlined,
  WindowsOutlined,
  SettingOutlined,
} from '@ant-design/icons';

export default {
  route: {
    path: '/',
    routes: [
      {
        name: 'init.title',
        path: '/init',
        hideFromMenu: true,
        usePureLayout: true,
      },
      {
        name: 'login.title',
        path: '/login',
        hideFromMenu: true,
        usePureLayout: true,
      },
      {
        name: '',
        path: '/user',
        hideFromMenu: true,
        routes: [
          {
            name: 'user.changePassword.title',
            path: '/user/changePassword',
          },
        ],
      },
      {
        name: 'higressConfig.title',
        path: '/higress-config',
        hideFromMenu: true,
        routes: [
          {
            name: 'higressConfig.title',
            path: '/higress-config',
          },
        ],
      },
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
      {
        name: 'menu.pluginManagement',
        path: '/plugin',
        icon: <WindowsOutlined />,
      },
    ],
  },
};
