const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.get('/accounts', accountController.getAllAccounts);

router.post('/accounts', accountController.createAccount);

router.delete('/accounts/:id', accountController.deleteAccount);

router.put('/accounts/:id', accountController.updateAccount);

router.post('/login', accountController.login);

router.get('/accounts/:id', accountController.getAccountById);

router.get('/accounts/name/:username', accountController.getAccountByName);

router.get('/accounts/position/:position', accountController.getAccountByPosition);

module.exports = router;