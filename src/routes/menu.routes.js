const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');

router.get('/menus', menuController.getMenus);

router.post('/menus', menuController.createMenu);

router.delete('/menus/:id', menuController.deleteMenu);

router.put('/menus/:id', menuController.updateMenu);

router.get('/menus/:id', menuController.getMenuById);

router.get('/menus/name/:name', menuController.getMenuByName);

module.exports = router;