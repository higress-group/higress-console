// service.js对应service.ts
// 引入express
const express = require('express');
// 创建路由
const router = express.Router();
// 引入serviceController
const serviceController = require('../controllers/serviceController');

// ==================== 服务管理相关接口 ====================

// 获取网关服务列表
router.get('/v1/services', serviceController.getGatewayServices);

// 导出路由
module.exports = router;
