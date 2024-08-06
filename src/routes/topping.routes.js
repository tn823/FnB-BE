const express = require("express");
const router = express.Router();
const toppingController = require('../controllers/topping.controller');

router.get('/toppings', toppingController.getTopping);

router.get('/toppings/:productId', toppingController.getToppingsByProductId);

router.post('/toppings', toppingController.createTopping);

router.put('/toppings/:id', toppingController.updateTopping);

router.delete('/toppings/:id', toppingController.deleteTopping);

module.exports = router;