const { proxyRequest } = require('../utils/proxy');

// Get system configuration information
exports.getSystemInfo = async (req, res) => {
  try {
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/system/info',
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
    console.error('[BFF] Failed to get system info:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Get system configuration
exports.getConfig = async (req, res) => {
  try {
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/system/config',
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
    console.error('[BFF] Failed to get system config:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Get higress configuration
exports.getHigressConfig = async (req, res) => {
  try {
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };
    const result = await proxyRequest(
      '/system/higress-config',
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
    console.error('[BFF] Failed to get higress config:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Update higress configuration
exports.updateHigressConfig = async (req, res) => {
  console.log('Content-Length', req.body);
  try {
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/system/higress-config',
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
    console.error('[BFF] Failed to update higress config:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};


// Initialize system
exports.initialize = async (req, res) => {
  try {
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/system/init',
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
    console.error('[BFF] Failed to initialize system:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};
