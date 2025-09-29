// ai-route.js对应ai-route.ts
// 引入express
const express = require('express');
// 创建路由
const router = express.Router();
// 引入aiRouteController
const aiRouteController = require('../controllers/aiRouteController');

// ==================== AI Route管理相关接口 ====================

// 获取AI Route列表
router.get('/v1/ai/routes', aiRouteController.getAiRoutes);

// 添加AI Route
router.post('/v1/ai/routes', aiRouteController.addAiRoute);

// 删除AI Route
router.delete('/v1/ai/routes/:name', aiRouteController.deleteAiRoute);

// 更新AI Route
router.put('/v1/ai/routes/:name', aiRouteController.updateAiRoute);

// 导出路由
module.exports = router;

