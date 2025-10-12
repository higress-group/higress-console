// AI模型提供商管理页面组件
// 该组件用于展示、创建、编辑和删除AI模型提供商

import { LlmProvider } from '@/interfaces/llm-provider';
import { addLlmProvider, deleteLlmProvider, getLlmProviders, updateLlmProvider } from '@/services/llm-provider';
import { ExclamationCircleOutlined, EyeInvisibleTwoTone, EyeTwoTone, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Col, Drawer, Form, Modal, Row, Space, Table, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ProviderForm from './components/ProviderForm';
import { aiModelProviders } from './configs';

const { Text } = Typography;

// 密码文本显示组件，支持隐藏/显示切换
interface FormRef {
  reset: () => void;
  handleSubmit: () => Promise<FormProps>;
}

// 密码文本显示组件，支持隐藏/显示切换
const EllipsisMiddle: React.FC = (params: { value: String }) => {
  const { value } = params;
  const [isHidden, setIsHidden] = useState(true);

  // 切换文本显示方式
  const toggledText = () => {
    if (!isHidden) {
      return value;
    }
    const prefixLength = 3;
    const suffixLength = 3;
    if (value.length - prefixLength - suffixLength > 6) {
      return `${value.slice(0, 3)}******${value.slice(-3)}`;
    }
    if (value.length > 2) {
      return `${value.slice(0, 1)}******${value.slice(-1)}`;
    }
    return `${value.slice(0, 1)}******`;
  };

  return (
    <div
      style={{ marginBottom: '10px' }}
    >
      <Text>{toggledText()}</Text>
      <span
        style={{ cursor: 'pointer', marginLeft: '2px' }}
        onClick={() => setIsHidden(!isHidden)}
      >
        {isHidden ? <EyeTwoTone /> : <EyeInvisibleTwoTone />}
      </span>
    </div>
  );
};

// AI模型提供商列表组件
const LlmProviderList: React.FC = () => {
  // 国际化翻译hook
  const { t } = useTranslation();
  
  // 表格列配置
  const columns = [
    {
      // 提供商类型列
      title: t('llmProvider.columns.type'),
      dataIndex: 'type',
      key: 'type',
      render: (value) => {
        const providerConfig = aiModelProviders.find(c => c.value === value);
        const key = `llmProvider.providerTypes.${value}`;
        const text = t(key);
        return text !== key ? text : (providerConfig?.label || value);
      },
    },
    {
      // 提供商名称列
      title: t('llmProvider.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      // 端点列
      title: t('service.columns.endpoints'),
      dataIndex: 'endpoints',
      key: 'endpoints',
      ellipsis: true,
      render: (value, record) => {
        const providerConfig = aiModelProviders.find(p => p.value === record.type);
        if (providerConfig && typeof providerConfig.getProviderEndpoints === 'function') {
          value = providerConfig.getProviderEndpoints(record);
        }
        if (!Array.isArray(value) || !value.length) {
          if (!providerConfig?.serviceAddress) {
            return '-';
          }
          value = [providerConfig.serviceAddress];
        }
        return value.map((endpoint) => <span key={endpoint}>{endpoint}</span>)
          .reduce((prev, curr) => [prev, <br key={`${prev.key}_br_${curr.key}`} />, curr]);
      },
    },
    {
      // Token列
      title: t('llmProvider.columns.tokens'),
      dataIndex: 'tokens',
      key: 'tokens',
      render: (value, record) => {
        const providerConfig = aiModelProviders.find(p => p.value === record.type);
        if (providerConfig && providerConfig.useCustomCredentials) {
          value = providerConfig.getCredentialsForDisplay(record);
        }
        if (!Array.isArray(value) || !value.length) {
          return '-';
        }
        return value.map((token) => <EllipsisMiddle key={token} value={token} />);
      },
    },
    {
      // 代理名称列
      title: t('serviceSource.columns.proxyName'),
      dataIndex: 'proxyName',
      key: 'proxyName',
      render: (value, record) => {
        return value || '-';
      },
    },
    {
      // 操作列
      title: t('misc.actions'),
      dataIndex: 'action',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => onEditDrawer(record)}>{t('misc.edit')}</a>
          <a onClick={() => onShowModal(record)}>{t('misc.delete')}</a>
        </Space>
      ),
    },
  ];

  // 表单实例
  const [form] = Form.useForm();
  // 表单引用
  const formRef = useRef<FormRef>(null);
  // 数据源状态
  const [dataSource, setDataSource] = useState<LlmProvider[]>([]);
  // 当前选中的提供商状态
  const [currentLlmProvider, setCurrentLlmProvider] = useState<LlmProvider>();
  // 抽屉打开状态
  const [openDrawer, setOpenDrawer] = useState(false);
  // 模态框打开状态
  const [openModal, setOpenModal] = useState(false);
  // 确认加载状态
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 获取提供商列表的请求
  const { loading, run, refresh } = useRequest(getLlmProviders, {
    manual: true,
    onSuccess: (result) => {
      const llmProviders = (result || []) as LlmProvider[];
      llmProviders.forEach(r => { r.key = r.name; });
      llmProviders.sort((i1, i2) => {
        return i1.name.localeCompare(i2.name);
      })
      setDataSource(llmProviders);
    },
  });

  // 组件挂载时获取数据
  useEffect(() => {
    run();
  }, []);

  // 编辑抽屉打开处理函数
  const onEditDrawer = (llmProvider: LlmProvider) => {
    setCurrentLlmProvider(llmProvider);
    setOpenDrawer(true);
  };

  // 新建抽屉打开处理函数
  const onShowDrawer = () => {
    setOpenDrawer(true);
    setCurrentLlmProvider(null);
  };

  // 抽屉确认处理函数
  const handleDrawerOK = async () => {
    const values = formRef.current ? await formRef.current.handleSubmit() : {};
    if (!values) {
      return;
    }

    try {
      if (currentLlmProvider) {
        // version 进行创建或强制更新操作时需设置为 0。
        const params: LlmProvider = { version: 0, ...values };
        await updateLlmProvider(params);
      } else {
        await addLlmProvider(values as LlmProvider);
      }

      setOpenDrawer(false);
      formRef.current && formRef.current.reset();
      refresh();
    } catch (errInfo) {
      console.log('Save failed: ', errInfo);
    }
  };

  // 抽屉取消处理函数
  const handleDrawerCancel = () => {
    setOpenDrawer(false);
    formRef.current && formRef.current.reset();
    setCurrentLlmProvider(null);
  };

  // 删除模态框打开处理函数
  const onShowModal = (llmProvider: LlmProvider) => {
    setCurrentLlmProvider(llmProvider);
    setOpenModal(true);
  };

  // 模态框确认处理函数
  const handleModalOk = async () => {
    setConfirmLoading(true);
    try {
      await deleteLlmProvider(currentLlmProvider.name);
    } catch (err) {
      setConfirmLoading(false);
      setOpenModal(false);
      refresh();
    }
    setConfirmLoading(false);
    setOpenModal(false);
    refresh();
  };

  // 模态框取消处理函数
  const handleModalCancel = () => {
    setConfirmLoading(false);
    setOpenModal(false);
    setCurrentLlmProvider(null);
  };

  // 渲染页面内容
  return (
    <PageContainer>
      {/* 搜索表单 */}
      <Form
        form={form}
        style={{
          background: '#fff',
          height: 64,
          paddingTop: 16,
          marginBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <Row gutter={24}>
          <Col span={4}>
            {/* 新建提供商按钮 */}
            <Button
              type="primary"
              onClick={onShowDrawer}
            >
              {t('llmProvider.create')}
            </Button>
          </Col>
          <Col span={20} style={{ textAlign: 'right' }}>
            {/* 刷新按钮 */}
            <Button
              icon={<RedoOutlined />}
              onClick={refresh}
            />
          </Col>
        </Row>
      </Form>
      {/* 提供商列表表格 */}
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      {/* 编辑/新建提供商抽屉 */}
      <Drawer
        title={t(currentLlmProvider ? "llmProvider.edit" : "llmProvider.create")}
        placement="right"
        width={660}
        onClose={handleDrawerCancel}
        open={openDrawer}
        extra={
          <Space>
            <Button onClick={handleDrawerCancel}>{t('misc.cancel')}</Button>
            <Button type="primary" onClick={handleDrawerOK}>
              {t('misc.confirm')}
            </Button>
          </Space>
        }
      >
        <ProviderForm ref={formRef} value={currentLlmProvider} />
      </Drawer>
      {/* 删除提供商模态框 */}
      <Modal
        title={<div><ExclamationCircleOutlined style={{ color: '#ffde5c', marginRight: 8 }} />{t('misc.delete')}</div>}
        open={openModal}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
        cancelText={t('misc.cancel')}
        okText={t('misc.confirm')}
      >
        <p>
          <Trans t={t} i18nKey="llmProvider.deleteConfirmation">
            确定删除 <span style={{ color: '#0070cc' }}>{{ currentLlmProviderName: (currentLlmProvider && currentLlmProvider.name) || '' }}</span> 吗？
          </Trans>
        </p>
      </Modal>
    </PageContainer>
  );
};

export default LlmProviderList;
