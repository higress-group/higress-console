const { proxyRequest } = require('../utils/proxy');

// ==================== WASM Plugin Management ====================

// Get global plugin configuration list
exports.getWasmPlugins = async (req, res) => {
  try {
    const { lang } = req.query;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const queryString = lang ? `?lang=${lang}` : '';
    const result = await proxyRequest(
      `/v1/wasm-plugins${queryString}`,
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
    console.error('[BFF] Failed to get WASM plugins list:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Get global specified plugin configuration
exports.getPluginsDetail = async (req, res) => {
  try {
    const { pluginName } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/global/plugin-instances/${pluginName}`,
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
    console.error('[BFF] Failed to get plugin details:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Create WASM plugin
exports.createWasmPlugin = async (req, res) => {
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
      '/v1/wasm-plugins',
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
    console.error('[BFF] Failed to create WASM plugin:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Update WASM plugin
exports.updateWasmPlugin = async (req, res) => {
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
      `/v1/wasm-plugins/${name}`,
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
    console.error('[BFF] Failed to update WASM plugin:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Delete WASM plugin
exports.deleteWasmPlugin = async (req, res) => {
  try {
    const { name } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/wasm-plugins/${name}`,
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
    console.error('[BFF] Failed to delete WASM plugin:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Get WASM plugin config
exports.getWasmPluginsConfig = async (req, res) => {
  try {
    const { name } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/wasm-plugins/${name}/config`,
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
    console.error('[BFF] Failed to get WASM plugin config:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// ==================== Global plugin configuration ====================

// Get global specified plugin configuration
exports.getGlobalPluginInstance = async (req, res) => {
  try {
    const { pluginName } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/global/plugin-instances/${pluginName}`,
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
    console.error('[BFF] Failed to get global plugin instances:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Update global plugin instance
exports.updateGlobalPluginInstance = async (req, res) => {
  try {
    const { pluginName } = req.params;
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/global/plugin-instances/${pluginName}`,
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
    console.error('[BFF] Failed to update global plugin instance:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// ==================== Route plugin configuration ====================

// Get route plugin instances list
exports.getRoutePluginInstances = async (req, res) => {
  try {
    const { name } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/routes/${name}/plugin-instances`,
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
    console.error('[BFF] Failed to get route plugin instances list:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Get route plugin instance
exports.getRoutePluginInstance = async (req, res) => {
  try {
    const { name, pluginName } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/routes/${name}/plugin-instances/${pluginName}`,
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
    console.error('[BFF] Failed to get route plugin instance:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Update route plugin instance
exports.updateRoutePluginInstance = async (req, res) => {
  try {
    const { name, pluginName } = req.params;
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/routes/${name}/plugin-instances/${pluginName}`,
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
    console.error('[BFF] Failed to update route plugin instance:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// ==================== Domain plugin configuration ====================

// Get domain plugin instances list
exports.getDomainPluginInstances = async (req, res) => {
  try {
    const { name } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/domains/${name}/plugin-instances`,
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
    console.error('[BFF] Failed to get domain plugin instances list:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Get domain plugin instance
exports.getDomainPluginInstance = async (req, res) => {
  try {
    const { name, pluginName } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/domains/${name}/plugin-instances/${pluginName}`,
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
    console.error('[BFF] Failed to get domain plugin instance:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Update domain plugin instance
exports.updateDomainPluginInstance = async (req, res) => {
  try {
    const { name, pluginName } = req.params;
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/domains/${name}/plugin-instances/${pluginName}`,
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
    console.error('[BFF] Failed to update domain plugin instance:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};
