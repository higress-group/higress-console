// system.js对应system.ts
// 引入express
const express = require('express');
// 创建路由
const router = express.Router();
// 引入systemController
const systemController = require('../controllers/systemController');

// ==================== 系统管理相关接口 ====================

// 获取系统配置信息
router.get('/system/info', systemController.getSystemInfo);

// 获取系统配置
router.get('/system/config', systemController.getConfig);

// 初始化系统(后面再写)
router.post('/system/init', systemController.initialize);

// 获取higress配置
router.get('/system/higress-config', systemController.getHigressConfig);

// // 更新higress配置
router.put('/system/higress-config', systemController.updateHigressConfig);

// 导出路由
module.exports = router;
