const { proxyRequest } = require('../utils/proxy');

// Get consumers list
exports.getConsumers = async (req, res) => {
  try {
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/v1/consumers',
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
    console.error('[BFF] Failed to get consumers list:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Add consumer
exports.addConsumer = async (req, res) => {
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
      '/v1/consumers',
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
    console.error('[BFF] Failed to add consumer:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Delete consumer
exports.deleteConsumer = async (req, res) => {
  try {
    const { name } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/consumers/${name}`,
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
    console.error('[BFF] Failed to delete consumer:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Update consumer
exports.updateConsumer = async (req, res) => {
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
      `/v1/consumers/${name}`,
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
    console.error('[BFF] Failed to update consumer:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};
