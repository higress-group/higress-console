import logo from '@/assets/logo.png';
import type { LoginParams, LoginResult } from '@/interfaces/user';
import { fetchUserInfo, login } from '@/services';
import store from '@/store';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { Alert, message } from 'antd';
import { history, useAuth } from 'ice';
import React, { useState } from 'react';
import styles from './index.module.css';

import { useTranslation } from 'react-i18next';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const { t } = useTranslation();

  const [loginResult, setLoginResult] = useState<LoginResult>({});
  const [, userDispatcher] = store.useModel('user');
  const [, setAuth] = useAuth();

  async function updateUserInfo() {
    const userInfo = await fetchUserInfo();
    userDispatcher.updateCurrentUser(userInfo);
  }

  async function handleSubmit(values: LoginParams) {
    try {
      const result = await login(values);
      if (result.success) {
        message.success(t('login.loginSuccess'));
        setAuth({
          admin: result.userType === 'admin',
          user: result.userType === 'user',
        });
        await updateUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history?.push(urlParams.get('redirect') || '/dashboard');
        return;
      }
      console.log(result);
      // 如果失败去设置用户错误信息，显示提示信息
      setLoginResult(result);
    } catch (error) {
      message.error(t('login.loginFailed'));
      console.log(error);
    }
  }
  return (
    <div className={styles.container}>
      <LoginForm
        title=""
        logo={<img alt="logo" src={logo} />}
        subTitle=""
        onFinish={async (values) => {
          await handleSubmit(values as LoginParams);
        }}
      >
        {loginResult.success === false && (
          <LoginMessage
            content={t('login.incorrectCredentials')}
          />
        )}
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder={t('login.usernamePlaceholder')}
          rules={[
            {
              required: true,
              message: t('login.usernameRequired'),
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={t('login.passwordPlaceholder')}
          rules={[
            {
              required: true,
              message: t('login.passwordRequired'),
            },
          ]}
        />
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            {t('login.autoLogin')}
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
          >
            {t('login.forgotPassword')}
          </a>
        </div>
      </LoginForm>
    </div>
  );
};

export const getConfig = () => {
  const { t } = useTranslation();
  return {
    title: t('login.title'),
  };
};

export default Login;
