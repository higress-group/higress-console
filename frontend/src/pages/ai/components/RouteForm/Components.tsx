import React, { useState, useImperativeHandle } from "react";
import { Form, Button, Table, InputNumber } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { history } from 'ice';
import { CustomComponentHandles } from '@/interfaces/service-source';

// 刷新按钮
const RedoOutlinedBtn = (props) => {
  const { getList } = props;

  const handleClick = async () => {
    getList && getList.run();
  };

  return (
    <Form.Item label="&nbsp;">
      <Button 
        onClick={handleClick} 
        disabled={getList && getList.loading} 
        icon={<RedoOutlined spin={getList && getList.loading}/>}
      />
    </Form.Item>
  )
};

// 跳转按钮
const HistoryButton = (props) => {
  const { text='', path='' } = props;

  return (
    <Button 
      type="link" style={{ padding: 0 }} 
      onClick={()=>history?.push(path)}
    >
      {text}
    </Button>
  )
};

const UpstreamsTable = React.forwardRef<CustomComponentHandles>((props, ref) => {
  const [dataSource, setDataSource] = useState<any[]>([]);

  useImperativeHandle(ref, () => ({
    addItem: (item) => {
      setDataSource([ ...dataSource, item ].map(i => ({...i, provider: i.name, weight: 100 })));
    },
    getList: () => {
      return dataSource.map(({ provider, weight }) => ({ provider, weight }));
    }
  }));

  const columns = [
    {
      title: '服务',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      render: (_, record) => (
        <InputNumber 
          min={0} 
          max={100} 
          defaultValue={record.weight}
          addonAfter="%"
          style={{ width: "100%" }}
          onChange={val => weightChange(val, record)}
        />
      )
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => (
        <Button type="link" onClick={()=> deleteData(record)}>删除</Button>
      ),
    },
  ];

  const deleteData = (record) => {
    const newList = dataSource.filter(i => i.name!== record.name);
    setDataSource(newList);
  };

  const weightChange = (val, record) => {
    const newList = dataSource.map(i => {
      if(i.name === record.name) {
        return {
         ...i,
          weight: val
        }
      }
      return i;
    });

    setDataSource(newList);
  };

  return (
    <>
      <Table 
        rowKey="name"
        size="small"
        pagination={false}
        columns={columns}
        dataSource={dataSource}
      />
    </>
  );
});

export {
  RedoOutlinedBtn,
  HistoryButton,
  UpstreamsTable,
};