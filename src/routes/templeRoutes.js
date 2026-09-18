// Routes สำหรับ Temple API (Single Temple System)
const express = require('express');
const router = express.Router();
const templeController = require('../controllers/templeController');
const { validateTemple } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// GET /api/v1/temple - ดูข้อมูลวัด (สาธารณะ)
router.get('/temple', templeController.getInfo);

// PUT /api/v1/temple - แก้ไขข้อมูลวัด (ต้อง login)
router.put('/temple', authenticate, uploadSingle, validateTemple, templeController.update);

module.exports = router;
