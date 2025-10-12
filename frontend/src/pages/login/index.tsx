/**
 * Higress 控制台登录页面组件
 * 提供用户登录功能，包括用户名密码输入、系统初始化检查、多语言支持等
 * 支持登录提示配置和登录后的页面重定向
 */

// 导入应用 Logo
import logo from '@/assets/logo.png';

// 导入语言切换组件
import LanguageDropdown from '@/components/LanguageDropdown';

// 导入配置相关的常量
import { LOGIN_PROMPT, SYSTEM_INITIALIZED } from '@/interfaces/config';

// 导入用户相关的类型定义
import type { LoginParams, UserInfo } from '@/interfaces/user';

// 导入用户服务
import { login } from '@/services';

// 导入全局状态管理
import store from '@/store';

// 导入 Ant Design 图标
import { LockOutlined, UserOutlined } from '@ant-design/icons';

// 导入 Ant Design Pro 的表单组件
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';

// 导入 Ant Design 组件
import { Alert, message } from 'antd';

// 导入 ICE 框架的路由和认证相关 Hook
import { history, useAuth, useNavigate } from 'ice';

// 导入 React Hook
import React, { useEffect, useState } from 'react';

// 导入国际化 Hook
import { useTranslation } from 'react-i18next';

// 导入样式文件
import styles from './index.module.css';

/**
 * 登录页面组件
 * 提供完整的用户登录功能
 */
const Login: React.FC = () => {
  // 获取国际化翻译函数
  const { t } = useTranslation();

  // 登录提示信息状态
  const [loginPrompt, setLoginPrompt] = useState<string>();
  
  // 用户状态分发器
  const [, userDispatcher] = store.useModel('user');
  
  // 配置模型状态
  const [configModel] = store.useModel('config');
  
  // 认证状态设置函数
  const [, setAuth] = useAuth();
  
  // 页面导航函数
  const navigate = useNavigate();

  /**
   * 组件挂载时的副作用处理
   * 检查系统初始化状态，获取登录提示信息
   */
  useEffect(() => {
    // 获取配置属性
    const properties = configModel ? configModel.properties : {};
    
    // 检查系统是否已初始化
    if (!properties[SYSTEM_INITIALIZED]) {
      // 如果系统未初始化，跳转到初始化页面
      navigate('/init', { replace: true });
      return;
    }
    
    // 设置登录提示信息
    setLoginPrompt(properties[LOGIN_PROMPT]);
  }, [configModel]);

  /**
   * 更新用户信息
   * 将登录成功的用户信息保存到全局状态中
   * 
   * @param user - 用户信息对象
   */
  async function updateUserInfo(user: UserInfo) {
    userDispatcher.updateCurrentUser(user);
  }

  /**
   * 处理登录表单提交
   * 执行用户认证逻辑，处理登录成功和失败的情况
   * 
   * @param values - 登录表单数据
   */
  async function handleSubmit(values: LoginParams) {
    try {
      // 调用登录 API
      const user = await login(values);
      
      // 目前只支持管理员角色
      user.type = 'admin';
      
      // 显示登录成功消息
      message.success(t('login.loginSuccess'));
      
      // 设置用户认证状态
      setAuth({
        admin: user.type === 'admin',  // 设置为管理员权限
        user: user.type === 'user',    // 设置为普通用户权限
      });
      
      // 更新用户信息到全局状态
      await updateUserInfo(user);
      
      // 处理登录后的重定向
      const urlParams = new URL(window.location.href).searchParams;
      let redirectUrl = urlParams.get('redirect');  // 获取重定向参数
      
      // 如果没有重定向地址或重定向到登录页，则跳转到首页
      if (!redirectUrl || redirectUrl === '/login') {
        redirectUrl = '/';
      }
      
      // 执行页面跳转
      history?.push(redirectUrl);
      return;
    } catch (error) {
      // 登录失败，显示错误消息
      message.error(t('login.loginFailed'));
    }
  }

  return (
    <div className={styles.container}>
      {/* 语言切换下拉菜单 */}
      <div className={styles['language-dropdown']}>
        <LanguageDropdown />
      </div>
      
      {/* 登录表单 */}
      <LoginForm
        title=""  // 不显示标题
        logo={<img alt="logo" src={logo} />}  // 显示 Logo
        subTitle=""  // 不显示副标题
        onFinish={async (values) => {
          // 表单提交处理
          await handleSubmit(values as LoginParams);
        }}
        submitter={
          {
            searchConfig: {
              submitText: t('login.buttonText'),  // 登录按钮文本
            },
          }
        }
      >
        {/* 用户名输入框 */}
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',  // 大尺寸输入框
            prefix: <UserOutlined className={'prefixIcon'} />,  // 用户图标
          }}
          placeholder={t('login.usernamePlaceholder')}  // 用户名占位符文本
          rules={[
            {
              required: true,  // 必填验证
              message: t('login.usernameRequired'),  // 验证失败提示
            },
          ]}
        />
        
        {/* 密码输入框 */}
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',  // 大尺寸输入框
            prefix: <LockOutlined className={'prefixIcon'} />,  // 锁图标
          }}
          placeholder={t('login.passwordPlaceholder')}  // 密码占位符文本
          rules={[
            {
              required: true,  // 必填验证
              message: t('login.passwordRequired'),  // 验证失败提示
            },
          ]}
        />
        
        {/* 登录提示信息 */}
        {loginPrompt && (
          <div
            style={{
              marginBottom: 24,  // 底部间距
              textAlign: 'center',  // 文本居中
              whiteSpace: 'pre-wrap',  // 保留换行符
            }}
          >
            {loginPrompt}
          </div>
        )}
        
        {/* 自动登录和忘记密码链接 */}
        <div
          style={{
            marginBottom: 24,  // 底部间距
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            {t('login.autoLogin')}  {/* 自动登录复选框 */}
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',  // 右对齐
            }}
          >
            {t('login.forgotPassword')}  {/* 忘记密码链接 */}
          </a>
        </div>
      </LoginForm>
    </div>
  );
};

export default Login;
