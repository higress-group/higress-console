import dataSourceUidSampleImage from '@/assets/GrafanaDataSourceUID.png';
import { Mode } from '@/interfaces/config';
import { getDashboardConfigData, getDashboardInfo, initDashboard, setDashboardUrl } from '@/services';
import store from '@/store';
import { useRequest } from 'ahooks';
import { Button, Col, Collapse, Form, Image, Input, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './index.module.css';

const { Panel } = Collapse;

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [reconfiguring, setReconfiguring] = useState(false);
  const [dataSourceUidSampleVisible, setDataSourceUidSampleVisible] = useState(false);
  const [mode, setMode] = useState<string>(Mode.K8S);

  const { data: dashboardInfo, error, loading } = useRequest(getDashboardInfo);

  const [configModel] = store.useModel('config');
  useEffect(() => {
    const properties = configModel ? configModel.properties : {};
    setMode(properties.mode || Mode.K8S);
  }, [configModel]);

  if (loading) {
    return (
      <div style={{ width: '100%', height: '50vh', flex: 1 }}>
        <Spin />
      </div>
    );
  }

  if (!dashboardInfo || error) {
    return (
      <div style={{ width: '100%', height: '50vh', flex: 1, textAlign: 'center' }}>
        <h1>{t('dashboard.loadFailed')}</h1>
      </div>
    );
  }

  if (dashboardInfo.url && !reconfiguring) {
    const frameUrl = dashboardInfo.builtIn ? location.origin + dashboardInfo.url : dashboardInfo.url;
    const reconfigure = () => {
      if (dashboardInfo.builtIn) {
        return;
      }
      form.resetFields();
      form.setFieldValue('url', dashboardInfo.url);
      setReconfiguring(true);
    };
    return (
      <>
        <Row gutter={24} style={{ marginBottom: '0.5rem' }}>
          <Col span={4}>
            {
              !dashboardInfo.builtIn && (
                <Button type="primary" onClick={reconfigure}>
                  {t('dashboard.reconfigure')}
                </Button>
              )
            }
          </Col>
          <Col span={16} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <a href={frameUrl} target="_blank">{t('dashboard.openInNewPage')}</a>
          </Col>
        </Row>
        <iframe style={{ width: '100%', height: '100vh', border: 0, flex: 1 }} src={frameUrl} />
      </>
    )
  }

  if (dashboardInfo.builtIn) {
    const handleInitDashboard = async () => {
      await initDashboard();
      location.reload();
    };
    return (
      <div style={{ width: '100%', height: '50vh', flex: 1, textAlign: 'center' }}>
        <h1>{t('dashboard.uninitialized')}</h1>
        <Button type="primary" onClick={() => handleInitDashboard()}>
          {t('dashboard.initDashboard')}
        </Button>
      </div>
    );
  } else {
    const handleSetDashboard = async () => {
      const values = await form.validateFields();
      await setDashboardUrl(values.url);
      location.reload();
    };
    const downloadConfigFile = async ({ dataSourceUid }) => {
      if (!dataSourceUid) {
        return;
      }

      const data = await getDashboardConfigData(dataSourceUid);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'higress-dashboard.json';
      link.href = url;
      link.onclick = () => setTimeout(() => URL.revokeObjectURL(url), 1500);
      link.click();
      link.remove();
    };


    if (mode === Mode.K8S) {
      return (
        <>
          <Form form={form} layout="vertical">
            <h3>{t('dashboard.noBuiltInDashboard')}</h3>
            <Form.Item
              label={t('dashboard.setForm.url')}
              required
              name="url"
              rules={[
                {
                  required: true,
                  message: t('dashboard.setForm.urlRequired'),
                },
              ]}
            >
              <Input showCount allowClear maxLength={256} type="url" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSetDashboard}>
                {t('misc.confirm')}
              </Button>
            </Form.Item>
          </Form>
          <Collapse defaultActiveKey="note">
            <Panel header={t('dashboard.configNotes.header')} key="note">
              <p>{t('dashboard.configNotes.brief')}</p>
              <ol style={{ marginBottom: '0' }}>
                <li style={{ marginBottom: '1rem' }}>
                  {t('dashboard.configNotes.item1_k8s')}
                  <pre className={`${styles.mb0}`}>
                    - regex: &apos;__meta_kubernetes_pod_label_(.+)&apos;<br />
                    &nbsp;&nbsp;replacement: &apos;$1&apos;<br />
                    &nbsp;&nbsp;action: labelmap
                  </pre>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  {t('dashboard.configNotes.item2')}
                  <ul>
                    <li>
                      {t('dashboard.configNotes.item2_1')}
                      <pre className={`${styles.mb0}`}>
                        [security]<br />
                        cookie_secure=true<br />
                        cookie_samesite=none<br />
                        allow_embedding=true
                      </pre>
                    </li>
                    <li>
                      {t('dashboard.configNotes.tem2_2')}
                      <pre className={`${styles.mb0}`}>
                        GF_SECURITY_COOKIE_SECURE=true<br />
                        GF_SECURITY_COOKIE_SAMESITE=none<br />
                        GF_SECURITY_ALLOW_EMBEDDING=true
                      </pre>
                    </li>
                  </ul>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <Trans t={t} i18nKey="dashboard.configNotes.item3">
                    推荐各位使用 Higress 官方提供的 Grafana 看板配置。您可填写 Grafana 中的 Prometheus 数据源 ID 获取可供导入的 JSON 配置文件。
                    （<a href="" onClick={e => { e.preventDefault(); setDataSourceUidSampleVisible(true); }}>如何获取数据源 ID？</a>）
                  </Trans>
                  <Form
                    style={{ marginTop: '0.5rem' }}
                    layout="inline"
                    onFinish={downloadConfigFile}
                  >
                    <Form.Item
                      name="dataSourceUid"
                      label={t('dashboard.configNotes.item3_dataSourceId')}
                      rules={[
                        {
                          required: true,
                          message: t('dashboard.configNotes.item3_dataSourceId_required'),
                        },
                      ]}
                    >
                      <Input type="text" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">{t('dashboard.configNotes.k8s.item3_download')}</Button>
                    </Form.Item>
                  </Form>
                  <Image
                    width={200}
                    style={{ display: 'none' }}
                    preview={{
                      visible: dataSourceUidSampleVisible,
                      src: dataSourceUidSampleImage,
                      onVisibleChange: value => {
                        setDataSourceUidSampleVisible(value);
                      },
                    }}
                  />
                </li>
                <li>{t('dashboard.configNotes.k8s.item4')}</li>
              </ol>
            </Panel>
          </Collapse>
        </>
      );
    } else {
      return (
        <>
          <Form form={form} layout="vertical">
            <h3>{t('dashboard.configureDashboard')}</h3>
            <Form.Item
              label={t('dashboard.setForm.url')}
              required
              name="url"
              rules={[
                {
                  required: true,
                  message: t('dashboard.setForm.urlRequired'),
                },
              ]}
            >
              <Input showCount allowClear maxLength={256} type="url" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSetDashboard}>
                {t('misc.confirm')}
              </Button>
            </Form.Item>
          </Form>
          <Collapse defaultActiveKey="note">
            <Panel header={t('dashboard.configNotes.header')} key="note">
              <p>{t('dashboard.configNotes.brief')}</p>
              <ol style={{ marginBottom: '0' }}>
                <li style={{ marginBottom: '1rem' }}>
                  {t('dashboard.configNotes.item1_standalone')}
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  {t('dashboard.configNotes.item2')}
                  <ul>
                    <li>
                      {t('dashboard.configNotes.item2_1')}
                      <pre className={`${styles.mb0}`}>
                        [security]<br />
                        cookie_secure=true<br />
                        cookie_samesite=none<br />
                        allow_embedding=true
                      </pre>
                    </li>
                    <li>
                      {t('dashboard.configNotes.item2_2')}
                      <pre className={`${styles.mb0}`}>
                        GF_SECURITY_COOKIE_SECURE=true<br />
                        GF_SECURITY_COOKIE_SAMESITE=none<br />
                        GF_SECURITY_ALLOW_EMBEDDING=true
                      </pre>
                    </li>
                  </ul>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <Trans t={t} i18nKey="dashboard.configNotes.item3">
                    推荐各位使用 Higress 官方提供的 Grafana 看板配置。您可填写 Grafana 中的 Prometheus 数据源 ID 获取可供导入的 JSON 配置文件。
                    （<a href="" onClick={e => { e.preventDefault(); setDataSourceUidSampleVisible(true); }}>如何获取数据源 ID？</a>）
                  </Trans>
                  <Form
                    style={{ marginTop: '0.5rem' }}
                    layout="inline"
                    onFinish={downloadConfigFile}
                  >
                    <Form.Item
                      name="dataSourceUid"
                      label={t('dashboard.configNotes.item3_dataSourceId')}
                      rules={[
                        {
                          required: true,
                          message: t('dashboard.configNotes.item3_dataSourceId_required'),
                        },
                      ]}
                    >
                      <Input type="text" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">{t('dashboard.configNotes.item3_download')}</Button>
                    </Form.Item>
                  </Form>
                  <Image
                    width={200}
                    style={{ display: 'none' }}
                    preview={{
                      visible: dataSourceUidSampleVisible,
                      src: dataSourceUidSampleImage,
                      onVisibleChange: value => {
                        setDataSourceUidSampleVisible(value);
                      },
                    }}
                  />
                </li>
                <li>{t('dashboard.configNotes.item4')}</li>
              </ol>
            </Panel>
          </Collapse>
        </>
      );
    }
  }
};

export default Dashboard;
