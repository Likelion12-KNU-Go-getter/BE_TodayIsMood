// server/middlewares/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 인증 미들웨어
module.exports = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
