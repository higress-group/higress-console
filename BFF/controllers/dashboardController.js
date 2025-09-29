const { proxyRequest } = require('../utils/proxy');

// 获取仪表板信息
exports.getDashboardInfo = async (req, res) => {
  try {
    const { type } = req.query;
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const queryString = type ? `?type=${encodeURIComponent(type)}` : '';
    const result = await proxyRequest(
      `/dashboard/info${queryString}`,
      'GET',
      forwardHeaders,
      '',
    );

    // 直接返回后端返回的数据，不做任何处理（包括响应头和数据）
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] 获取仪表板信息错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 初始化仪表板
exports.initDashboard = async (req, res) => {
  try {
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      '/dashboard/init',
      'GET',
      forwardHeaders,
      '',
    );

    // 直接返回后端返回的数据，不做任何处理（包括响应头和数据）
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] 初始化仪表板错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 设置仪表板URL
exports.setDashboardUrl = async (req, res) => {
  try {
    const body = JSON.stringify(req.body);
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body), // 使用Buffer.byteLength更准确
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      '/dashboard/info',
      'PUT',
      forwardHeaders,
      body,
    );

    // 直接返回后端返回的数据，不做任何处理（包括响应头和数据）
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] 设置仪表板URL错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 获取仪表板配置数据
exports.getDashboardConfigData = async (req, res) => {
  try {
    const { dataSourceUid, type } = req.query;
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    // 构建查询字符串
    const queryParams = [];
    if (dataSourceUid) queryParams.push(`dataSourceUid=${encodeURIComponent(dataSourceUid)}`);
    if (type) queryParams.push(`type=${encodeURIComponent(type)}`);
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    const result = await proxyRequest(
      `/dashboard/configData${queryString}`,
      'GET',
      forwardHeaders,
      '',
    );

    // 直接返回后端返回的数据，不做任何处理（包括响应头和数据）
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] 获取仪表板配置数据错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};
