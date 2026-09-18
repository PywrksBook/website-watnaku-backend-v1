// Routes สำหรับ Monks API
const express = require('express');
const router = express.Router();
const monkController = require('../controllers/monkController');
const { validateMonk } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// GET /api/v1/monks - ดูพระทั้งหมด (สาธารณะ)
router.get('/monks', monkController.getAll);

// GET /api/v1/monks/:id - ดูพระตาม ID (สาธารณะ)
router.get('/monks/:id', monkController.getById);

// POST /api/v1/monks - เพิ่มพระใหม่ (ต้อง login + อัปโหลดรูปได้)
router.post('/monks', authenticate, uploadSingle, validateMonk, monkController.create);

// PUT /api/v1/monks/:id - แก้ไขข้อมูลพระ (ต้อง login + อัปโหลดรูปได้)
router.put('/monks/:id', authenticate, uploadSingle, validateMonk, monkController.update);

// DELETE /api/v1/monks/:id - ลบพระ (ต้อง login)
router.delete('/monks/:id', authenticate, monkController.delete);

module.exports = router;
