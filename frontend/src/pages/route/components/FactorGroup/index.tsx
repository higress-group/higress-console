import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { uniqueId } from "lodash";
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.module.css';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

const FitOptions = [
  { label: '前缀匹配', value: 'PRE' },
  { label: '精确匹配', value: 'EQUAL' },
  { label: '正则匹配', value: 'ERGULAR' },
];

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
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
  const [editing, setEditing] = useState(true);
  const inputRef = useRef(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    form.setFieldsValue({ ...record });
  }, [editing]);

  const save = async () => {
    try {
      const values = await form.validateFields();

      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  const node = nodeType === 'select' ? 
   (<Select ref={inputRef} options={FitOptions} />)
   : (<Input ref={inputRef} onPressEnter={save} onBlur={save} />);

  if (editable) {
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
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
  uid: number,
  key: string;
  type: string;
  value: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

interface FactorGroupProps {
  id: string;
  onChange: (record) => void;
}

const FactorGroup: React.FC = ({ value, onChange }) => {
  const [dataSource, setDataSource] = useState<DataType[]>(value || []);

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'key',
      dataIndex: 'key',
      editable: true,
    },
    {
      title: '条件',
      dataIndex: 'type',
      width: 130,
      editable: true,
    },
    {
      title: '值',
      dataIndex: 'value',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 60,
      render: (_, record: { uid: number }) =>
        dataSource.length >= 1 ? (
          <div onClick={() => handleDelete(record.uid)}>
            <DeleteOutlined />
          </div>
        ) : null,
    },
  ];


  const handleAdd = () => {
    const newData: DataType = {
      uid: uniqueId(),
      key: '',
      type: '',
      value: '',
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
        nodeType: col.dataIndex === 'type' ? 'select' : 'input',
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
        <PlusOutlined />参数
      </Button>
    </div>
  );
};

export default FactorGroup;