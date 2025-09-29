// mcp.js对应mcp.ts
// 引入express
const express = require('express');
// 创建路由
const router = express.Router();
// 引入mcpController
const mcpController = require('../controllers/mcpController');

// ==================== MCP服务器管理相关接口 ====================

// 获取MCP服务器列表
router.get('/v1/mcpServer', mcpController.listMcpServers);

// 获取指定MCP服务器
router.get('/v1/mcpServer/:name', mcpController.getMcpServer);

// 创建或更新MCP服务器
router.post('/v1/mcpServer', mcpController.createOrUpdateMcpServer);
router.put('/v1/mcpServer', mcpController.createOrUpdateMcpServer);

// 删除MCP服务器
router.delete('/v1/mcpServer/:name', mcpController.deleteMcpServer);

// ==================== MCP消费者管理相关接口 ====================

// 添加MCP消费者
router.put('/v1/mcpServer/consumers', mcpController.addMcpConsumers);

// 移除MCP消费者
router.delete('/v1/mcpServer/consumers', mcpController.removeMcpConsumers);

// 获取MCP消费者列表
router.get('/v1/mcpServer/consumers', mcpController.listMcpConsumers);

// ==================== Swagger转换相关接口 ====================

// Swagger转MCP配置
router.post('/v1/mcpServer/swaggerToMcpConfig', mcpController.swaggerToMcpConfig);

// 导出路由
module.exports = router;
