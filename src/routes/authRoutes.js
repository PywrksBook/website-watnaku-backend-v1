// Routes สำหรับ Authentication API
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

// POST /api/v1/auth/login - เข้าสู่ระบบ
router.post('/auth/login', validateLogin, authController.login);

// GET /api/v1/auth/me - ดูข้อมูลผู้ใช้ปัจจุบัน (ต้อง login)
router.get('/auth/me', authenticate, authController.getMe);

module.exports = router;
