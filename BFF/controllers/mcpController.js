const { proxyRequest } = require('../utils/proxy');

// Get MCP server list
exports.listMcpServers = async (req, res) => {
  try {
    const queryParams = [];
    Object.keys(req.query).forEach(key => {
      queryParams.push(`${key}=${encodeURIComponent(req.query[key])}`);
    });
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/mcpServer${queryString}`,
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
    console.error('[BFF] Failed to get MCP server list:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Get specified MCP server
exports.getMcpServer = async (req, res) => {
  try {
    const { name } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/mcpServer/${name}`,
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
    console.error('[BFF] Failed to get MCP server:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Create or update MCP server
exports.createOrUpdateMcpServer = async (req, res) => {
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
      '/v1/mcpServer',
      req.method, // Use original request method (POST or PUT)
      forwardHeaders,
      body,
    );

    // Directly return the data returned by the backend without any processing (including response headers and data)
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] Failed to create or update MCP server:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Delete MCP server
exports.deleteMcpServer = async (req, res) => {
  try {
    const { name } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/mcpServer/${name}`,
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
    console.error('[BFF] Failed to delete MCP server:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// ==================== MCP Consumer Management ====================

// Add MCP consumers
exports.addMcpConsumers = async (req, res) => {
  try {
    console.log(777);
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/v1/mcpServer/consumers',
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
    console.error('[BFF] Failed to add MCP consumers:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Remove MCP consumers
exports.removeMcpConsumers = async (req, res) => {
  try {
    console.log(666);
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/v1/mcpServer/consumers',
      'DELETE',
      forwardHeaders,
      body,
    );

    // Directly return the data returned by the backend without any processing (including response headers and data)
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] Failed to remove MCP consumers:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Get MCP consumers list
exports.listMcpConsumers = async (req, res) => {
  console.log(888);
  try {
    const queryParams = [];
    Object.keys(req.query).forEach(key => {
      queryParams.push(`${key}=${encodeURIComponent(req.query[key])}`);
    });
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };
    const result = await proxyRequest(
      `/v1/mcpServer/consumers${queryString}`,
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
    console.error('[BFF] Failed to get MCP consumers list:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// ==================== Swagger Conversion ====================

// Swagger to MCP configuration
exports.swaggerToMcpConfig = async (req, res) => {
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
      '/v1/mcpServer/swaggerToMcpConfig',
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
    console.error('[BFF] Failed to convert Swagger to MCP config:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};
