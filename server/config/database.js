// server/config/database.js

const { Sequelize } = require('sequelize');

// SQLite 데이터베이스를 사용하기 위한 Sequelize 인스턴스 생성
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite' // 데이터베이스 파일 경로
});

module.exports = sequelize;
