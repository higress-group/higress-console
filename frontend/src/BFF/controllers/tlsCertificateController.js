const { proxyRequest } = require('../utils/proxy');

// 获取TLS证书列表
exports.getTlsCertificates = async (req, res) => {
  try {
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      '/v1/tls-certificates',
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
    console.error('[BFF] 获取TLS证书列表错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 添加TLS证书
exports.addTlsCertificate = async (req, res) => {
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
      '/v1/tls-certificates',
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
    console.error('[BFF] 添加TLS证书错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 删除TLS证书
exports.deleteTlsCertificate = async (req, res) => {
  try {
    // 获取对应证书的name
    const { name } = req.params;
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      `/v1/tls-certificates/${name}`,
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
    console.error('[BFF] 删除TLS证书错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 更新TLS证书
exports.updateTlsCertificate = async (req, res) => {
  try {
    // 获取对应证书的name
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
      `/v1/tls-certificates/${name}`,
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
    console.error('[BFF] 更新TLS证书错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};
