// auth.js corresponds to user.ts
const express = require('express');
const router = express.Router();
// Import authController
const authController = require('../controllers/authController');

// ==================== Session management related interfaces ====================

// Login interface
router.post('/session/login', authController.login);

// Logout interface
router.get('/session/logout', authController.logout);

// Get user information interface
router.get('/user/info', authController.getUserInfo);

// Change password interface
router.post('/user/changePassword', authController.changePassword);

module.exports = router;
