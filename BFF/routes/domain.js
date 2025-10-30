// domain.js corresponds to domain.ts
const express = require('express');
const router = express.Router();
// Import domainController
const domainController = require('../controllers/domainController');

// ==================== Interfaces related to domain management ====================

// Get gateway domain list
router.get('/v1/domains', domainController.getGatewayDomains);

// Add gateway domain
router.post('/v1/domains', domainController.addGatewayDomain);

// Delete gateway domain
router.delete('/v1/domains/:name', domainController.deleteGatewayDomain);

// Update gateway domain
router.put('/v1/domains/:name', domainController.updateGatewayDomain);

module.exports = router;
