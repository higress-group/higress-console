// dashboard.js对应dashboard.ts
// 引入express
const express = require('express');
// 创建路由
const router = express.Router();
// 引入dashboardController
const dashboardController = require('../controllers/dashboardController');

// ==================== 仪表板管理相关接口 ====================

// 获取仪表板信息
router.get('/dashboard/info', dashboardController.getDashboardInfo);

// 初始化仪表板
router.get('/dashboard/init', dashboardController.initDashboard);

// 设置仪表板URL
router.put('/dashboard/info', dashboardController.setDashboardUrl);

// 获取仪表板配置数据
router.get('/dashboard/configData', dashboardController.getDashboardConfigData);

// 导出路由
module.exports = router;
