const { proxyRequest } = require('../utils/proxy');

// Get gateway domains list
exports.getGatewayDomains = async (req, res) => {
  try {
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/v1/domains',
      'GET',
      forwardHeaders,
      '',
    );

    // Directly return the data returned by the backend without any processing (including response headers and data)
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] Failed to get gateway domains list:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Add gateway domain
exports.addGatewayDomain = async (req, res) => {
  try {
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/v1/domains',
      'POST',
      forwardHeaders,
      body,
    );

    // Directly return the data returned by the backend without any processing (including response headers and data)
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] Failed to add gateway domain:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Delete gateway domain
exports.deleteGatewayDomain = async (req, res) => {
  try {
    const { name } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/domains/${name}`,
      'DELETE',
      forwardHeaders,
      '',
    );

    // Directly return the data returned by the backend without any processing (including response headers and data)
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] Failed to delete gateway domain:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Update gateway domain
exports.updateGatewayDomain = async (req, res) => {
  try {
    const { name } = req.params;
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/domains/${name}`,
      'PUT',
      forwardHeaders,
      body,
    );

    // Directly return the data returned by the backend without any processing (including response headers and data)
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] Failed to update gateway domain:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};
