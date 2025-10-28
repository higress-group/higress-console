const { proxyRequest } = require('../utils/proxy');

// Get gateway routes list
exports.getGatewayRoutes = async (req, res) => {
  try {
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/v1/routes',
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
    console.error('[BFF] Failed to get gateway routes:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Get specified route details
exports.getGatewayRouteDetail = async (req, res) => {
  try {
    const { routeName } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/routes/${routeName}`,
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
    console.error('[BFF] Failed to get route details:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Add gateway route
exports.addGatewayRoute = async (req, res) => {
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
      '/v1/routes',
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
    console.error('[BFF] Failed to add gateway route:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Delete gateway route
exports.deleteGatewayRoute = async (req, res) => {
  try {
    const { name } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/routes/${name}`,
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
    console.error('[BFF] Failed to delete gateway route:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Edit gateway route
exports.updateGatewayRoute = async (req, res) => {
  try {
    const { name } = req.params;
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      Cookie: headers['cookie'] || '', // Forward browser Cookie header directly
    };

    const result = await proxyRequest(
      `/v1/routes/${name}`,
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
    console.error('[BFF] Failed to update gateway route:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Update route configuration
exports.updateRouteConfig = async (req, res) => {
  try {
    const { name } = req.params;
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/routes/${name}`,
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
    console.error('[BFF] Failed to update route config:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Batch import routes
exports.batchImportRoutes = async (req, res) => {
  try {
    const multer = require('multer');
    const upload = multer({ storage: multer.memoryStorage() });

    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('[BFF] File upload error:', err);
        return res.status(400).json({ code: 400, msg: 'File upload failed' });
      }

      if (!req.file) {
        return res.status(400).json({ code: 400, msg: 'Please select a file to upload' });
      }

      try {
        // Parse JSON file
        const fileContent = req.file.buffer.toString('utf8');
        const routes = JSON.parse(fileContent);

        if (!Array.isArray(routes)) {
          return res.status(400).json({ code: 400, msg: 'Invalid file format, please upload a JSON file containing route array' });
        }

        const { headers } = req;
        const forwardHeaders = {
          Connection: 'keep-alive',
          Cookie: headers['cookie'] || '',
        };

        const results = [];
        const errors = [];

        // Create routes one by one
        for (let i = 0; i < routes.length; i++) {
          const route = routes[i];
          try {
            const body = JSON.stringify(route);
            const routeHeaders = {
              ...forwardHeaders,
              'Content-Type': 'application/json',
              'Content-Length': body.length,
            };

            const result = await proxyRequest(
              '/v1/routes',
              'POST',
              routeHeaders,
              body,
            );

            if (result.statusCode >= 200 && result.statusCode < 300) {
              results.push({ index: i, name: route.name, status: 'success' });
            } else {
              errors.push({ index: i, name: route.name, error: 'Creation failed' });
            }
          } catch (error) {
            errors.push({ index: i, name: route.name, error: error.message });
          }
        }

        res.json({
          code: 200,
          msg: 'Batch import completed',
          data: {
            total: routes.length,
            success: results.length,
            failed: errors.length,
            results,
            errors,
          },
        });
      } catch (parseError) {
        console.error('[BFF] JSON parsing error:', parseError);
        res.status(400).json({ code: 400, msg: 'Invalid file format, please upload a valid JSON file' });
      }
    });
  } catch (err) {
    console.error('[BFF] Batch import routes error:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Batch export routes
exports.batchExportRoutes = async (req, res) => {
  try {
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/v1/routes',
      'GET',
      forwardHeaders,
      '',
    );

    if (result.statusCode >= 200 && result.statusCode < 300) {
      const routes = JSON.parse(result.data);
      const exportData = JSON.stringify(routes, null, 2);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=routes-export.json');
      res.send(exportData);
    } else {
      res.status(result.statusCode).json({ code: result.statusCode, msg: 'Failed to get route list' });
    }
  } catch (err) {
    console.error('[BFF] Batch export routes error:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Export route template
exports.exportRouteTemplate = async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');

    const templatePath = path.join(__dirname, '../../public/template.md');

    if (fs.existsSync(templatePath)) {
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', 'attachment; filename=route-template.md');
      res.send(templateContent);
    } else {
      res.status(404).json({ code: 404, msg: 'Template file not found' });
    }
  } catch (err) {
    console.error('[BFF] Export route template error:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Dubbo协议转换相关接口
exports.createDubboConfig = async (req, res) => {
  try {
    const { routeName } = req.params;
    const dubboConfig = req.body;

    // 生成Http2Rpc配置文件
    const http2rpcConfig = generateHttp2RpcConfig(routeName, dubboConfig);

    // 使用 kubectl 从标准输入部署配置，避免使用本地临时文件
    const { spawn } = require('child_process');
    const kubectl = spawn('kubectl', ['apply', '-f', '-']);

    let stderr = '';
    kubectl.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    kubectl.on('close', (code) => {
      if (code !== 0) {
        console.error('[BFF] kubectl apply error:', stderr);
        return res.status(500).json({ code: 500, msg: 'Failed to deploy Dubbo config' });
      }
      res.json({ code: 200, msg: 'Dubbo config created and deployed successfully' });
    });

    kubectl.stdin.write(http2rpcConfig);
    kubectl.stdin.end();

  } catch (err) {
    console.error('[BFF] Create Dubbo config error:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

exports.updateDubboConfig = async (req, res) => {
  try {
    const { routeName } = req.params;
    const dubboConfig = req.body;

    // 生成Http2Rpc配置文件
    const http2rpcConfig = generateHttp2RpcConfig(routeName, dubboConfig);

    // 使用 kubectl 从标准输入更新配置
    const { spawn } = require('child_process');
    const kubectl = spawn('kubectl', ['apply', '-f', '-']);

    let stderr = '';
    kubectl.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    kubectl.on('close', (code) => {
      if (code !== 0) {
        console.error('[BFF] kubectl apply error:', stderr);
        return res.status(500).json({ code: 500, msg: 'Failed to update Dubbo config' });
      }
      res.json({ code: 200, msg: 'Dubbo config updated successfully' });
    });

    kubectl.stdin.write(http2rpcConfig);
    kubectl.stdin.end();

  } catch (err) {
    console.error('[BFF] Update Dubbo config error:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

exports.deleteDubboConfig = async (req, res) => {
  try {
    const { routeName } = req.params;

    // 使用kubectl删除配置
    const { exec } = require('child_process');
    exec(`kubectl delete Http2Rpc ${getResourceNameFromTemplate()} -n ${getNamespaceFromTemplate()}`, (error, stdout, stderr) => {
      if (error) {
        console.error('[BFF] kubectl delete error:', error);
        res.status(500).json({ code: 500, msg: 'Failed to delete Dubbo config' });
        return;
      }

      console.log('[BFF] kubectl delete success:', stdout);
      res.json({ code: 200, msg: 'Dubbo config deleted successfully' });
    });

  } catch (err) {
    console.error('[BFF] Delete Dubbo config error:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// 从前端模板读取命名空间和资源名称（若失败则回落到默认值）
function getNamespaceFromTemplate() {
  try {
    const fs = require('fs');
    const path = require('path');
    const templatePath = path.join(__dirname, '../../frontend/public/http2rpc-config.yaml');
    if (fs.existsSync(templatePath)) {
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const nsMatch = templateContent.match(/\n\s*namespace:\s*([^\n\s#]+)/);
      if (nsMatch && nsMatch[1]) {
        return nsMatch[1];
      }
    }
  } catch (e) {
    // ignore
  }
  return 'higress-system';
}

function getResourceNameFromTemplate() {
  try {
    const fs = require('fs');
    const path = require('path');
    const templatePath = path.join(__dirname, '../../frontend/public/http2rpc-config.yaml');
    if (fs.existsSync(templatePath)) {
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const nameMatch = templateContent.match(/\n\s*name:\s*([^\n\s#]+)/);
      if (nameMatch && nameMatch[1]) {
        return nameMatch[1];
      }
    }
  } catch (e) {
    // ignore
  }
  return 'httproute-http2rpc';
}

// 生成Http2Rpc配置文件的辅助函数
function generateHttp2RpcConfig(routeName, dubboConfig) {
  // 检查dubboConfig和methods是否存在
  if (!dubboConfig || !dubboConfig.methods || !Array.isArray(dubboConfig.methods)) {
    throw new Error('Invalid dubbo config: methods array is required');
  }

  const methods = dubboConfig.methods.map(method => {
    let methodConfig = `    - serviceMethod: ${method.serviceMethod}
      headersAttach: "${method.headersAttach || '*'}"
      httpMethods:
      - "${method.httpMethod}"
      httpPath: "${method.httpPath}"`;

    if (method.paramType === 'params') {
      methodConfig += `
      params:
      - paramKey: ${method.paramKey || 'p'}
        paramSource: ${method.paramSource || 'QUERY'}
        paramType: "${method.paramTypeValue || 'java.lang.String'}"`;
    } else {
      methodConfig += `
      paramFromEntireBody:
        paramType: "${method.paramTypeValue || 'java.lang.String'}"`;
    }

    return methodConfig;
  }).join('\n');

  return `apiVersion: networking.higress.io/v1
kind: Http2Rpc
metadata:
  name: ${getResourceNameFromTemplate()}
  namespace: ${getNamespaceFromTemplate()}
spec:
  dubbo:
    service: ${dubboConfig.serviceInterface}
    version: 1.0.0
    group: ${dubboConfig.serviceGroup}
    methods:
${methods}`;
}