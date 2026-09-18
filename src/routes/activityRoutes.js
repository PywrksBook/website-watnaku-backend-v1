// Routes สำหรับ Activities API
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { validateActivity } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// GET /api/v1/activities - ดูกิจกรรมทั้งหมด (สาธารณะ)
router.get('/activities', activityController.getAll);

// GET /api/v1/activities/:id - ดูกิจกรรมตาม ID (สาธารณะ)
router.get('/activities/:id', activityController.getById);

// POST /api/v1/activities - เพิ่มกิจกรรมใหม่ (ต้อง login + อัปโหลดรูปได้)
router.post('/activities', authenticate, uploadSingle, validateActivity, activityController.create);

// PUT /api/v1/activities/:id - แก้ไขกิจกรรม (ต้อง login + อัปโหลดรูปได้)
router.put('/activities/:id', authenticate, uploadSingle, validateActivity, activityController.update);

// DELETE /api/v1/activities/:id - ลบกิจกรรม (ต้อง login)
router.delete('/activities/:id', authenticate, activityController.delete);

module.exports = router;
