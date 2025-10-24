// llm-provider.js对应llm-provider.ts
// 引入express
const express = require('express');
// 创建路由
const router = express.Router();
// 引入llmProviderController
const llmProviderController = require('../controllers/llmProviderController');

// ==================== LLM Provider管理相关接口 ====================

// 获取LLM Provider列表
router.get('/v1/ai/providers', llmProviderController.getLlmProviders);

// 添加LLM Provider
router.post('/v1/ai/providers', llmProviderController.addLlmProvider);

// 删除LLM Provider
router.delete('/v1/ai/providers/:name', llmProviderController.deleteLlmProvider);

// 更新LLM Provider
router.put('/v1/ai/providers/:name', llmProviderController.updateLlmProvider);

// 导出路由
module.exports = router;
