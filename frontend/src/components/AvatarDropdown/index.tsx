/**
 * 用户头像下拉菜单组件
 * 显示当前用户的头像和名称，提供下拉菜单操作
 * 包括修改密码、退出登录等功能
 */

// 导入用户服务
import { logout } from '@/services';

// 导入全局状态管理
import store from '@/store';

// 导入 Ant Design 图标
import { LockOutlined, LogoutOutlined } from '@ant-design/icons';

// 导入 Ant Design 组件
import { Avatar, Dropdown } from 'antd';

// 导入 ICE 框架的路由管理
import { definePageConfig, history } from 'ice';

// 导入菜单类型定义
import type { MenuInfo } from 'rc-menu/lib/interface';

// 导入 React Hook
import React, { useCallback } from 'react';

// 导入国际化 Hook
import { useTranslation } from 'react-i18next';

// 导入组件样式
import styles from './index.module.css';

/**
 * 头像下拉菜单组件属性接口
 */
interface AvatarDropdownProps {
  name: string;   // 用户显示名称
  avatar: string; // 用户头像 URL
}

/**
 * 用户头像下拉菜单组件
 * @param name - 用户显示名称
 * @param avatar - 用户头像 URL
 * @returns 返回头像下拉菜单组件
 */
const AvatarDropdown: React.FC<AvatarDropdownProps> = ({ name, avatar }) => {
  // 获取用户状态分发器
  const [, userDispatcher] = store.useModel('user');

  // 获取国际化翻译函数
  const { t } = useTranslation();

  /**
   * 执行用户退出登录操作
   * 调用退出登录 API，清空用户状态，跳转到登录页面
   */
  const doLogout = async () => {
    // 调用退出登录服务
    await logout();
    
    // 获取当前页面路径，用于登录后重定向
    const pathname = history?.location?.pathname;
    
    // 跳转到登录页面，带上当前路径作为重定向参数
    history?.push({
      pathname: '/login',
      search: pathname ? `redirect=${pathname}` : '',
    });
  };

  /**
   * 处理退出登录菜单项点击事件
   * 清空用户状态，执行退出登录操作
   */
  const onLogoutClick = useCallback((event: MenuInfo) => {
    // 清空当前用户信息
    userDispatcher.updateCurrentUser({});
    
    // 执行退出登录
    doLogout();
  }, []);

  /**
   * 处理修改密码菜单项点击事件
   * 跳转到修改密码页面
   */
  const onChangePasswordClick = useCallback((event: MenuInfo) => {
    // 跳转到修改密码页面
    history?.push(`/user/changePassword`);
  }, []);

  /**
   * 下拉菜单配置
   * 定义菜单项、图标、点击事件等
   */
  const menu = {
    items: [
      {
        key: 'changePassword',  // 菜单项唯一标识
        label: t('user.changePassword.title'), // 菜单项文本（国际化）
        icon: <LockOutlined />, // 锁图标
        onClick: onChangePasswordClick, // 点击事件处理函数
        className: styles.menu, // 菜单项样式
      },
      {
        key: 'logout',  // 菜单项唯一标识
        label: t('misc.logout'), // 菜单项文本（国际化）
        icon: <LogoutOutlined />, // 退出图标
        onClick: onLogoutClick, // 点击事件处理函数
        className: styles.menu, // 菜单项样式
      },
    ],
  };

  return (
    <Dropdown menu={menu}>
      <span className={`${styles.action} ${styles.account}`}>
        {/* 用户头像 */}
        <Avatar
          size="small"  // 小尺寸头像
          className={styles.avatar}
          src={avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'} // 使用默认头像如果未提供
          alt="avatar"  // 头像替代文本
        />
        {/* 用户名称 */}
        <span>{name}</span>
      </span>
    </Dropdown>
  );
};

export default AvatarDropdown;
