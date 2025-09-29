import React from 'react';
import { Form, Select, Input } from 'antd';
import { DB_TYPE_OPTIONS } from '../constant';
import './DatabaseConfig.css';

interface DatabaseConfigProps {
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

const DatabaseConfig: React.FC<DatabaseConfigProps> = ({ form }) => {

  return (
    <div style={{ background: '#f7f8fa', borderRadius: 8, padding: 16, marginBottom: 16 }}>
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
                type={item.type === 'db_password' ? 'password' : 'text'}
                disabled={item.type === 'db_server_host' || item.type === 'db_server_port'}
              />
            )}
          </Form.Item>
        </div>
      ))}
    </div>
  );
};

export default DatabaseConfig;
