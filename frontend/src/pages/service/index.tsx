import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Col, Form, Input, Row, Select, Button } from 'antd';
import { getGatewayServices } from '@/services';
import { ServiceItem, ServiceFactor, OptionItem } from '@/interfaces/service';
import { useRequest } from 'ahooks';
import { RedoOutlined } from '@ant-design/icons';


const ServiceList: React.FC = () => {
  const columns = [
    {
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
      width: 350,
      ellipsis: true,
    },
    {
      title: '命名空间',
      dataIndex: 'namespace',
      key: 'namespace',
      width: 200
    },
    {
      title: '服务地址',
      dataIndex: 'endPoints',
      key: 'endPoints',
      ellipsis: true,
      render: (value) => {
        return value && value.join(',') || '-';
      },
    },
  ];

  const [dataSource, setDataSource] = useState<ServiceItem[]>([]);
  const [namespaces, setNamespaces] = useState<OptionItem[]>();
  const servicesRef = useRef<ServiceItem[] | null>();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const getServiceList = async (factor: ServiceFactor): Promise<ServiceItem[]> => (getGatewayServices(factor));

  const { loading, run, refresh } = useRequest(getServiceList, {
    manual: true,
    onSuccess: (result, params) => {
      const _os = new Set();
      const _namespaces: Array<OptionItem> = [];
      result && result.forEach(service => {
        const { namespace } = service;
        if (!_os.has(namespace)) {
          _namespaces.push({
            label: namespace,
            value: namespace,
          });
          _os.add(namespace);
        }
      });
      servicesRef.current = result;
      setDataSource(result);
      setNamespaces(_namespaces);
    },
  });

  useEffect(() => {
    run({});
  }, []);

  const onSearch = () => {
    const values = form.getFieldsValue();
    setIsLoading(true);
    const factor = {};
    const { name, namespace } = values;
    let _dataSource: ServiceItem[]  = servicesRef.current as ServiceItem[];
    if (name) {
      Object.assign(factor, { name });
      _dataSource =_dataSource && _dataSource.filter((service: ServiceItem) => {
        const { name: _name } = service;
        return _name.indexOf(name) > -1;
      });
    }
    if (namespace) {
      Object.assign(factor, { namespace });
      _dataSource = _dataSource && _dataSource.filter((service: ServiceItem) => {
        const { namespace: _namespace } = service;
        return _namespace == namespace;
      })
    }
    setDataSource(_dataSource);
    setIsLoading(false);
  };

  const onReset = () => form.resetFields();

  return (
    <PageContainer>
      <Form
        form={form}
        style={{ 
          background: '#fff', 
          height: 64, 
          paddingTop: 16, 
          marginBottom: 16, 
          paddingLeft: 16, 
          paddingRight: 16 
        }}
      >
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item
              label="服务名称"
              name="name"
            >
              <Input
                allowClear
                placeholder="请输入服务名称"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="命名空间"
              name="namespace"
            >
              <Select
                showSearch
                allowClear
                defaultValue=''
                placeholder="请输入命名空间"
                options={namespaces}
              />
            </Form.Item>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              onClick={onSearch}
            >
              查询
            </Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={onReset}
            >
              重置
            </Button>
            <Button
              icon={<RedoOutlined />}
              onClick={refresh}
            />
          </Col>
        </Row>
      </Form>
      <Table
        loading={loading || isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    </PageContainer>
  );
};

export default ServiceList;

