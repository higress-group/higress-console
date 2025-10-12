/**
 * 默认路由配置和属性文件
 * 定义了应用的主要导航菜单结构、图标、路径等配置信息
 * 这是 Ant Design Pro 布局的核心配置文件
 */

// 导入 Ant Design 图标组件
import {
  DashboardOutlined,        // 仪表板图标
  DeploymentUnitOutlined,   // 部署单元图标
  FullscreenExitOutlined,   // 全屏退出图标
  GlobalOutlined,           // 全局图标
  RobotOutlined,            // 机器人图标
  SafetyCertificateOutlined, // 安全证书图标
  SettingOutlined,          // 设置图标
  UnorderedListOutlined,    // 无序列表图标
  UserOutlined,             // 用户图标
  WindowsOutlined,          // 窗口图标
} from '@ant-design/icons';

/**
 * 默认路由配置
 * 定义了应用的完整导航结构，包括菜单项、路径、图标等
 */
export default {
  route: {
    path: '/',  // 根路径
    routes: [
      {
        name: 'init.title',                    // 初始化页面标题（国际化键）
        path: '/init',                        // 初始化页面路径
        hideFromMenu: true,                   // 在菜单中隐藏
        usePureLayout: true,                    // 使用纯布局（无侧边栏）
      },
      {
        name: 'login.title',                   // 登录页面标题（国际化键）
        path: '/login',                       // 登录页面路径
        hideFromMenu: true,                   // 在菜单中隐藏
        usePureLayout: true,                  // 使用纯布局（无侧边栏）
      },
      {
        name: '',                              // 用户管理模块（无标题）
        path: '/user',                        // 用户管理路径
        hideFromMenu: true,                   // 在菜单中隐藏
        children: [
          {
            name: 'user.changePassword.title', // 修改密码页面标题
            path: '/user/changePassword',      // 修改密码页面路径
          },
        ],
      },
      {
        name: 'menu.dashboard',                // 仪表板菜单标题
        path: '/dashboard',                   // 仪表板路径
        icon: <DashboardOutlined />,         // 仪表板图标
      },
      {
        name: 'menu.serviceSources',           // 服务源管理菜单标题
        path: '/service-source',              // 服务源管理路径
        icon: <FullscreenExitOutlined />,     // 服务源管理图标
      },
      {
        name: 'menu.serviceList',              // 服务列表菜单标题
        path: '/service',                     // 服务列表路径
        icon: <UnorderedListOutlined />,     // 服务列表图标
      },
      {
        name: 'menu.routeConfig',              // 路由配置菜单标题
        path: '/route',                       // 路由配置路径
        icon: <DeploymentUnitOutlined />,    // 路由配置图标
      },
      {
        name: 'menu.aiServiceManagement',      // AI 服务管理菜单标题
        icon: <RobotOutlined />,             // AI 服务管理图标
        children: [
          {
            name: 'menu.llmProviderManagement', // LLM 提供商管理菜单标题
            path: '/ai/provider',             // LLM 提供商管理路径
          },
          {
            name: 'menu.aiRouteManagement',     // AI 路由管理菜单标题
            path: '/ai/route',                // AI 路由管理路径
          },
          {
            name: 'menu.aiDashboard',          // AI 仪表板菜单标题
            path: '/ai/dashboard',             // AI 仪表板路径
            visiblePredicate: (configData: any) => configData && configData['dashboard.builtin'], // 可见性条件：仅当启用内置仪表板时显示
          },
          {
            name: 'menu.mcpManagement',        // MCP 管理菜单标题
            path: '/mcp/list',                 // MCP 管理路径
            hideChildrenInMenu: true,          // 在菜单中隐藏子项
            children: [
              {
                name: 'menu.mcpConfigurations', // MCP 配置页面标题
                path: '/mcp/detail',           // MCP 配置页面路径
              },
            ],
          },
        ],
      },
      {
        name: 'menu.domainManagement',           // 域名管理菜单标题
        path: '/domain',                       // 域名管理路径
        icon: <GlobalOutlined />,            // 域名管理图标
      },
      {
        name: 'menu.certManagement',             // 证书管理菜单标题
        path: '/tls-certificate',              // 证书管理路径
        icon: <SafetyCertificateOutlined />,  // 证书管理图标
      },
      {
        name: 'menu.consumerManagement',       // 消费者管理菜单标题
        path: '/consumer',                    // 消费者管理路径
        icon: <UserOutlined />,               // 消费者管理图标
      },
      {
        name: 'menu.pluginManagement',         // 插件管理菜单标题
        path: '/plugin',                      // 插件管理路径
        icon: <WindowsOutlined />,           // 插件管理图标
      },
      {
        name: 'menu.systemSettings',           // 系统设置菜单标题
        path: '/system',                      // 系统设置路径
        icon: <SettingOutlined />,           // 系统设置图标
      },
    ],
  },
};
