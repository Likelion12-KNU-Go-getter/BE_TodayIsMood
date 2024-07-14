// server/controllers/diaryController.js

const Diary = require('../models/Diary');

// 그림일기 작성 처리 함수
exports.createDiary = async (req, res) => {
    try {
        const { title, image, date } = req.body;
        const diary = await Diary.create({ title, image, date, userId: req.user.id }); // 다이어리 생성
        res.status(201).json({ message: 'Diary created successfully', diary });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 그림일기 조회 처리 함수
exports.getDiaries = async (req, res) => {
    try {
        const diaries = await Diary.findAll({ where: { userId: req.user.id } }); // 다이어리 검색
        res.status(200).json(diaries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 특정 그림일기 조회 처리 함수
exports.getDiaryById = async (req, res) => {
    try {
        const diary = await Diary.findOne({ where: { id: req.params.id, userId: req.user.id } }); // 특정 다이어리 검색
        if (!diary) {
            return res.status(404).json({ message: 'Diary not found' });
        }
        res.status(200).json(diary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 그림일기 수정 처리 함수
exports.updateDiary = async (req, res) => {
    try {
        const { title, image, date } = req.body;
        const diary = await Diary.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!diary) {
            return res.status(404).json({ message: 'Diary not found' });
        }
        await diary.update({ title, image, date }); // 다이어리 업데이트
        res.status(200).json({ message: 'Diary updated successfully', diary });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 그림일기 삭제 처리 함수
exports.deleteDiary = async (req, res) => {
    try {
        const diary = await Diary.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!diary) {
            return res.status(404).json({ message: 'Diary not found' });
        }
        await diary.destroy(); // 다이어리 삭제
        res.status(200).json({ message: 'Diary deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};