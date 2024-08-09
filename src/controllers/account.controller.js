const { Op } = require('sequelize')
const Account = require('../models/account.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10
const AccountService = require("../services/account.service")

exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await AccountService.getAccount();
        res.json(accounts);
    } catch (error) {
        console.error('Error while getting accounts: ', error)
        res.status(500).json({ error: 'Error while getting accounts' })
    }
};

exports.createAccount = async (req, res) => {
    try {
        const { username, password, position } = req.body;
        const newAccount = await AccountService.createAccount({ username, password, position });
        res.status(201).json({ message: 'Account created successfully', account: newAccount });
    } catch (error) {
        console.error('Error while creating account:', error);
        res.status(500).json({ error: 'Error while creating account' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await AccountService.deleteAccount(id);

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error while deleting account:', error);
        res.status(500).json({ error: 'Error while deleting account' });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, position } = req.body;

        const updateAccount = await AccountService.updateAccount(id, { password, position });

        if (!updateAccount) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.status(200).json({ message: 'Account updated successfully', account: updateAccount })
    } catch (error) {
        console.error('Error while updating account: ', error)
        res.status(500).json({ error: 'Error while updating account' })
    }
};

// exports.login = async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const account = await Account.findOne({ where: { username: username } });
//         if (!account) {
//             return res.status(404).json({ error: 'Account not found' });
//         }
//         const match = await bcrypt.compare(password, account.password);
//         if (!match) {
//             return res.status(401).json({ error: 'Incorrect password' });
//         }
//         const token = jwt.sign(
//             { id: account.id, username: account.username, position: account.position },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );
//         res.status(200).json({ message: 'Login successful', token: token, position: account.position });
//     } catch (error) {
//         console.error('Error while logging in: ', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

exports.getAccountById = async (req, res) => {
    try {
        const accountId = req.params.id;
        const account = await AccountService.getAccountById(accountId);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json(account);
    } catch (error) {
        console.error('Error while getting account by id:', error);
        res.status(500).json({ error: 'Error while getting account' });
    }
};

exports.getAccountByName = async (req, res) => {
    try {
        const { username } = req.params;
        const accounts = await AccountService.getAccountByName(username);

        if (accounts.length === 0) {
            return res.status(404).json({ error: 'No accounts found with the given username' });
        }

        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error while getting account by name:', error);
        res.status(500).json({ error: 'Error while getting account by name' });
    }
};

exports.getAccountByPosition = async (req, res) => {
    try {
        const { position } = req.params;
        const accounts = await AccountService.getAccountByPosition(position);

        if (accounts.length === 0) {
            return res.status(404).json({ error: 'No accounts found with the given position' });
        }

        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error while getting account by position:', error);
        res.status(500).json({ error: 'Error while getting account by position' });
    }
};
