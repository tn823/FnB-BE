const Account = require("../models/account.model");
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

class AccountService {
    async getAccount() {
        try {
            const accounts = await Account.findAll();
            return accounts;
        } catch (error) {
            console.error('Error while getting accounts:', error);
            throw error;
        }
    }

    async getAccountById(id) {
        try {
            const account = await Account.findOne({ where: { id } })
            return account;
        } catch (error) {
            console.error('Error while getting account by id:', error);
            throw error;
        }
    }

    async createAccount({ username, password, position }) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newAccount = await Account.create({
                username,
                password: hashedPassword,
                position
            });
            return newAccount;
        } catch (error) {
            throw error;
        }
    }

    async updateAccount(id, { password, position }) {
        try {
            const account = await Account.findByPk(id);
            if (!account) {
                throw new Error('Account not found');
            }

            if (password) {
                const salt = await bcrypt.genSalt(10);
                account.password = await bcrypt.hash(password, salt);
            }

            if (position) {
                account.position = position;
            }

            await account.save();
            return account;
        } catch (error) {
            throw error;
        }
    }

    async deleteAccount(id) {
        try {
            const account = await Account.findByPk(id);
            if (!account) {
                throw new Error('Account not found');
            }
            await account.destroy();
            return account;
        } catch (error) {
            throw error;
        }
    }

    async getAccountByName(username) {
        try {
            const accounts = await Account.findAll({
                where: {
                    username: {
                        [Sequelize.Op.like]: `%${username}%`
                    }
                }
            });
            return accounts;
        } catch (error) {
            throw error;
        }
    }

    async getAccountByPosition(position) {
        try {
            const accounts = await Account.findAll({
                where: {
                    position: {
                        [Sequelize.Op.like]: `%${position}%`
                    }
                }
            });
            return accounts;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AccountService();