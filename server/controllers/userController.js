
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// 회원가입 처리 함수
exports.register = async (req, res) => {
    try {
        const { username, password, nickname } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱
        await User.create({ username, password: hashedPassword, nickname }); // 사용자 생성
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 로그인 처리 함수
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } }); // 사용자 검색
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password); // 비밀번호 검증
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // JWT 생성
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};