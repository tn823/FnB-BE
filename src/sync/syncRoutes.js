const express = require("express");
const router = express.Router();
const syncController = require('../sync/syncController');

router.post('/sync', syncController.sync);


module.exports = router;