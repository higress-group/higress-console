// service.js corresponds to service.ts
const express = require('express');
const router = express.Router();
// Import serviceController
const serviceController = require('../controllers/serviceController');

// ==================== Interfaces related to service management ====================

// Get gateway service list
router.get('/v1/services', serviceController.getGatewayServices);

// Export routes
module.exports = router;
