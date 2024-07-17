// Sequelize 모듈과 데이터 타입을 가져옵니다.
const { Sequelize, DataTypes } = require('sequelize');

// 데이터베이스 설정 파일을 가져옵니다.
const sequelize = require('../config/database');

// User 모델을 가져옵니다.
const User = require('./User');

// Diary 모델을 정의합니다.
const Diary = sequelize.define('Diary', {
    // id 필드를 정의합니다. 자동 증가하는 정수형입니다.
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // title 필드를 정의합니다. 문자열이며 null을 허용하지 않습니다.
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // imageUrl 필드를 정의합니다. 문자열이며 null을 허용하지 않습니다.
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // createdAt 필드를 정의합니다. 기본값은 현재 시간입니다.
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
});

// Diary 모델이 User 모델에 속해 있음을 정의합니다.
Diary.belongsTo(User, { foreignKey: 'userId' });

// Diary 모델을 내보냅니다.
module.exports = Diary;
