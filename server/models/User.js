// server/models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// User 모델 정의
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false // Null 값을 허용하지 않음
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true // createdAt과 updatedAt 필드 자동 생성
});

module.exports = User;

