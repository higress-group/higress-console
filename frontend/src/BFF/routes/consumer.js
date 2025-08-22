// consumer.js对应consumer.ts
// 引入express
const express = require('express');
// 创建路由
const router = express.Router();
// 引入consumerController
const consumerController = require('../controllers/consumerController');

// ==================== 消费者管理相关接口 ====================

// 获取消费者列表
router.get('/v1/consumers', consumerController.getConsumers);

// 添加消费者
router.post('/v1/consumers', consumerController.addConsumer);

// 删除消费者
router.delete('/v1/consumers/:name', consumerController.deleteConsumer);

// 更新消费者
router.put('/v1/consumers/:name', consumerController.updateConsumer);

// 导出路由
module.exports = router;
