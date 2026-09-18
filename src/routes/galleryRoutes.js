// Routes สำหรับ Gallery API
const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { validateGallery } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// GET /api/v1/gallery - ดูรูปทั้งหมด (สาธารณะ)
router.get('/gallery', galleryController.getAll);

// GET /api/v1/gallery/:id - ดูรูปตาม ID (สาธารณะ)
router.get('/gallery/:id', galleryController.getById);

// POST /api/v1/gallery - เพิ่มรูปใหม่ (ต้อง login + อัปโหลดไฟล์ได้)
router.post('/gallery', authenticate, uploadSingle, validateGallery, galleryController.create);

// PUT /api/v1/gallery/:id - แก้ไขคำบรรยาย (ต้อง login + อัปโหลดไฟล์ได้)
router.put('/gallery/:id', authenticate, uploadSingle, validateGallery, galleryController.update);

// DELETE /api/v1/gallery/:id - ลบรูป (ต้อง login)
router.delete('/gallery/:id', authenticate, galleryController.delete);

module.exports = router;
