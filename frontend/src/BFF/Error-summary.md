# BFF 问题修复总结

## Express路由匹配顺序问题

### 问题描述
多个接口返回404错误，但服务器运行正常：
- 批量导出接口 `/bff/v1/routes/batch-export`
- MCP消费者列表接口 `/bff/v1/mcpServer/consumers`

### 根本原因
**Express路由匹配顺序问题**：
- 参数化路径（如 `/:name`、`/:routeName`）在具体路径（如 `/consumers`、`/batch-export`）之前定义
- Express按顺序匹配，将具体路径当作参数处理
- 请求被错误路由到参数化路径的控制器函数

### 解决方案
调整路由定义顺序，将**具体路径放在参数化路径之前**：

**route.js 修复**：
```javascript
// 修改前
router.get('/v1/routes/:routeName', routeController.getGatewayRouteDetail);
router.get('/v1/routes/batch-export', routeController.batchExportRoutes);

// 修改后
router.get('/v1/routes/batch-export', routeController.batchExportRoutes);
router.get('/v1/routes/:routeName', routeController.getGatewayRouteDetail);
```

### 关键原则
- **具体路径必须在参数化路径之前定义**
- Express路由匹配遵循"先匹配先处理"原则
- 避免参数化路由误匹配具体路径

## 响应拦截器数据截断问题

### 问题描述
批量导入接口返回完整响应数据，但前端只能获取到 `data` 字段，无法获取 `code` 和 `msg` 字段：
- 后端返回：`{ code: 200, msg: '批量导入完成', data: {...} }`
- 前端接收：只有 `data` 字段内容

### 根本原因
**响应拦截器数据截断问题**：
- `bffRequest.tsx` 中的响应拦截器检测到 `data.data` 结构时，只返回 `data.data` 部分
- 丢失了外层的 `code` 和 `msg` 字段
- 导致前端无法正确判断请求成功或失败状态

### 解决方案
修改响应拦截器，为特定接口添加特殊处理：

**bffRequest.tsx 修复**：
```javascript
// 修改前
if (data && data.data) {
  return Promise.resolve(data.data); // 只返回 data.data
}

// 修改后
// 对于批量导入等需要完整响应的接口，返回完整的 data 对象
if (data && data.data && (config.url?.includes('/batch-import') || config.url?.includes('/batch-export'))) {
  return Promise.resolve(data); // 返回完整的响应数据
}
if (data && data.data) {
  return Promise.resolve(data.data);
}
```


