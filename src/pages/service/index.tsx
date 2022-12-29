import React, { useEffect, useRef, useState } from 'react';
import { definePageConfig } from 'ice';
import { Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { Table } from 'antd';
import { getGatewayServices } from '@/services';
import { ServiceItem } from '@/interfaces/service';
import { useRequest } from 'ahooks';


const TableList: React.FC = () => {
  const columns = [
    {
      title: '服务名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '命名空间',
      dataIndex: 'namespace',
      key: 'namespace',
    },
    {
      title: '服务地址',
      dataIndex: 'endPoints',
      key: 'endPoints',
      cell: (value) => (
        <div>
          { value && value.map(ip => <div>{ip}</div>)}
        </div>
      ),
    },
  ];

  const [dataSource, setDataSource] = useState<ServiceItem[]>([]);
  
  const getServiceList = async (factor): Promise<ServiceItem[]> => (getGatewayServices(factor));

  const { loading, run } = useRequest(getServiceList, {
    manual: true,
    onSuccess: (result, params) => setDataSource(result),
  });

  useEffect(() => {
    run({ pageNum: 1, pageSize: 10 });
  }, []);

  return (
    <PageContainer>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    </PageContainer>
  );
};

export default TableList;

export const pageConfig = definePageConfig(() => {
  return {
    auth: ['admin'],
  };
});

