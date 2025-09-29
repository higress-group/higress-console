// domain.js对应domain.ts
// 引入express
const express = require('express');
// 创建路由
const router = express.Router();
// 引入domainController
const domainController = require('../controllers/domainController');

// ==================== 域名管理相关接口 ====================

// 获取网关域名列表
router.get('/v1/domains', domainController.getGatewayDomains);

// 添加网关域名
router.post('/v1/domains', domainController.addGatewayDomain);

// 删除网关域名
router.delete('/v1/domains/:name', domainController.deleteGatewayDomain);

// 更新网关域名
router.put('/v1/domains/:name', domainController.updateGatewayDomain);

// 导出路由
module.exports = router;
