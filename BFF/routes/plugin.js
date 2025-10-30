// plugin.js corresponds to plugin.ts
const express = require('express');
const router = express.Router();
// Import pluginController
const pluginController = require('../controllers/pluginController');

// ==================== Interfaces related to plugin management ====================

// WASM plugin management
// Get global plugin configuration list
router.get('/v1/wasm-plugins', pluginController.getWasmPlugins);

// Get global specified plugin configuration
router.get('/v1/global/plugin-instances/:pluginName', pluginController.getPluginsDetail);

// Create WASM plugin
router.post('/v1/wasm-plugins', pluginController.createWasmPlugin);

// Update WASM plugin
router.put('/v1/wasm-plugins/:name', pluginController.updateWasmPlugin);

// Delete WASM plugin
router.delete('/v1/wasm-plugins/:name', pluginController.deleteWasmPlugin);

// Get runtime configuration data format of specified plugin
router.get('/v1/wasm-plugins/:name/config', pluginController.getWasmPluginsConfig);

// Global plugin configuration
// Get global specified plugin configuration
router.get('/v1/global/plugin-instances/:pluginName', pluginController.getGlobalPluginInstance);

// Update global specified plugin configuration
router.put('/v1/global/plugin-instances/:pluginName', pluginController.updateGlobalPluginInstance);

// Route plugin configuration
// Get specified route plugin configuration list
router.get('/v1/routes/:name/plugin-instances', pluginController.getRoutePluginInstances);

// Get specified route plugin configuration
router.get('/v1/routes/:name/plugin-instances/:pluginName', pluginController.getRoutePluginInstance);

// Update specified route plugin configuration
router.put('/v1/routes/:name/plugin-instances/:pluginName', pluginController.updateRoutePluginInstance);

// Domain plugin configuration
// Get specified domain plugin configuration list
router.get('/v1/domains/:name/plugin-instances', pluginController.getDomainPluginInstances);

// Get specified domain plugin configuration
router.get('/v1/domains/:name/plugin-instances/:pluginName', pluginController.getDomainPluginInstance);

// Update specified domain plugin configuration
router.put('/v1/domains/:name/plugin-instances/:pluginName', pluginController.updateDomainPluginInstance);

module.exports = router;
