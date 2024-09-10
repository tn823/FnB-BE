const bcrypt = require('bcrypt')
const Account = require('../models/account.model')

class AuthService {
    async login(username, password) {
        try {
            const account = await Account.findOne({ where: { username } })
            if (!account) {
                throw new Error('Invalid username or password')
            }
            const isMath = await bcrypt.compare(password, account.password)

            if (!isMath) {
                throw new Error('Invalid username or password')
            }
            return account;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthService();