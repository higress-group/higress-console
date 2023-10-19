import logo from '@/assets/logo.png';
import LanguageDropdown from '@/components/LanguageDropdown';
import { SYSTEM_INITIALIZED } from '@/interfaces/config';
import { UserInfo } from '@/interfaces/system';
import { initialize } from '@/services/system';
import store from '@/store';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import { useNavigate } from 'ice';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const Init: React.FC = () => {
  const { t } = useTranslation();

  const [configModel] = store.useModel('config');
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    const properties = configModel ? configModel.properties : {};
    if (properties[SYSTEM_INITIALIZED]) {
      navigate('/', { replace: true });
    }
  }, [configModel]);

  async function handleSubmit(values: UserInfo) {
    try {
      await initialize({
        adminUser: {
          name: values.name,
          displayName: values.name,
          password: values.password,
        },
      });
      message.success(t('init.initSuccess'));
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (error) {
      message.error(t('init.initFailed'));
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
          await handleSubmit(values as UserInfo);
        }}
        submitter={
          {
            searchConfig: {
              submitText: t('misc.submit'),
            },
          }
        }
        formRef={formRef}
      >
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {t('init.header')}
        </h3>
        <ProFormText
          name="name"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder={t('init.usernamePlaceholder') || ''}
          initialValue="admin"
          rules={[
            {
              required: true,
              message: t('init.usernameRequired') || '',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={t('init.passwordPlaceholder') || ''}
          rules={[
            {
              required: true,
              message: t('init.passwordRequired') || '',
            },
          ]}
        />
        <ProFormText.Password
          name="confirmPassword"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={t('init.confirmPasswordPlaceholder') || ''}
          rules={[
            {
              required: true,
              message: t('init.confirmPasswordRequired') || '',
            },
            {
              validator(rule, value) {
                if (!value) {
                  return Promise.resolve();
                }
                const password = formRef.current.getFieldValue("password");
                if (!password || password === value) {
                  return Promise.resolve();
                }
                return Promise.reject(t('init.confirmPasswordMismatched'));
              },
            },
          ]}
        />
      </LoginForm>
    </div>
  );
};

export const getConfig = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();
  return {
    title: t('init.title'),
  };
};

export default Init;
