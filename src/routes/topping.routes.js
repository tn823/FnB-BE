const express = require("express");
const router = express.Router();
const toppingController = require('../controllers/topping.controller');

router.get('/toppings', toppingController.getTopping);

router.get('/toppings/:productId', toppingController.getToppingsByProductId);

router.delete('/toppings/:productId', toppingController.deleteTopping);

module.exports = router;