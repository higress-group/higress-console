import React, { useContext, useState } from 'react';
import { Table, Form, InputNumber, Select, Button, message, Checkbox, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { uniqueId } from 'lodash';

const { Option } = Select;

const EditableContext = React.createContext<any>(null);

interface DomainGroupProps {
  value?: Record<number, string>;
  onChange?: (value: any[]) => void;
  certificateOptions: Array<{ label: string; value: string }>;
  isIngressMode?: boolean;
  mustHttps?: boolean[];
  onMustHttpsChange?: (value: boolean[]) => void;
}

interface DataType {
  uid: string;
  port: number;
  protocol: 'HTTP' | 'HTTPS';
  certificate: string;
}

const EditableRow: React.FC = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof DataType;
  record: DataType;
  handleSave: (record: DataType) => void;
  inputType: 'number' | 'select';
  selectOptions?: Array<{ label: string; value: string }>;
  isIngressMode?: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  inputType,
  selectOptions,
  isIngressMode,
  ...restProps
}) => {
  const form = useContext(EditableContext);

  const save = async () => {
    try {
      const values = await form.validateFields();
      if (values.protocol === 'HTTP') {
        values.certificate = '';
      }
      if (isIngressMode) {
        if (values.port === 80) {
          values.protocol = 'HTTP';
          values.certificate = '';
        }
      }
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    const isDisabled = dataIndex === 'certificate' && record.protocol === 'HTTP';

    childNode = (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: dataIndex === 'certificate' ? record.protocol === 'HTTPS' : true,
            message: `${title} 不能为空`,
          },
        ]}
        initialValue={record[dataIndex]}
      >
        {inputType === 'number' ? (
          <InputNumber
            min={1}
            max={65535}
            onBlur={save}
          />
        ) : (
          <Select
            style={{ width: '100%' }}
            onChange={save}
            disabled={isDisabled || (isIngressMode && record.port === 80)}
          >
            {selectOptions?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const DomainGroup: React.FC<DomainGroupProps> = ({ value, onChange, certificateOptions, isIngressMode, mustHttps, onMustHttpsChange }) => {
  const { t } = useTranslation();

  // change value to array
  const valueArray: DataType[] = value ? Object.keys(value).map((port): DataType => ({
    uid: uniqueId(),
    port: Number(port),
    protocol: value[Number(port)] ? 'HTTPS' : 'HTTP' as const,
    certificate: value[Number(port)] || '',
  })) : [];

  const [dataSource, setDataSource] = useState<DataType[]>(valueArray);

  const handleDelete = (uid: string) => {
    const newData = dataSource.filter((item) => item.uid !== uid);
    setDataSource(newData);
    onChange?.(newData);
  };

  const handleAdd = () => {
    const newData: DataType = {
      uid: uniqueId(),
      port: isIngressMode ? 80 : 80,
      protocol: 'HTTP',
      certificate: '',
    };
    setDataSource([...dataSource, newData]);
    onChange?.([...dataSource, newData]);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.uid === item.uid);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
    onChange?.(newData);
  };

  const hasHttp80AndHttps443 = dataSource.some(item => item.port === 80 && item.protocol === 'HTTP') &&
    dataSource.some(item => item.port === 443 && item.protocol === 'HTTPS');

  const columns = [
    {
      title: t('domain.columns.port'),
      dataIndex: 'port',
      width: '30%',
      editable: true,
    },
    {
      title: t('domain.columns.protocol'),
      dataIndex: 'protocol',
      width: '30%',
      editable: true,
    },
    {
      title: t('domain.columns.certificate'),
      dataIndex: 'certificate',
      width: '30%',
      editable: true,
    },
    {
      title: t('domain.columns.action'),
      dataIndex: 'action',
      render: (_: any, record: DataType) => {
        return dataSource.length >= 1 ? (
          <DeleteOutlined onClick={() => handleDelete(record.uid)} />
        ) : null;
      },
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columnsWithProps = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        inputType: col.dataIndex === 'port' ? 'number' : 'select',
        selectOptions: (() => {
          if (col.dataIndex === 'protocol') {
            return [
              { label: 'HTTP', value: 'HTTP' },
              { label: 'HTTPS', value: 'HTTPS' },
            ];
          }
          if (col.dataIndex === 'certificate') {
            return certificateOptions;
          }
          return undefined;
        })(),
        handleSave,
        isIngressMode,
      }),
    };
  });

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columnsWithProps as any}
        pagination={false}
      />
      <Button
        onClick={handleAdd}
        type="link"
        style={{ marginTop: 16 }}
        disabled={isIngressMode && dataSource.length >= 2}
      >
        <PlusOutlined /> {t('domain.domainForm.addPortAndCert')}
      </Button>
      {hasHttp80AndHttps443 && (
        <Form.Item
          name="mustHttps"
          style={{ marginTop: 16 }}
        >
          <Checkbox.Group
            value={mustHttps}
            onChange={onMustHttpsChange}
            options={[
              {
                label: (
                  <>
                    <span style={{ marginRight: 4 }}>{t('domain.domainForm.mustHttps')}</span>
                    <Tooltip title={t('domain.domainForm.mustHttpsCheckboxTooltip')}>
                      <QuestionCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                    </Tooltip>
                  </>
                ),
                value: true,
              },
            ]}
          />
        </Form.Item>
      )}
    </div>
  );
};

export default DomainGroup;
