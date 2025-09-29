const { proxyRequest } = require('../utils/proxy');

// 获取服务源列表
exports.getServiceSources = async (req, res) => {
  try {
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      '/v1/service-sources',
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
    console.error('[BFF] 获取服务源列表错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 添加服务源
exports.addServiceSource = async (req, res) => {
  try {
    const body = JSON.stringify(req.body);
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      '/v1/service-sources',
      'POST',
      forwardHeaders,
      body,
    );

    // 直接返回后端返回的数据，不做任何处理（包括响应头和数据）
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] 添加服务源错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 删除服务源
exports.deleteServiceSource = async (req, res) => {
  try {
    const { name } = req.params;
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      `/v1/service-sources/${name}`,
      'DELETE',
      forwardHeaders,
      '',
    );

    // 直接返回后端返回的数据，不做任何处理（包括响应头和数据）
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] 删除服务源错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 更新服务源
exports.updateServiceSource = async (req, res) => {
  try {
    const { name } = req.params;
    const body = JSON.stringify(req.body);
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      `/v1/service-sources/${name}`,
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
    console.error('[BFF] 更新服务源错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};
