// tls-certificate.js对应tls-certificate.ts
// 引入express
const express = require('express');
// 创建路由
const router = express.Router();
// 引入tlsCertificateController
const tlsCertificateController = require('../controllers/tlsCertificateController');

// ==================== TLS证书管理相关接口 ====================

// 获取TLS证书列表
router.get('/v1/tls-certificates', tlsCertificateController.getTlsCertificates);

// 添加TLS证书
router.post('/v1/tls-certificates', tlsCertificateController.addTlsCertificate);

// 删除TLS证书
router.delete('/v1/tls-certificates/:name', tlsCertificateController.deleteTlsCertificate);

// 更新TLS证书
router.put('/v1/tls-certificates/:name', tlsCertificateController.updateTlsCertificate);

// 导出路由
module.exports = router;
