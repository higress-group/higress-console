// auth.js对应user.ts,后面需要修改
// 引入express
const express = require('express');
// 创建路由
const router = express.Router();
// 引入authController
const authController = require('../controllers/authController');

// ==================== 会话管理相关接口 ====================
// 登录接口
router.post('/session/login', authController.login);

// 登出接口
router.get('/session/logout', authController.logout);

// 获取用户信息接口
router.get('/user/info', authController.getUserInfo);

// 修改密码接口
router.post('/user/changePassword', authController.changePassword);

// 导出路由
module.exports = router;
