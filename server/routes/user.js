const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

// 회원가입 API
router.post('/register', UserController.registerUser);

// 로그인 API
router.post('/login', UserController.loginUser);

module.exports = router;
