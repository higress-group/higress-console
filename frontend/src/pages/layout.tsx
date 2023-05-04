import logo from '@/assets/logo.png';
import AvatarDropdown from '@/components/AvatarDropdown';
import Footer from '@/components/Footer';
import LanguageDropdown from '@/components/LanguageDropdown';
import Navbar from '@/components/Navbar';
import { asideMenuConfig } from '@/menuConfig';
import store from '@/store';
import ProLayout from '@ant-design/pro-layout';
import { Result } from 'antd';
import { Link, Outlet, useLocation } from 'ice';
import { useTranslation } from 'react-i18next';
import styles from './layout.module.css';

export default function Layout() {
  const location = useLocation();
  const { t } = useTranslation();
  const [userState] = store.useModel('user');

  if (window.frameElement) {
    // Embedded in a same-origin iframe or object
    return (<Result
      status="500"
      title={t('error.nestedFrame.title')}
      subTitle={t('error.nestedFrame.subTitle')}
    />)
  }

  if (['/login'].includes(location.pathname)) {
    return <Outlet />;
  }

  return (
    <ProLayout
      menu={{ defaultOpenAll: true }}
      className={styles.layout}
      logo={<img src={logo} alt="logo" />}
      title=""
      location={{
        pathname: location.pathname,
      }}
      layout="mix"
      rightContentRender={() => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Navbar />
          <LanguageDropdown />
          <AvatarDropdown avatar={userState.currentUser.avatarUrl} name={userState.currentUser.displayName} />
        </div>
      )}
      menuDataRender={() => {
        return asideMenuConfig.map(c => Object.assign({}, c, { name: t(c.name) }))
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
    </ProLayout>
  );
}
