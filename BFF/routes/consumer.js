// consumer.js corresponds to consumer.ts
const express = require('express');
const router = express.Router();
// Import consumerController
const consumerController = require('../controllers/consumerController');

// ==================== Interfaces related to consumer management ====================

// Get consumer list
router.get('/v1/consumers', consumerController.getConsumers);

// Add consumer
router.post('/v1/consumers', consumerController.addConsumer);

// Delete consumer
router.delete('/v1/consumers/:name', consumerController.deleteConsumer);

// Update consumer
router.put('/v1/consumers/:name', consumerController.updateConsumer);

module.exports = router;
