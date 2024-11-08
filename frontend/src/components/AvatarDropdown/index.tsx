import { logout } from '@/services';
import store from '@/store';
import { LockOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Dropdown } from 'antd';
import { definePageConfig, history } from 'ice';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

interface AvatarDropdownProps {
  name: string;
  avatar: string;
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({ name, avatar }) => {
  const [, userDispatcher] = store.useModel('user');

  const { t } = useTranslation();

  const doLogout = async () => {
    await logout();
    const pathname = history?.location?.pathname;
    history?.push({
      pathname: '/login',
      search: pathname ? `redirect=${pathname}` : '',
    });
  };

  const onLogoutClick = useCallback((event: MenuInfo) => {
    userDispatcher.updateCurrentUser({});
    doLogout();
  }, []);

  const onChangePasswordClick = useCallback((event: MenuInfo) => {
    history?.push(`/user/changePassword`);
  }, []);

  const onHigressConfigClick = useCallback((event: MenuInfo) => {
    history?.push(`/higress-configs`);
  }, []);

  const menu = {
    items: [
      {
        key: 'changePassword',
        label: t('user.changePassword.title'),
        icon: <LockOutlined />,
        onClick: onChangePasswordClick,
        className: styles.menu,
      },
      {
        key: 'logout',
        label: t('misc.logout'),
        icon: <LogoutOutlined />,
        onClick: onLogoutClick,
        className: styles.menu,
      },
      {
        key: 'higressConfig',
        label: t('higressConfig.title'),
        icon: <SettingOutlined />,
        onClick: onHigressConfigClick,
        className: styles.menu,
      },
    ],
  };
  return (
    <Dropdown menu={menu}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'}
          alt="avatar"
        />
        <span>{name}</span>
      </span>
    </Dropdown>
  );
};

export default AvatarDropdown;
