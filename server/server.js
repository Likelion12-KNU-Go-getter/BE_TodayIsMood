// Express 모듈을 가져옵니다.
const express = require('express');
// Express 애플리케이션을 생성합니다.
const app = express();

// Sequelize 설정 파일을 가져옵니다.
const sequelize = require('./config/database');
// 사용자 관련 라우트를 가져옵니다.
const userRoutes = require('./routes/userRoute')
// 일기 관련 라우트를 가져옵니다.
const diaryRoutes = require('./routes/diaryRoute');

// 환경 변수를 설정하기 위해 dotenv 모듈을 가져옵니다.
require('dotenv').config();

// 요청 본문을 JSON 형식으로 파싱하는 미들웨어를 사용합니다.
app.use(express.json());

// '/api' 경로로 들어오는 요청을 userRoutes에서 처리합니다.
app.use('/api', userRoutes);

// '/api' 경로로 들어오는 요청을 diaryRoutes에서 처리합니다.
app.use('/api', diaryRoutes);

// 데이터베이스를 동기화하고 서버를 시작합니다.
sequelize.sync().then(() => {
    // 서버가 3000번 포트에서 실행되도록 합니다.
    app.listen(3000, () => {
        // 서버가 성공적으로 시작되었음을 콘솔에 출력합니다.
        console.log('Server is running on port 3000');
    });
// 데이터베이스 동기화 중 에러가 발생하면 콘솔에 출력합니다.
}).catch(err => {
    console.log('Error: ', err);
});
