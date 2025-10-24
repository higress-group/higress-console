// service-source.js对应service-source.ts
// 引入express
const express = require('express');
// 创建路由
const router = express.Router();
// 引入serviceSourceController
const serviceSourceController = require('../controllers/serviceSourceController');

// ==================== 服务源管理相关接口 ====================

// 获取服务源列表
router.get('/v1/service-sources', serviceSourceController.getServiceSources);

// 添加服务源
router.post('/v1/service-sources', serviceSourceController.addServiceSource);

// 删除服务源
router.delete('/v1/service-sources/:name', serviceSourceController.deleteServiceSource);

// 更新服务源
router.put('/v1/service-sources/:name', serviceSourceController.updateServiceSource);

// 导出路由
module.exports = router;
