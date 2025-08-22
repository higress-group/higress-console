// route.js对应route.ts
// 引入express
const express = require('express');
// 创建路由
const router = express.Router();
// 引入routeController
const routeController = require('../controllers/routeController');

// ==================== 路由管理相关接口 ====================

// 获取网关路由列表
router.get('/v1/routes', routeController.getGatewayRoutes);

// 获取指定路由详情
router.get('/v1/routes/:routeName', routeController.getGatewayRouteDetail);

// 添加网关路由
router.post('/v1/routes', routeController.addGatewayRoute);

// 删除网关路由
router.delete('/v1/routes/:name', routeController.deleteGatewayRoute);

// 编辑网关路由
router.put('/v1/routes/:name', routeController.updateGatewayRoute);

// 更新路由配置
router.put('/v1/routes/:name/config', routeController.updateRouteConfig);

// 导出路由
module.exports = router;
