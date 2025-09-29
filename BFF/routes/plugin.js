// plugin.js对应plugin.ts
// 引入express
const express = require('express');
// 创建路由
const router = express.Router();
// 引入pluginController
const pluginController = require('../controllers/pluginController');

// ==================== 插件管理相关接口 ====================

// WASM插件管理
// 获取全局的插件配置列表
router.get('/v1/wasm-plugins', pluginController.getWasmPlugins);

// 获取全局的指定插件配置
router.get('/v1/global/plugin-instances/:pluginName', pluginController.getPluginsDetail);

// 创建WASM插件
router.post('/v1/wasm-plugins', pluginController.createWasmPlugin);

// 更新WASM插件
router.put('/v1/wasm-plugins/:name', pluginController.updateWasmPlugin);

// 删除WASM插件
router.delete('/v1/wasm-plugins/:name', pluginController.deleteWasmPlugin);

// 获取指定插件的运行时配置数据格式
router.get('/v1/wasm-plugins/:name/config', pluginController.getWasmPluginsConfig);

// 全局插件配置
// 获取全局的指定插件配置
router.get('/v1/global/plugin-instances/:pluginName', pluginController.getGlobalPluginInstance);

// 修改全局的指定插件配置
router.put('/v1/global/plugin-instances/:pluginName', pluginController.updateGlobalPluginInstance);

// 路由插件配置
// 获取指定路由的插件配置列表
router.get('/v1/routes/:name/plugin-instances', pluginController.getRoutePluginInstances);

// 获取指定路由的指定插件配置
router.get('/v1/routes/:name/plugin-instances/:pluginName', pluginController.getRoutePluginInstance);

// 修改指定路由的指定插件配置
router.put('/v1/routes/:name/plugin-instances/:pluginName', pluginController.updateRoutePluginInstance);

// 域名插件配置
// 获取指定域名的插件配置列表
router.get('/v1/domains/:name/plugin-instances', pluginController.getDomainPluginInstances);

// 获取指定域名的指定插件配置
router.get('/v1/domains/:name/plugin-instances/:pluginName', pluginController.getDomainPluginInstance);

// 修改指定域名的指定插件配置
router.put('/v1/domains/:name/plugin-instances/:pluginName', pluginController.updateDomainPluginInstance);

// 导出路由
module.exports = router;
