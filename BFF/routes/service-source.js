// service-source.js corresponds to service-source.ts
const express = require('express');
const router = express.Router();
// Import serviceSourceController
const serviceSourceController = require('../controllers/serviceSourceController');

// ==================== Interfaces related to service source management ====================

// Get service source list
router.get('/v1/service-sources', serviceSourceController.getServiceSources);

// Add service source
router.post('/v1/service-sources', serviceSourceController.addServiceSource);

// Delete service source
router.delete('/v1/service-sources/:name', serviceSourceController.deleteServiceSource);

// Update service source
router.put('/v1/service-sources/:name', serviceSourceController.updateServiceSource);

module.exports = router;
