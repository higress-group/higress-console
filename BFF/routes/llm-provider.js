// llm-provider.js corresponds to llm-provider.ts
const express = require('express');
const router = express.Router();
// Import llmProviderController
const llmProviderController = require('../controllers/llmProviderController');

// ==================== Interfaces related to LLM Provider management ====================

// Get LLM Provider list
router.get('/v1/ai/providers', llmProviderController.getLlmProviders);

// Add LLM Provider
router.post('/v1/ai/providers', llmProviderController.addLlmProvider);

// Delete LLM Provider
router.delete('/v1/ai/providers/:name', llmProviderController.deleteLlmProvider);

// Update LLM Provider
router.put('/v1/ai/providers/:name', llmProviderController.updateLlmProvider);

module.exports = router;
