const express = require('express');
const router = express.Router();
const combosController = require('../controllers/combo.controller');

router.get('/getCombos', combosController.getCombos);


module.exports = router;
