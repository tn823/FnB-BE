const AuthService = require('../services/auth.service')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const account = await AuthService.login(username, password);

        // Tạo token JWT
        const token = jwt.sign({ id: account.id, username: account.username }, SECRET_KEY, { expiresIn: '1h' });

        // Lưu token vào cookie
        res.cookie('authToken', token, { httpOnly: true, maxAge: 3600000 }); // Cookie hết hạn sau 1 giờ

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error while logging in:', error);
        res.status(401).json({ error: 'Invalid username or password' });
    }
};