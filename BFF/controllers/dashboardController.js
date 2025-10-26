const { proxyRequest } = require('../utils/proxy');

// Get dashboard information
exports.getDashboardInfo = async (req, res) => {
  try {
    const { type } = req.query;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const queryString = type ? `?type=${encodeURIComponent(type)}` : '';
    const result = await proxyRequest(
      `/dashboard/info${queryString}`,
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
    console.error('[BFF] Failed to get dashboard info:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Initialize dashboard
exports.initDashboard = async (req, res) => {
  try {
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/dashboard/init',
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
    console.error('[BFF] Failed to initialize dashboard:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Set dashboard URL
exports.setDashboardUrl = async (req, res) => {
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
      '/dashboard/info',
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
    console.error('[BFF] Failed to set dashboard URL:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Get dashboard configuration data
exports.getDashboardConfigData = async (req, res) => {
  try {
    const { dataSourceUid, type } = req.query;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

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

    // Directly return the data returned by the backend without any processing (including response headers and data)
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] Failed to get dashboard config data:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};
