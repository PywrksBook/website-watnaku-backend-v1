// Routes สำหรับ News API
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { validateNews } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// GET /api/v1/news - ดูข่าวทั้งหมด (สาธารณะ)
router.get('/news', newsController.getAll);

// GET /api/v1/news/:id - ดูข่าวตาม ID (สาธารณะ)
router.get('/news/:id', newsController.getById);

// POST /api/v1/news - เพิ่มข่าวใหม่ (ต้อง login + อัปโหลดรูปได้)
router.post('/news', authenticate, uploadSingle, validateNews, newsController.create);

// PUT /api/v1/news/:id - แก้ไขข่าว (ต้อง login + อัปโหลดรูปได้)
router.put('/news/:id', authenticate, uploadSingle, validateNews, newsController.update);

// DELETE /api/v1/news/:id - ลบข่าว (ต้อง login)
router.delete('/news/:id', authenticate, newsController.delete);

module.exports = router;
