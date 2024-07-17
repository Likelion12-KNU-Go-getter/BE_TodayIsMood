// Express 모듈을 가져옵니다.
const express = require('express');

// Router 인스턴스를 생성합니다.
const router = express.Router();

// bcrypt 모듈을 가져옵니다.
const bcrypt = require('bcrypt');

// jwt 모듈을 가져옵니다.
const jwt = require('jsonwebtoken');

// User 모델을 가져옵니다.
const User = require('../models/User');

// 회원가입 라우트 핸들러를 정의합니다.
router.post('/signup', async (req, res) => {
    // 요청 본문에서 username과 password를 가져옵니다.
    const { username, password } = req.body;
    try {
        // 비밀번호를 해시화합니다.
        const hashedPassword = await bcrypt.hash(password, 10);
        // 새로운 사용자를 생성합니다.
        const user = await User.create({ username, password: hashedPassword });
        // 생성된 사용자의 정보를 응답으로 보냅니다.
        res.status(201).json(user);
    } catch (err) {
        // 에러가 발생하면 콘솔에 출력하고 500 상태 코드로 응답합니다.
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// 로그인 라우트 핸들러를 정의합니다.
router.post('/login', async (req, res) => {
    // 요청 본문에서 username과 password를 가져옵니다.
    const { username, password } = req.body;
    try {
        // 데이터베이스에서 사용자를 찾습니다.
        const user = await User.findOne({ where: { username } });
        // 사용자가 없으면 401 상태 코드로 응답합니다.
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // 입력된 비밀번호와 저장된 해시된 비밀번호를 비교합니다.
        const match = await bcrypt.compare(password, user.password);
        // 비밀번호가 일치하지 않으면 401 상태 코드로 응답합니다.
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // JWT 토큰을 생성합니다.
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // JWT 토큰을 응답으로 보냅니다.
        res.json({ token });
    } catch (err) {
        // 에러가 발생하면 콘솔에 출력하고 500 상태 코드로 응답합니다.
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// 라우터를 내보냅니다.
module.exports = router;
