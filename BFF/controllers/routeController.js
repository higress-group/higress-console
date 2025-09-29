const { proxyRequest } = require('../utils/proxy');

// 获取网关路由列表
exports.getGatewayRoutes = async (req, res) => {
  try {
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      '/v1/routes',
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
    console.error('[BFF] 获取网关路由列表错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 获取指定路由详情
exports.getGatewayRouteDetail = async (req, res) => {
  try {
    const { routeName } = req.params;
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      `/v1/routes/${routeName}`,
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
    console.error('[BFF] 获取路由详情错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 添加网关路由
exports.addGatewayRoute = async (req, res) => {
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
      '/v1/routes',
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
    console.error('[BFF] 添加网关路由错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 删除网关路由
exports.deleteGatewayRoute = async (req, res) => {
  try {
    const { name } = req.params;
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      `/v1/routes/${name}`,
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
    console.error('[BFF] 删除网关路由错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 编辑网关路由
exports.updateGatewayRoute = async (req, res) => {
  try {
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
      `/v1/routes/${name}`,
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
    console.error('[BFF] 更新网关路由错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 更新路由配置
exports.updateRouteConfig = async (req, res) => {
  try {
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
      `/v1/routes/${name}`,
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
    console.error('[BFF] 更新路由配置错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 批量导入路由
exports.batchImportRoutes = async (req, res) => {
  try {
    const multer = require('multer');
    const upload = multer({ storage: multer.memoryStorage() });

    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('[BFF] 文件上传错误:', err);
        return res.status(400).json({ code: 400, msg: '文件上传失败' });
      }

      if (!req.file) {
        return res.status(400).json({ code: 400, msg: '请选择要上传的文件' });
      }

      try {
        // 解析JSON文件
        const fileContent = req.file.buffer.toString('utf8');
        const routes = JSON.parse(fileContent);

        if (!Array.isArray(routes)) {
          return res.status(400).json({ code: 400, msg: '文件格式错误，请上传包含路由数组的JSON文件' });
        }

        const { headers } = req;
        const forwardHeaders = {
          Connection: 'keep-alive',
          Cookie: headers['cookie'] || '',
        };

        const results = [];
        const errors = [];

        // 逐个创建路由
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
              errors.push({ index: i, name: route.name, error: '创建失败' });
            }
          } catch (error) {
            errors.push({ index: i, name: route.name, error: error.message });
          }
        }

        res.json({
          code: 200,
          msg: '批量导入完成',
          data: {
            total: routes.length,
            success: results.length,
            failed: errors.length,
            results,
            errors,
          },
        });
      } catch (parseError) {
        console.error('[BFF] JSON解析错误:', parseError);
        res.status(400).json({ code: 400, msg: '文件格式错误，请上传有效的JSON文件' });
      }
    });
  } catch (err) {
    console.error('[BFF] 批量导入路由错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 批量导出路由
exports.batchExportRoutes = async (req, res) => {
  try {
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    // 获取所有路由
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
      res.status(result.statusCode).json({ code: result.statusCode, msg: '获取路由列表失败' });
    }
  } catch (err) {
    console.error('[BFF] 批量导出路由错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 导出路由模板
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
      res.status(404).json({ code: 404, msg: '模板文件不存在' });
    }
  } catch (err) {
    console.error('[BFF] 导出路由模板错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};