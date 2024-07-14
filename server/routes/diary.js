const express = require('express');
const router = express.Router();
const DiaryController = require('../controllers/diary');

// 그림일기 작성 API
router.post('/', DiaryController.createDiary);

// 사용자가 작성한 모든 그림일기 조회 API
router.get('/', DiaryController.getAllDiaries);

module.exports = router;
