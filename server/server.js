const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./config/database');
const userRoutes = require('./routes/user');
const diaryRoutes = require('./routes/diary');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(bodyParser.json());
app.use(cors());

// 라우트 설정
app.use('/api/users', userRoutes);
app.use('/api/diaries', diaryRoutes);

// 서버 시작
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // 데이터베이스 연결 확인
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
