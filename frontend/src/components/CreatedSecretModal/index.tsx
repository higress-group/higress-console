import { Button, Modal, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const { Paragraph, Text } = Typography;

export interface SecretEntry {
  label: string;
  value: string;
}

interface CreatedSecretModalProps {
  open: boolean;
  entries: SecretEntry[];
  onConfirm: () => void;
}

const CreatedSecretModal: React.FC<CreatedSecretModalProps> = ({ open, entries, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('createdSecret.title')}
      open={open}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={[
        <Button key="confirm" type="primary" onClick={onConfirm}>
          {t('createdSecret.confirm')}
        </Button>,
      ]}
    >
      <Paragraph>{t('createdSecret.description')}</Paragraph>
      {entries.map((entry) => (
        <div key={entry.label} style={{ marginBottom: '0.75rem' }}>
          <Text strong>{entry.label}</Text>
          <Paragraph copyable={{ text: entry.value }} style={{ marginBottom: 0, wordBreak: 'break-all' }}>
            <Text code>{entry.value}</Text>
          </Paragraph>
        </div>
      ))}
    </Modal>
  );
};

export default CreatedSecretModal;
