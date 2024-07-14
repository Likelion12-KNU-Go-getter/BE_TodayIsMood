// server/routes/diaryRoutes.js

const express = require('express');
const { createDiary, getDiaries, getDiaryById, updateDiary, deleteDiary } = require('../controllers/diaryController');

const router = express.Router();

// 다이어리 생성 라우트
router.post('/', createDiary);

// 다이어리 목록 조회 라우트
router.get('/', getDiaries);

// 특정 다이어리 조회 라우트
router.get('/:id', getDiaryById);

// 다이어리 수정 라우트
router.put('/:id', updateDiary);

// 다이어리 삭제 라우트
router.delete('/:id', deleteDiary);

module.exports = router;