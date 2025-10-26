const { proxyRequest } = require('../utils/proxy');

// Login interface logic
exports.login = async (req, res) => {
  try {
    const body = JSON.stringify(req.body);
    const { headers } = req;
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

    // Set all response headers returned by backend (set backend response headers directly to BFF response headers)
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] Login interface error:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Logout interface logic
exports.logout = async (req, res) => {
  try {
    const { headers } = req;
    const forwardHeaders = {
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/session/logout',
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
    console.error('[BFF] Logout interface error:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Get user information interface logic
exports.getUserInfo = async (req, res) => {
  try {
    const { headers } = req;
    const forwardHeaders = {
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/user/info',
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
    console.error('[BFF] Failed to get user info:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};


// Change password interface logic
exports.changePassword = async (req, res) => {
  try {
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Cookie: headers['cookie'] || '',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
    };

    const result = await proxyRequest(
      '/user/changePassword',
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
    console.error('[BFF] Failed to change password:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};
