const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.get('/accounts', accountController.getAllAccounts);

router.post('/accounts', accountController.addAccount);

router.delete('/accounts/:id', accountController.deleteAccount);

router.put('/accounts/:id', accountController.updateAccount);

router.post('/login', accountController.login);

router.get('/accounts/:id', accountController.getAccountById);

router.get('/accounts/username/:username', accountController.getAccountsByUsername);

module.exports = router;