import logo from '@/assets/logo.png';
import AvatarDropdown from '@/components/AvatarDropdown';
import ChatRobot from '@/components/ChatRobot';
import Footer from '@/components/Footer';
import LanguageDropdown from '@/components/LanguageDropdown';
import Navbar from '@/components/Navbar';
import store from '@/store';
import ProLayout from '@ant-design/pro-layout';
import { Route } from '@ant-design/pro-layout/es/typing';
import { Result } from 'antd';
import { Link, Outlet, useLocation } from 'ice';
import { useTranslation } from 'react-i18next';
import styles from './layout.module.css';
import defaultProps from './_defaultProps';

export default function Layout() {
  const [userState] = store.useModel('user');
  const location = useLocation();
  const { t } = useTranslation();

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
        return items.filter(i => !i.hideFromMenu).map(i => Object.assign({}, i, { name: t(i.name || '') }));
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
  );
}

function findRouteByPath(route: Route, pathname?: string): Route | undefined {
  if (!route || !pathname) {
    return undefined;
  }

  if (route.path === pathname) {
    return route;
  }

  if (route.routes) {
    for (const subRoute of route.routes) {
      const matchedSubRoute = findRouteByPath(subRoute, pathname);
      if (matchedSubRoute) {
        return matchedSubRoute;
      }
    }
  }
  return undefined;
}
