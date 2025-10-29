// route.js corresponds to route.ts
const express = require('express');
const router = express.Router();
// Import routeController
const routeController = require('../controllers/routeController');

// ==================== Interfaces related to route management ====================

// Get gateway route list
router.get('/v1/routes', routeController.getGatewayRoutes);

// Batch export routes - must be before parameterized paths
router.get('/v1/routes/batch-export', routeController.batchExportRoutes);

// Export route template - must be before parameterized paths
router.get('/v1/routes/export-template', routeController.exportRouteTemplate);

// Get specified route detail - parameterized paths must be placed after specific paths
router.get('/v1/routes/:routeName', routeController.getGatewayRouteDetail);

// Add gateway route
router.post('/v1/routes', routeController.addGatewayRoute);

// Batch import routes
router.post('/v1/routes/batch-import', routeController.batchImportRoutes);

// Delete gateway route
router.delete('/v1/routes/:name', routeController.deleteGatewayRoute);

// Edit gateway route
router.put('/v1/routes/:name', routeController.updateGatewayRoute);

// Update route configuration
router.put('/v1/routes/:name/config', routeController.updateRouteConfig);

// Dubbo protocol conversion related routes
router.post('/v1/routes/:routeName/dubbo-config', routeController.createDubboConfig);

router.put('/v1/routes/:routeName/dubbo-config', routeController.updateDubboConfig);

router.delete('/v1/routes/:routeName/dubbo-config', routeController.deleteDubboConfig);

module.exports = router;
