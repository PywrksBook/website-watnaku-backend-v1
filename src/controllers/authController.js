// Controller สำหรับจัดการ Authentication (เข้าสู่ระบบ)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/adminModel');

// จำนวนรอบในการ hash รหัสผ่าน (ยิ่งมากยิ่งปลอดภัยแต่ช้า)
const SALT_ROUNDS = 10;

// สร้าง JWT token
const generateToken = (admin) => {
  return jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// เข้าสู่ระบบ (Login)
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // ค้นหาผู้ใช้
    const admin = await AdminModel.findByUsername(username);
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'username หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'username หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    // สร้าง token
    const token = generateToken(admin);

    res.status(200).json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      data: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// ดูข้อมูลผู้ใช้ปัจจุบัน (ต้อง login ก่อน)
exports.getMe = async (req, res, next) => {
  try {
    const admin = await AdminModel.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    next(error);
  }
};
