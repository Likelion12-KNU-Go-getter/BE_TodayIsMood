// server/server.js

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const authMiddleware = require('./middlewares/auth');

// Express 앱 생성
const app = express();

// JSON 요청 바디 파싱 미들웨어 추가
app.use(bodyParser.json());

// 인증 관련 라우트 추가
app.use('/api', authRoutes);
// 다이어리 관련 라우트 추가 (인증 미들웨어 포함)
app.use('/api/diaries', authMiddleware, diaryRoutes);

// 데이터베이스와 동기화 후 서버 시작
sequelize.sync()
    .then(() => {
        app.listen(5000, () => {
            console.log('Server running on port 5000');
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
