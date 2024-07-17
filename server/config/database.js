// Sequelize 모듈을 가져옵니다.
const { Sequelize } = require('sequelize');

// dotenv 모듈을 가져와 환경 변수를 설정합니다.
require('dotenv').config();

// Sequelize 인스턴스를 생성하여 데이터베이스 연결을 설정합니다.
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    // 데이터베이스가 실행 중인 호스트를 지정합니다.
    host: process.env.DB_HOST,
    // 사용할 데이터베이스 종류를 지정합니다.
    dialect: 'mysql'
});

// 생성한 Sequelize 인스턴스를 내보냅니다.
module.exports = sequelize;