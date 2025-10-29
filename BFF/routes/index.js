const express = require('express');
const router = express.Router();

// Import and register routes
router.use('/', require('./auth'));
router.use('/', require('./system'));
router.use('/', require('./tls-certificate'));
router.use('/', require('./service'));
router.use('/', require('./service-source'));
router.use('/', require('./route'));
router.use('/', require('./plugin'));
router.use('/', require('./consumer'));
router.use('/', require('./dashboard'));
router.use('/', require('./domain'));
router.use('/', require('./mcp'));
router.use('/', require('./llm-provider'));
router.use('/', require('./ai-route'));

module.exports = router;
