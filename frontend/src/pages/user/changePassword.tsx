/* eslint-disable */
// @ts-nocheck
import { ChangePasswordParams } from '@/interfaces/user';
import { changePassword } from '@/services';
import store from '@/store';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Form, Input, Modal } from 'antd';
import { history } from 'ice';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ChangePasswordFormProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordForm: React.FC = () => {
  const [userState, userDispatcher] = store.useModel('user');
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async () => {
    try {
      const values: ChangePasswordFormProps = await form.validateFields();
      const { oldPassword, newPassword } = values;
      const data = { oldPassword, newPassword };
      await changePassword(data as ChangePasswordParams);
      setShowSuccessModal(true);
    } catch (errInfo) {
      console.log('Change password failed.', errInfo);
    }
  };

  const relogin = () => {
    userDispatcher.updateCurrentUser({});
    history?.push(`/login`);
  };

  useEffect(() => {
    form.resetFields();
  }, [])

  return (
    <PageContainer>
      <div
        style={{
          background: '#fff',
          padding: 16,
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          style={{
            width: 600,
          }}
        >
          <Form.Item
            label={t('user.changePassword.username')}
          >
            {userState.currentUser.name}
          </Form.Item>
          <Form.Item
            label={t('user.changePassword.oldPassword')}
            required
            name="oldPassword"
            rules={[
              {
                required: true,
                message: t('user.changePassword.oldPasswordRequired'),
              },
            ]}
          >
            <Input allowClear maxLength={256} type="password" />
          </Form.Item>
          <Form.Item
            label={t('user.changePassword.newPassword')}
            required
            name="newPassword"
            rules={[
              {
                required: true,
                message: t('user.changePassword.newPasswordRequired'),
              },
            ]}
          >
            <Input allowClear maxLength={256} type="password" />
          </Form.Item>
          <Form.Item
            label={t('user.changePassword.confirmPassword')}
            required
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: t('user.changePassword.confirmPasswordRequired'),
              },
              {
                validator(rule, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  const newPassword = form.getFieldValue("newPassword");
                  if (!newPassword || newPassword === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(t('user.changePassword.confirmPasswordMismatched'));
                },
              }
            ]}
          >
            <Input allowClear maxLength={256} type="password" />
          </Form.Item>
          <Form.Item
            style={{
              marginBottom: 0
            }}
            wrapperCol={{ offset: 12, span: 12 }}
          >
            <Button type="primary" onClick={handleSubmit}>
              {t('misc.submit')}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Modal
        open={showSuccessModal}
        title={t('misc.information')}
        onOk={relogin}
        onCancel={relogin}
        footer={[
          <Button key="submit" type="primary" onClick={relogin}>
            OK
          </Button>
        ]}
      >
        <p>{t('user.changePassword.reloginPrompt')}</p>
      </Modal>
    </PageContainer>
  );
};

export default ChangePasswordForm;
