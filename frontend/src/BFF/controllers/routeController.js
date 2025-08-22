const { proxyRequest } = require('../utils/proxy');

// 获取网关路由列表
exports.getGatewayRoutes = async (req, res) => {
  try {
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      '/v1/routes',
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
    console.error('[BFF] 获取网关路由列表错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 获取指定路由详情
exports.getGatewayRouteDetail = async (req, res) => {
  try {
    const { routeName } = req.params;
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      `/v1/routes/${routeName}`,
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
    console.error('[BFF] 获取路由详情错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 添加网关路由
exports.addGatewayRoute = async (req, res) => {
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
      '/v1/routes',
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
    console.error('[BFF] 添加网关路由错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 删除网关路由
exports.deleteGatewayRoute = async (req, res) => {
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
      `/v1/routes/${name}`,
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
    console.error('[BFF] 删除网关路由错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 编辑网关路由
exports.updateGatewayRoute = async (req, res) => {
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
      `/v1/routes/${name}`,
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
    console.error('[BFF] 更新网关路由错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 更新路由配置
exports.updateRouteConfig = async (req, res) => {
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
      `/v1/routes/${name}`,
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
    console.error('[BFF] 更新路由配置错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};
