import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { uniqueId } from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';
import i18next from 'i18next';

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
  nodeType: string;
  required: boolean;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  nodeType,
  record,
  required,
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
      handleSave({ ...record, ...form.getFieldsValue() });
    }
  };

  let childNode = children;
  let node;

  const handleInputChange = (name, value) => {
    form.setFieldValue(name, value);
  };

  switch (nodeType) {
    case 'string':
      node = (
        <Input
          ref={inputRef} 
          onPressEnter={save} 
          onBlur={save} 
          onChange={(e) => handleInputChange(dataIndex, e.target.value)} 
        />
      );
      break;
    case 'integer':
      node = (
        <Input 
          type="number" 
          ref={inputRef} 
          onPressEnter={save} 
          onBlur={save} 
          onChange={(e) => handleInputChange(dataIndex, parseInt(e.target.value, 10))}
        />
      );
      break;
    case 'number':
      node = (
        <Input
          type="number" 
          step="any" 
          ref={inputRef} 
          onPressEnter={save} 
          onBlur={save} 
          onChange={(e) => handleInputChange(dataIndex, parseFloat(e.target.value))}
        />
      )
      break;
    case 'boolean':
      node = (
        <Select ref={inputRef} onPressEnter={save} onBlur={save}>
          <Select.Option value={true}>true</Select.Option>
          <Select.Option value={false}>false</Select.Option>
        </Select>
      );
      break;
    default:
      node = (
        <Input
          ref={inputRef} 
          onPressEnter={save} 
          onBlur={save} 
          onChange={(e) => handleInputChange(dataIndex, e.target.value)} 
        />
      );
    }

  if (editable) {
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: required,
            message: `${title} ` + `${t('misc.isRequired')}`
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
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const ArrayForm: React.FC = ({ array, value, onChange }) => {
  const { t } = useTranslation();

  const initDataSource = value || [];
  for (const item of initDataSource) {
    if (!item.uid) {
      item.uid = uniqueId();
    }
  }

  const [dataSource, setDataSource] = useState<DataType[]>(value || []);

  function getLocalizedText(obj: any, index: string, defaultText: string) {
    const i18nObj = obj[`x-${index}-i18n`];
    return i18nObj && i18nObj[i18next.language] || obj[index] || defaultText || '';
  }

  const defaultColumns: any[] = [];
  if (array.type === 'object') {
    Object.entries(array.properties).forEach(([key, prop]) => {
      let translatedTitle = getLocalizedText(prop, 'title', key);
      const isRequired = (array.required || []).includes(key);
      defaultColumns.push({
        title: translatedTitle,
        dataIndex: key,
        editable: true,
        required: isRequired,
        nodeType: prop.type,
      });
    });
  } else {
    defaultColumns.push({
      title: t(array.title),
      dataIndex: 'Item',
      editable: true,
      required: true,
      nodeType: array.type,
    });
  }

  defaultColumns.push({
    dataIndex: 'operation',
    width: 60,
    render: (_, record: { uid: number }) =>
    (dataSource.length >= 1 ? (
      <div onClick={() => handleDelete(record.uid)}>
        <DeleteOutlined />
      </div>
    ) : null),
  });

  const handleAdd = () => {
    const newData: DataType = {
      uid: uniqueId(),
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
        required: col.required,
        nodeType: col.nodeType,
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
        rowKey={(record) => record.uid}
      />
      <Button onClick={handleAdd} type="link">
        <PlusOutlined />
      </Button>
    </div>
  );
};

export default ArrayForm;