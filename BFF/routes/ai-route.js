// ai-route.js corresponds to ai-route.ts
const express = require('express');
const router = express.Router();
// Import aiRouteController
const aiRouteController = require('../controllers/aiRouteController');

// ==================== AI Route related interfaces ====================

// Get AI Route list
router.get('/v1/ai/routes', aiRouteController.getAiRoutes);

// Add AI Route
router.post('/v1/ai/routes', aiRouteController.addAiRoute);

// Delete AI Route
router.delete('/v1/ai/routes/:name', aiRouteController.deleteAiRoute);

// Update AI Route
router.put('/v1/ai/routes/:name', aiRouteController.updateAiRoute);

module.exports = router;

