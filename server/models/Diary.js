// server/models/Diary.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

// Diary 모델 정의
const Diary = sequelize.define('Diary', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

// Diary 모델이 User 모델에 종속됨 (외래키 userId)
Diary.belongsTo(User, { onDelete: 'SET NULL', onUpdate: 'CASCADE' });

module.exports = Diary;