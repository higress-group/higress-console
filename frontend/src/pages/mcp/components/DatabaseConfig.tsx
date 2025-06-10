import React, { useEffect, useState } from 'react';
import { Form, Select, Input, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { SERVICE_TYPE, DB_TYPE_OPTIONS, REG_DSN_STRING } from '../constant';

const { Text } = Typography;

interface DatabaseConfigProps {
  dsn?: string;
  dbType?: string;
  dbUrl?: string;
  dbPort?: string | number;
  onChange?: (dsn: string, dbType: string) => void;
}

const DB_FIELDS = [
  { label: '数据库地址', value: 'db_server_host' },
  { label: '数据库端口', value: 'db_server_port' },
  { label: '数据库类型', value: 'db_type' },
  { label: '用户名', value: 'db_user_name' },
  { label: '密码', value: 'db_password' },
  { label: '数据库名', value: 'db_database' },
];

const DB_FIXED_FIELDS = [
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

const DatabaseConfig: React.FC<DatabaseConfigProps> = ({ dsn, dbType, dbUrl, dbPort, onChange }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [localValue, setLocalValue] = useState(DB_FIXED_FIELDS);

  useEffect(() => {
    if (dsn) {
      const match = dsn.match(REG_DSN_STRING.DEFAULT);
      if (match) {
        // localValue 顺序：host, port, dbType, user, password, database
        const newValue = [...localValue];
        newValue[0].defaultCredential = match[3]; // host
        newValue[1].defaultCredential = match[4]; // port
        newValue[3].defaultCredential = match[1]; // user
        newValue[4].defaultCredential = match[2]; // password
        newValue[5].defaultCredential = match[5]; // database
        setLocalValue(newValue);
      }
    }
    if (dbType) {
      const newValue = [...localValue];
      newValue[2].defaultCredential = dbType;
      setLocalValue(newValue);
    }
  }, [dsn, dbType]);

  useEffect(() => {
    if (dbUrl) {
      const newValue = [...localValue];
      newValue[0].defaultCredential = dbUrl;
      setLocalValue(newValue);
    }
  }, [dbUrl]);

  useEffect(() => {
    if (dbPort) {
      const newValue = [...localValue];
      newValue[1].defaultCredential = dbPort.toString();
      setLocalValue(newValue);
    }
  }, [dbPort]);

  useEffect(() => {
    // eslint-disable-next-line max-len
    const newDsn = `${localValue[3].defaultCredential}:${localValue[4].defaultCredential}@tcp(${localValue[0].defaultCredential}:${localValue[1].defaultCredential})/${localValue[5].defaultCredential}?charset=utf8mb4&parseTime=True&loc=Local`;
    const newDbType = localValue[2].defaultCredential;
    onChange?.(newDsn, newDbType);
  }, [localValue]);

  const handleValueChange = (index: number, value: string) => {
    const newValue = [...localValue];
    newValue[index].defaultCredential = value;
    setLocalValue(newValue);
  };

  return (
    <div style={{ background: '#f7f8fa', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <div style={{ fontWeight: 'bold', width: 200 }}>认证类型</div>
        <div style={{ fontWeight: 'bold', flex: 1, marginLeft: 12 }}>认证凭证</div>
      </div>
      {localValue.map((item, idx) => (
        <div key={item.type} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
          {/* item.type: {item.type} {JSON.stringify(DB_FIELDS.find((f) => f.value === item.type))} */}
          <Form.Item name={`${item.type}`} style={{ marginBottom: 0 }}>
            <Input
              defaultValue={DB_FIELDS.find((f) => f.value === item.type)?.label}
              style={{ width: 200, background: '#f5f5f5' }}
              disabled
            />
          </Form.Item>
          <Form.Item
            name={`${idx}.defaultCredential`}
            rules={[{ required: true, message: '请输入配置值' }]}
            style={{ marginBottom: 0 }}
          >
            {item.type === 'db_type' ? (
              <Select
                key={`${item.type}-${item.defaultCredential}`}
                value={item.defaultCredential}
                style={{ width: 180 }}
                options={DB_TYPE_OPTIONS}
                onChange={(value) => handleValueChange(idx, value)}
              />
            ) : (
              <Input
                key={`${item.type}-${item.defaultCredential}`}
                value={item.defaultCredential}
                style={{ width: 180 }}
                disabled={item.type === 'db_server_host' || item.type === 'db_server_port'}
                type={item.type === 'db_password' ? 'password' : 'text'}
                onChange={(e) => handleValueChange(idx, e.target.value)}
              />
            )}
          </Form.Item>
        </div>
      ))}
    </div>
  );
};

export default DatabaseConfig;
