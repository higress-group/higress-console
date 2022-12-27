import { Card, Result } from 'antd';

export default function Success() {
  return (
    <Card bordered={false}>
      <Result
        status="403"
        title=""
        subTitle="功能开发中，敬请谅解..."
      />
    </Card>
  );
}