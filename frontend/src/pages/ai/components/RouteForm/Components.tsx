import React, { useState, useImperativeHandle } from "react";
import { Form, Button, Table, InputNumber } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { history } from 'ice';
import { CustomComponentHandles } from '@/interfaces/service-source';
import { useTranslation } from 'react-i18next';

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
        icon={<RedoOutlined spin={getList && getList.loading} />}
      />
    </Form.Item>
  )
};

// 跳转按钮
const HistoryButton = (props) => {
  const { text = '', path = '' } = props;

  return (
    <Button
      type="link"
      style={{ padding: 0 }}
      onClick={() => history?.push(path)}
    >
      {text}
    </Button>
  )
};

const UpstreamsTable = React.forwardRef<CustomComponentHandles>((props, ref) => {
  const { t } = useTranslation();
  const [dataSource, setDataSource] = useState<any[]>([]);

  useImperativeHandle(ref, () => ({
    setDataSource,
    addItem: (item) => {
      setDataSource([...dataSource, item].map(i => ({ provider: i.name, weight: 100, ...i })));
    },
    getList: () => {
      return dataSource.map(({ provider, weight }) => ({ provider, weight }));
    },
  }));

  const columns = [
    {
      title: t('aiRoute.columns.upstreams'), // '服务',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: t('llmProvider.providerForm.label.weight'), // '权重',
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
      ),
    },
    {
      title: t('plugins.builtIns.headerControl.action'), // 操作
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => (
        <Button type="link" onClick={() => deleteData(record)}>
          {t('misc.delete')}
        </Button>
      ),
    },
  ];

  const deleteData = (record) => {
    const newList = dataSource.filter(i => i.provider !== record.provider);
    setDataSource(newList);
  };

  const weightChange = (val, record) => {
    const newList = dataSource.map(i => {
      if (i.provider === record.provider) {
        return {
          ...i,
          weight: val,
        }
      }
      return i;
    });

    setDataSource(newList);
  };

  return (
    <>
      <Table
        rowKey="provider"
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
