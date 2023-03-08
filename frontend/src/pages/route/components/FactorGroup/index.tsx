import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { uniqueId } from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
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
  dataIndex: keyof Item;
  record: Item;
  nodeType: 'select' | 'input';
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  nodeType,
  record,
  handleSave,
  ...restProps
}) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(true);
  const inputRef = useRef(null);
  const form = useContext(EditableContext)!;

  const matchOptions = ['PRE', 'EQUAL', 'REGULAR'].map((v) => {
    return { label: t(`route.matchTypes.${v}`), value: v };
  });

  useEffect(() => {
    form.setFieldsValue({ ...record });
  }, [editing]);

  const save = async () => {
    try {
      const values = await form.validateFields();

      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  const node =
    nodeType === 'select' ? (
      <Select ref={inputRef} options={matchOptions} />
    ) : (
      <Input ref={inputRef} onPressEnter={save} onBlur={save} />
    );

  if (editable) {
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: t(`route.factorGroup.required.${dataIndex}`),
          },
        ]}
      >
        {node}
      </Form.Item>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  uid: number;
  key: string;
  matchType: string;
  matchValue: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

interface FactorGroupProps {
  id: string;
  onChange: (record) => void;
}

const FactorGroup: React.FC = ({ value, onChange }) => {
  const { t } = useTranslation();

  const initDataSource = value || [];
  for (const item of initDataSource) {
    if (!item.uid) {
      item.uid = uniqueId();
    }
  }
  const [dataSource, setDataSource] = useState<DataType[]>(value || []);

  const defaultColumns: Array<ColumnTypes[number] & { editable?: boolean; dataIndex: string }> = [
    {
      title: t('route.factorGroup.columns.key'),
      dataIndex: 'key',
      editable: true,
    },
    {
      title: t('route.factorGroup.columns.matchType'),
      dataIndex: 'matchType',
      width: 130,
      editable: true,
    },
    {
      title: t('route.factorGroup.columns.matchValue'),
      dataIndex: 'matchValue',
      editable: true,
    },
    {
      title: t('route.factorGroup.columns.operation'),
      dataIndex: 'operation',
      width: 60,
      render: (_, record: { uid: number }) =>
        (dataSource.length >= 1 ? (
          <div onClick={() => handleDelete(record.uid)}>
            <DeleteOutlined />
          </div>
        ) : null),
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      uid: uniqueId(),
      key: '',
      matchType: '',
      matchValue: '',
    };
    setDataSource([...dataSource, newData]);
    onChange([...dataSource, newData]);
  };

  const handleDelete = (uid: number) => {
    const newData = dataSource.filter((item) => item.uid !== uid);
    setDataSource(newData);
    onChange(newData);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.uid === item.uid);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
    onChange(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
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
        nodeType: col.dataIndex === 'matchType' ? 'select' : 'input',
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Table
        components={components}
        size="small"
        className={styles.factor}
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={false}
      />
      <Button onClick={handleAdd} type="link">
        <PlusOutlined />
        {t('route.factorGroup.parameter')}
      </Button>
    </div>
  );
};

export default FactorGroup;
