/**
 * Higress 控制台主布局组件
 * 这是应用的核心布局组件，负责整体页面结构的渲染
 * 包括侧边导航、顶部工具栏、内容区域等
 */

// 导入应用 Logo 图标
import logo from '@/assets/logo.png';

// 导入布局相关的组件
import AvatarDropdown from '@/components/AvatarDropdown';  // 用户头像下拉菜单
import ChatRobot from '@/components/ChatRobot';           // 聊天机器人组件
import Footer from '@/components/Footer';                 // 页面底部组件
import LanguageDropdown from '@/components/LanguageDropdown'; // 语言切换下拉菜单
import Navbar from '@/components/Navbar';                 // 导航栏组件

// 导入状态管理和路由相关
import store from '@/store';                              // 全局状态存储
import { Link, Outlet, useLocation } from 'ice';         // ICE 框架的路由组件
import { useTranslation } from 'react-i18next';           // 国际化 Hook

// 导入 Ant Design Pro 布局组件
import ProLayout from '@ant-design/pro-layout';
import { Route } from '@ant-design/pro-layout/es/typing';
import { Result } from 'antd';

// 导入样式和配置
import styles from './layout.module.css';
import defaultProps from './_defaultProps';

/**
 * 主布局组件
 * 负责渲染整个应用的布局结构
 * @returns 返回完整的页面布局
 */
export default function Layout() {
  // 获取用户状态
  const [userState] = store.useModel('user');
  
  // 获取配置状态
  const [configModel] = store.useModel('config');
  const configData = configModel.properties || {};
  
  // 获取当前路由位置
  const location = useLocation();
  
  // 国际化翻译函数
  const { t } = useTranslation();

  // 检查是否被嵌套在 iframe 中
  // 出于安全考虑，不允许在 iframe 中运行
  if (window.frameElement) {
    // 嵌套在同源 iframe 或 object 中，显示错误信息
    return (
      <Result
        status="500"
        title={t('error.nestedFrame.title')}    // 使用国际化显示标题
        subTitle={t('error.nestedFrame.subTitle')} // 使用国际化显示副标题
      />
    )
  }

  // 根据当前路径查找对应的路由配置
  const route = findRouteByPath(defaultProps.route, location.pathname);
  
  return (
    <ProLayout
      {...defaultProps}  // 应用默认配置
      className={styles.layout}  // 应用自定义样式
      logo={<img src={logo} alt="logo" />}  // 设置 Logo 图标
      pure={route && !!route.usePureLayout}  // 是否使用纯布局（无侧边栏）
      title=""  // 网站标题
      location={{
        pathname: location.pathname,  // 当前路径
      }}
      layout="mix"  // 使用混合布局模式
      
      // 右侧内容渲染函数
      rightContentRender={() => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Navbar />              {/* 导航菜单 */}
          <LanguageDropdown />    {/* 语言切换 */}
          <AvatarDropdown 
            avatar={userState.currentUser.avatarUrl || ''} 
            name={userState.currentUser.displayName} 
          />  {/* 用户头像和下拉菜单 */}
        </div>
      )}
      
      // 页面标题渲染函数
      pageTitleRender={(props, defaultPageTitle) => {
        return (route && route.name ? t(route.name) : defaultPageTitle) || '';
      }}
      
      // 菜单配置
      menu={{ defaultOpenAll: true }}  // 默认展开所有菜单项
      
      // 菜单数据渲染函数
      menuDataRender={(items) => {
        // 过滤菜单项函数
        function filterMenuItem(item) {
          if (item.hideFromMenu) {
            return false; // 隐藏标记为不显示的菜单项
          }
          if (typeof item.visiblePredicate === 'function') {
            return item.visiblePredicate(configData); // 使用可见性判断函数
          }
          return true; // 默认显示
        }
        
        // 翻译菜单项函数
        function translateMenuItem(item) {
          return Object.assign({}, item, {
            name: t(item.name || ''), // 翻译菜单名称
            children: item.children && item.children.filter(filterMenuItem).map(translateMenuItem) || null,
          })
        }
        
        // 过滤并翻译所有菜单项
        return items.filter(filterMenuItem).map(translateMenuItem);
      }}
      
      // 菜单项渲染函数
      menuItemRender={(item, defaultDom) => {
        if (!item.path) {
          return defaultDom; // 没有路径的菜单项不添加链接
        }
        return <Link to={item.path}>{defaultDom}</Link>; // 添加路由链接
      }}
      
      // 底部渲染函数
      footerRender={() => <Footer />}
    >
      {/* 子路由内容渲染区域 */}
      <Outlet />
      
      {/* 聊天机器人组件 */}
      <ChatRobot />
    </ProLayout>
  );
}

/**
 * 根据路径查找路由配置
 * 在嵌套的路由配置中递归查找匹配当前路径的路由
 * 
 * @param route - 路由配置对象
 * @param pathname - 当前路径
 * @returns 返回匹配的路由配置，未找到返回 undefined
 */
function findRouteByPath(route: Route, pathname?: string): Route | undefined {
  if (!route || !pathname) {
    return undefined;
  }

  // 如果当前路由路径匹配，直接返回
  if (route.path === pathname) {
    return route;
  }

  // 获取子路由
  const childRoutes = route.routes || route.children;
  if (childRoutes) {
    // 递归查找子路由
    for (const child of childRoutes) {
      const matchedRoute = findRouteByPath(child, pathname);
      if (matchedRoute) {
        return matchedRoute;
      }
    }
  }
  
  return undefined;
}
