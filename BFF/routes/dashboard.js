// dashboard.js corresponds to dashboard.ts
const express = require('express');
const router = express.Router();
// Import dashboardController
const dashboardController = require('../controllers/dashboardController');

// ==================== Interfaces related to dashboard management ====================

// Get dashboard information
router.get('/dashboard/info', dashboardController.getDashboardInfo);

// Initialize dashboard
router.get('/dashboard/init', dashboardController.initDashboard);

// Set dashboard URL
router.put('/dashboard/info', dashboardController.setDashboardUrl);

// Get dashboard configuration data
router.get('/dashboard/configData', dashboardController.getDashboardConfigData);

module.exports = router;
