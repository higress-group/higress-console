// tls-certificate.js corresponds to tls-certificate.ts
const express = require('express');
const router = express.Router();
// Import tlsCertificateController
const tlsCertificateController = require('../controllers/tlsCertificateController');

// ==================== Interfaces related to TLS certificate management ====================

// Get TLS certificate list
router.get('/v1/tls-certificates', tlsCertificateController.getTlsCertificates);

// Add TLS certificate
router.post('/v1/tls-certificates', tlsCertificateController.addTlsCertificate);

// Delete TLS certificate
router.delete('/v1/tls-certificates/:name', tlsCertificateController.deleteTlsCertificate);

// Update TLS certificate
router.put('/v1/tls-certificates/:name', tlsCertificateController.updateTlsCertificate);

// Validate TLS certificate
router.post('/v1/tls-certificates/validate', tlsCertificateController.validateTlsCertificate);

module.exports = router;
