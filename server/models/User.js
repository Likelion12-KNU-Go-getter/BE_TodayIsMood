// Sequelize 모듈과 데이터 타입을 가져옵니다.
const { Sequelize, DataTypes } = require('sequelize');

// 데이터베이스 설정 파일을 가져옵니다.
const sequelize = require('../config/database');

// User 모델을 정의합니다.
const User = sequelize.define('User', {
    // id 필드를 정의합니다. 자동 증가하는 정수형입니다.
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // username 필드를 정의합니다. 문자열이며 유니크해야 합니다.
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // password 필드를 정의합니다. 문자열이며 null을 허용하지 않습니다.
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// User 모델을 내보냅니다.
module.exports = User;
