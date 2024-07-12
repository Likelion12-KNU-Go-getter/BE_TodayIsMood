const { Sequelize } = require('sequelize');

// SQLite 연결 설정
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // 데이터베이스 파일 경로 설정
});

// 모델 정의
const User = require('../models/User')(sequelize, Sequelize);
const Diary = require('../models/Diary')(sequelize, Sequelize);

// 데이터베이스 모델과 연결
sequelize.sync(); // 모델과 데이터베이스 동기화

module.exports = {
  sequelize,
  User,
  Diary,
};
