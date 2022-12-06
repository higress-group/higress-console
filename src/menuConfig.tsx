import { TableOutlined, WarningOutlined, FormOutlined, DashboardOutlined } from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-layout';

const asideMenuConfig: MenuDataItem[] = [
  {
    name: '工作台',
    path: '/',
    icon: <DashboardOutlined />,
  },
  {
    name: '服务来源',
    path: '/service-source',
    icon: <FormOutlined />,
  },
  {
    name: '服务列表',
    path: '/service-list',
    icon: <TableOutlined />,
  },
  {
    name: '路由配置',
    path: '/router',
    icon: <TableOutlined />,
  },
  {
    name: '域名管理',
    path: '/domain',
    icon: <TableOutlined />,
  },
  {
    name: '结果&异常',
    icon: <WarningOutlined />,
    children: [
      {
        name: '成功',
        path: '/success',
      },
      {
        name: '404',
        path: '/404',
      },
    ],
  },
];

export { asideMenuConfig };
