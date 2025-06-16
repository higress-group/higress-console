import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation, Trans } from 'react-i18next';

interface DeleteConfirmProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  confirmLoading?: boolean;
  recordName?: string;
  i18nKey?: string;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
  open,
  onOk,
  onCancel,
  confirmLoading = false,
  recordName = '',
  i18nKey = 'misc.deleteConfirm',
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={
        <div>
          <ExclamationCircleOutlined style={{ color: '#ffde5c', marginRight: 8 }} />
          {t('misc.delete')}
        </div>
      }
      open={open}
      onOk={onOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      cancelText={t('misc.cancel')}
      okText={t('misc.confirm')}
    >
      <p>
        <Trans t={t} i18nKey={i18nKey}>
          确定删除
          <span style={{ color: '#0070cc' }}>{{ currentMcpServerName: recordName }}</span>
          吗？
        </Trans>
      </p>
    </Modal>
  );
};

export default DeleteConfirm;
