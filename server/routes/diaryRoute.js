// Express 모듈을 가져옵니다.
const express = require('express');

// Router 인스턴스를 생성합니다.
const router = express.Router();

// Diary 모델을 가져옵니다.
const Diary = require('../models/Diary');

// JWT 모듈을 가져옵니다.
const jwt = require('jsonwebtoken');

// Sequelize의 Op 객체를 가져옵니다.
const { Op } = require('sequelize');

// 인증 미들웨어를 정의합니다.
router.use((req, res, next) => {
    // 요청 헤더에서 Authorization 토큰을 가져옵니다.
    const token = req.headers['authorization'];
    // 토큰이 없으면 401 상태 코드로 응답합니다.
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // JWT 토큰을 검증합니다.
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        // 토큰이 유효하지 않으면 401 상태 코드로 응답합니다.
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // 유저 ID를 요청 객체에 저장하고 다음 미들웨어로 넘어갑니다.
        req.userId = decoded.id;
        next();
    });
});

// 일기 생성 라우트 핸들러를 정의합니다.
router.post('/diaries', async (req, res) => {
    // 요청 본문에서 title과 imageUrl을 가져옵니다.
    const { title, imageUrl } = req.body;
    try {
        // 새로운 일기를 생성합니다.
        const diary = await Diary.create({ title, imageUrl, userId: req.userId });
        // 생성된 일기의 정보를 응답으로 보냅니다.
        res.status(201).json(diary);
    } catch (err) {
        // 에러가 발생하면 콘솔에 출력하고 500 상태 코드로 응답합니다.
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// 월별 일기 조회 라우트 핸들러를 정의합니다.
router.get('/diaries', async (req, res) => {
    // 요청 쿼리에서 month를 가져옵니다.
    const { month } = req.query;
    try {
        // 주어진 월에 해당하는 일
