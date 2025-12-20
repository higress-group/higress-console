import logo from '@/assets/logo.png';
import AvatarDropdown from '@/components/AvatarDropdown';
import ChatRobot from '@/components/ChatRobot';
import Footer from '@/components/Footer';
import LanguageDropdown from '@/components/LanguageDropdown';
import Navbar from '@/components/Navbar';
import store from '@/store';
import ProLayout from '@ant-design/pro-layout';
import { Route } from '@ant-design/pro-layout/es/typing';
import { ConfigProvider, Result } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import { Link, Outlet, useLocation } from 'ice';
import { useTranslation } from 'react-i18next';
import styles from './layout.module.css';
import defaultProps from './_defaultProps';

export default function Layout() {
  const [userState] = store.useModel('user');
  const [configModel] = store.useModel('config');
  const configData = configModel.properties || {};
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const antdLocale = i18n.language === 'en-US' ? enUS : zhCN;

  if (window.frameElement) {
    // Embedded in a same-origin iframe or object
    return (<Result
      status="500"
      title={t('error.nestedFrame.title')}
      subTitle={t('error.nestedFrame.subTitle')}
    />)
  }

  const route = findRouteByPath(defaultProps.route, location.pathname);
  return (
    <ConfigProvider locale={antdLocale}>
      <ProLayout
        {...defaultProps}
        className={styles.layout}
        logo={<img src={logo} alt="logo" />}
        pure={route && !!route.usePureLayout}
        title=""
        location={{
          pathname: location.pathname,
        }}
        layout="mix"
        rightContentRender={() => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Navbar />
            <LanguageDropdown />
            <AvatarDropdown avatar={userState.currentUser.avatarUrl || ''} name={userState.currentUser.displayName} />
          </div>
        )}
        pageTitleRender={(props, defaultPageTitle) => {
          return (route && route.name ? t(route.name) : defaultPageTitle) || '';
        }}
        menu={{ defaultOpenAll: true }}
        menuDataRender={(items) => {
          function filterMenuItem(item) {
            if (item.hideFromMenu) {
              return false;
            }
            if (typeof item.visiblePredicate === 'function') {
              return item.visiblePredicate(configData);
            }
            return true;
          }
          function translateMenuItem(item) {
            return Object.assign({}, item, {
              name: t(item.name || ''),
              children: item.children && item.children.filter(filterMenuItem).map(translateMenuItem) || null,
            })
          }
          return items.filter(filterMenuItem).map(translateMenuItem);
        }}
        menuItemRender={(item, defaultDom) => {
          if (!item.path) {
            return defaultDom;
          }
          return <Link to={item.path}>{defaultDom}</Link>;
        }}
        footerRender={() => <Footer />}
      >
        <Outlet />
        <ChatRobot />
      </ProLayout>
    </ConfigProvider>
  );
}

function findRouteByPath(route: Route, pathname?: string): Route | undefined {
  if (!route || !pathname) {
    return undefined;
  }

  if (route.path === pathname) {
    return route;
  }

  const childRoutes = route.routes || route.children;
  if (childRoutes) {
    for (const child of childRoutes) {
      const matchedRoute = findRouteByPath(child, pathname);
      if (matchedRoute) {
        return matchedRoute;
      }
    }
  }
  return undefined;
}
