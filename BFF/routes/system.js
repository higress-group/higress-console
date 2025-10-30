// system.js corresponds to system.ts
const express = require('express');
const router = express.Router();
// Import systemController
const systemController = require('../controllers/systemController');

// ==================== Interfaces related to system management ====================

// Get system configuration information
router.get('/system/info', systemController.getSystemInfo);

// Get system configuration
router.get('/system/config', systemController.getConfig);

// Initialize system(后面再写)
router.post('/system/init', systemController.initialize);

// Get higress configuration
router.get('/system/higress-config', systemController.getHigressConfig);

// // Update higress configuration
router.put('/system/higress-config', systemController.updateHigressConfig);

module.exports = router;
