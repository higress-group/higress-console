const { proxyRequest } = require('../utils/proxy');

// 登录接口逻辑
exports.login = async (req, res) => {
  // 这里需要调用后端服务，并返回后端服务的结果
  try {
    const body = JSON.stringify(req.body);
    const { headers } = req;
    // 只保留必要的头部，主要转发Cookie
    const forwardHeaders = {
      Cookie: headers['cookie'] || '',
      'Content-Type': 'application/json',
    };
    const result = await proxyRequest(
      '/session/login',
      'POST',
      forwardHeaders,
      body,
    );

    // 设置后端返回的所有响应头（将后端响应头直接设置到BFF响应头）
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] 登录接口错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 登出接口逻辑
exports.logout = async (req, res) => {
  try {
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      '/session/logout',
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
    console.error('[BFF] 登出接口错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 获取用户信息接口逻辑
exports.getUserInfo = async (req, res) => {
  try {
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      '/user/info',
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
    console.error('[BFF] 获取用户信息接口错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};


// 修改密码接口逻辑
exports.changePassword = async (req, res) => {
  try {
    const body = JSON.stringify(req.body);
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
      'Content-Type': 'application/json',
      'Content-Length': body.length,
    };

    const result = await proxyRequest(
      '/user/changePassword',
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
    console.error('[BFF] 修改密码接口错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};
