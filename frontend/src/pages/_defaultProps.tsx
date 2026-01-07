import {
  DashboardOutlined,
  DeploymentUnitOutlined,
  FullscreenExitOutlined,
  GlobalOutlined,
  KeyOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  UserOutlined,
  WindowsOutlined,
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
        children: [
          {
            name: 'user.changePassword.title',
            path: '/user/changePassword',
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
        name: 'menu.aiServiceManagement',
        icon: <RobotOutlined />,
        children: [
          {
            name: 'menu.llmProviderManagement',
            path: '/ai/provider',
          },
          {
            name: 'menu.aiRouteManagement',
            path: '/ai/route',
          },
          {
            name: 'menu.aiDashboard',
            path: '/ai/dashboard',
            visiblePredicate: (configData: any) => configData && configData['dashboard.builtin'],
          },
          {
            name: 'menu.mcpManagement',
            path: '/mcp/list',
            hideChildrenInMenu: true,
            children: [
              {
                name: 'menu.mcpConfigurations',
                path: '/mcp/detail',
              },
            ],
          },
        ],
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
        name: 'menu.consumerManagement',
        path: '/consumer',
        icon: <UserOutlined />,
      },
      {
        name: 'menu.apiKeyManagement',
        path: '/api-key',
        icon: <KeyOutlined />,
      },
      {
        name: 'menu.pluginManagement',
        path: '/plugin',
        icon: <WindowsOutlined />,
      },
      {
        name: 'menu.systemSettings',
        path: '/system',
        icon: <SettingOutlined />,
      },
    ],
  },
};
