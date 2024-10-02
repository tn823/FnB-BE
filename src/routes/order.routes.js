const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/orders', orderController.createOrder);

router.get('/orders/:orderId', orderController.getOrderById);

router.get('/orders', orderController.getOrders);

router.delete('/orders/:orderId', orderController.deleteOrder);

router.put('/orders/:orderId', orderController.updateOrder);

router.put('/orders/status/:orderId', orderController.updateOrderStatus);

router.get('/orders/revenue/today', orderController.getRevenue);


module.exports = router;



