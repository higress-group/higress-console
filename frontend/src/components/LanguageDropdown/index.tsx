import i18n, { lngs } from '@/i18n';
import { CheckOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import styles from './index.module.css';
import { useTranslation } from 'react-i18next';

interface LanguageDropdownProps {
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = () => {
  const { t } = useTranslation();

  const onMenuClick = useCallback((event: MenuInfo) => {
    const { key } = event;
    if (key) {
      i18n.changeLanguage(key);
      localStorage.setItem('i18nextLng', key);
    }
  }, []);

  const currentLanguge = i18n.language;
  const menu = {
    items: lngs.map(lng => {
      return {
        key: lng.code, label: lng.nativeName, icon: currentLanguge === lng.code ? <CheckOutlined /> : <span/>, onClick: onMenuClick, className: styles.menu,
      }
    },
    )
  };
  return (
    <Dropdown menu={menu}>
      <span className={`${styles.action} ${styles.account}`}>
        {t('misc.language')}
      </span>
    </Dropdown>
  );
};

export default LanguageDropdown;
