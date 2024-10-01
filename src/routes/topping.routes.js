const express = require("express");
const router = express.Router();
const toppingController = require('../controllers/topping.controller');

router.get('/toppings', toppingController.getTopping);

router.get('/toppings/product/:productId', toppingController.getToppingsByProductId);

router.get('/toppings/:id', toppingController.getToppingsById);

router.get('/toppings/name/:name', toppingController.getToppingsByName);

router.post('/toppings', toppingController.createTopping);

router.put('/toppings/:id', toppingController.updateTopping);

router.delete('/toppings/:id', toppingController.deleteTopping);

module.exports = router;