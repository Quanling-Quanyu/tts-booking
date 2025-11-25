const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

/**
 * 認證路由
 * 基礎路徑: /api/auth
 */

// 註冊 - 公開路由
router.post('/register', authController.register);

// 登入 - 公開路由
router.post('/login', authController.login);

// 獲取當前用戶 - 需要認證
router.get('/me', authenticate, authController.getMe);

module.exports = router;
