const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');

router.get('/getMenus', menuController.getMenus);

router.post('/addMenu', menuController.createMenu);

router.delete('/deleteMenu/:id', menuController.deleteMenu);

router.put('/updateMenu/:id', menuController.updateMenu);

router.get('/getMenu/:id', menuController.getMenuById);

router.get('/getMenus/name/:name', menuController.getMenuByName);

module.exports = router;