import React, { useEffect, useRef } from 'react';
import { definePageConfig } from 'ice';
import { Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { Table } from 'antd';
import { getGatewayServices } from '@/services';

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

const TableList: React.FC = () => {

  useEffect(() => {
    getServiceList();
  }, []);

  const getServiceList = async () => {
    const res = await getGatewayServices({ pageNum: 1, pageSize: 10 });
    console.log('res===', res);
  };

  return (
    <PageContainer>
      <Table dataSource={dataSource} columns={columns} />;
    </PageContainer>
  );
};

export default TableList;

export const pageConfig = definePageConfig(() => {
  return {
    auth: ['admin'],
  };
});

