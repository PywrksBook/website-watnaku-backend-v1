// Middleware สำหรับอัปโหลดไฟล์รูปภาพ (ใช้ multer)
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// โฟลเดอร์เก็บไฟล์ที่อัปโหลด
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

// สร้างโฟลเดอร์ uploads อัตโนมัติถ้ายังไม่มี
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// กำหนดที่เก็บไฟล์และชื่อไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // ตั้งชื่อไฟล์ใหม่: ชื่อเดิม + เวลา + นามสกุล (กันชื่อซ้ำ)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// ตรวจสอบชนิดไฟล์ (รับเฉพาะรูปภาพ)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพ (jpeg, jpg, png, gif, webp) เท่านั้น'));
  }
};

// สร้าง multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  }
});

// Middleware อัปโหลดรูปเดียว (ชื่อ field: image)
exports.uploadSingle = upload.single('image');

// Middleware อัปโหลดหลายรูป (ชื่อ field: images)
exports.uploadMultiple = upload.array('images', 10);

// แปลง path ของไฟล์เป็น URL สำหรับเก็บในฐานข้อมูล
exports.getFileUrl = (file) => {
  if (!file) return null;
  return `/${UPLOAD_DIR}/${file.filename}`;
};