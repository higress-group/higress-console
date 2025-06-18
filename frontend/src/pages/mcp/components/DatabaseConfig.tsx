import React, { useEffect } from 'react';
import { Form, Select, Input, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { SERVICE_TYPE, DB_TYPE_OPTIONS, REG_DSN_STRING } from '../constant';
import './DatabaseConfig.css';

interface DatabaseConfigProps {
  dsn?: string;
  dbType?: string;
  dbUrl?: string;
  dbPort?: string | number;
  onChange?: (dsn: string, dbType: string) => void;
  form: any;
}

const DB_FIELDS = [
  { label: '数据库地址', value: 'db_server_host' },
  { label: '数据库端口', value: 'db_server_port' },
  { label: '数据库类型', value: 'db_type' },
  { label: '用户名', value: 'db_user_name' },
  { label: '密码', value: 'db_password' },
  { label: '数据库名', value: 'db_database' },
];

export const DB_FIXED_FIELDS = [
  {
    id: 'db_server_host',
    defaultCredential: '',
    type: 'db_server_host',
    scheme: 'db_server_host',
  },
  {
    id: 'db_server_port',
    defaultCredential: '',
    type: 'db_server_port',
    scheme: 'db_server_port',
  },
  { id: 'db_type', defaultCredential: '', type: 'db_type', scheme: 'db_type' },
  {
    id: 'db_user_name',
    defaultCredential: '',
    type: 'db_user_name',
    scheme: 'db_user_name',
  },
  {
    id: 'db_password',
    defaultCredential: '',
    type: 'db_password',
    scheme: 'db_password',
  },
  {
    id: 'db_database',
    defaultCredential: '',
    type: 'db_database',
    scheme: 'db_database',
  },
];

export const computeDSN = (values: any) => {
  const { db_type, db_user_name, db_password, db_server_host, db_database, db_server_port } = values;
  if (!db_type || !db_user_name || !db_password || !db_server_host || !db_database) return '';
  // eslint-disable-next-line max-len
  return `${db_user_name}:${db_password}@tcp(${db_server_host}:${db_server_port})/${db_database}?charset=utf8mb4&parseTime=True&loc=Local`;
};

const DatabaseConfig: React.FC<DatabaseConfigProps> = ({ dsn, dbType, dbUrl, dbPort, onChange, form }) => {
  // 监听表单字段变化
  useEffect(() => {
    const values = form.getFieldsValue();
    const newDsn = computeDSN(values);
    if (onChange && newDsn) {
      onChange(newDsn, values.db_type);
    }
  }, [form.getFieldsValue()]);

  return (
    <div style={{ background: '#f7f8fa', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <div style={{ fontWeight: 'bold', width: 200 }}>认证类型</div>
        <div style={{ fontWeight: 'bold', flex: 1, marginLeft: 12 }}>认证凭证</div>
      </div>
      {DB_FIXED_FIELDS.map((item, idx) => (
        <div key={item.type} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
          <div className="db-config-label">
            {DB_FIELDS.find((f) => f.value === item.type)?.label}
          </div>
          <Form.Item
            name={`${item.id}`}
            rules={[{ required: true, message: '请输入配置值' }]}
            style={{ marginBottom: 0 }}
          >
            {item.type === 'db_type' ? (
              <Select
                key={item.id}
                style={{ width: 180 }}
                options={DB_TYPE_OPTIONS}
              />
            ) : (
              <Input
                key={item.id}
                style={{ width: 180 }}
                disabled={item.type === 'db_server_host' || item.type === 'db_server_port'}
                type={item.type === 'db_password' ? 'password' : 'text'}
              />
            )}
          </Form.Item>
        </div>
      ))}
    </div>
  );
};

export default DatabaseConfig;
