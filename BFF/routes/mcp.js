// mcp.js corresponds to mcp.ts
const express = require('express');
const router = express.Router();
// Import mcpController
const mcpController = require('../controllers/mcpController');

// ==================== Interfaces related to MCP server management ====================

// Get MCP server list
router.get('/v1/mcpServer', mcpController.listMcpServers);

// Get specified MCP server
router.get('/v1/mcpServer/:name', mcpController.getMcpServer);

// Create or update MCP server
router.post('/v1/mcpServer', mcpController.createOrUpdateMcpServer);
router.put('/v1/mcpServer', mcpController.createOrUpdateMcpServer);

// Delete MCP server
router.delete('/v1/mcpServer/:name', mcpController.deleteMcpServer);

// ==================== Interfaces related to MCP consumer management ====================

// Add MCP consumer
router.put('/v1/mcpServer/consumers', mcpController.addMcpConsumers);

// Remove MCP consumer
router.delete('/v1/mcpServer/consumers', mcpController.removeMcpConsumers);

// Get MCP consumer list
router.get('/v1/mcpServer/consumers', mcpController.listMcpConsumers);

// ==================== Interfaces related to Swagger conversion ====================

// Swagger to MCP configuration
router.post('/v1/mcpServer/swaggerToMcpConfig', mcpController.swaggerToMcpConfig);

module.exports = router;
