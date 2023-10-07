import logo from '@/assets/logo.png';
import LanguageDropdown from '@/components/LanguageDropdown';
import { LOGIN_PROMPT } from '@/interfaces/config';
import type { LoginParams, UserInfo } from '@/interfaces/user';
import { login } from '@/services';
import store from '@/store';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { Alert, message } from 'antd';
import { history, useAuth } from 'ice';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

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

  const [loginPrompt, setLoginPrompt] = useState<string>();
  const [, userDispatcher] = store.useModel('user');
  const [configModel] = store.useModel('config');
  const [, setAuth] = useAuth();

  useEffect(() => {
    const properties = configModel ? configModel.properties : {};
    setLoginPrompt(properties[LOGIN_PROMPT]);
  }, [configModel]);

  async function updateUserInfo(user: UserInfo) {
    userDispatcher.updateCurrentUser(user);
  }

  async function handleSubmit(values: LoginParams) {
    try {
      const user = await login(values);
      // eslint-disable-next-line no-console
      console.log(user);
      // We only support admin role at the moment.
      user.type = 'admin';
      message.success(t('login.loginSuccess'));
      setAuth({
        admin: user.type === 'admin',
        user: user.type === 'user',
      });
      await updateUserInfo(user);
      const urlParams = new URL(window.location.href).searchParams;
      let redirectUrl = urlParams.get('redirect');
      if (!redirectUrl || redirectUrl === '/login') {
        redirectUrl = '/';
      }
      history?.push(redirectUrl);
      return;
    } catch (error) {
      message.error(t('login.loginFailed'));
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles['language-dropdown']}>
        <LanguageDropdown />
      </div>
      <LoginForm
        title=""
        logo={<img alt="logo" src={logo} />}
        subTitle=""
        onFinish={async (values) => {
          await handleSubmit(values as LoginParams);
        }}
        submitter={
          {
            searchConfig: {
              submitText: t('login.buttonText'),
            },
          }
        }
      >
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
        {loginPrompt && (
          <div
            style={{
              marginBottom: 24,
              textAlign: 'center',
              whiteSpace: 'pre-wrap',
            }}
          >
            {loginPrompt}
          </div>
        )}
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

export default Login;
