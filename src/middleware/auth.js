// Middleware สำหรับตรวจสอบ JWT Token (Authentication)
const jwt = require('jsonwebtoken');

// ตรวจสอบว่าผู้ใช้ login แล้วหรือไม่
// ใช้กับ route ที่ต้อง login ก่อน (POST/PUT/DELETE)
exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ตรวจสอบว่ามี header Authorization แบบ Bearer หรือไม่
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'กรุณาเข้าสู่ระบบก่อนใช้งาน'
      });
    }

    // ดึง token ออกมา
    const token = authHeader.split(' ')[1];

    // ตรวจสอบและถอดรหัส token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // เก็บข้อมูลผู้ใช้ไว้ใน req เพื่อให้ controller ใช้งานต่อ
    req.admin = decoded;

    next();
  } catch (error) {
    // ส่งต่อไปยัง handleJWTError ใน errorHandler
    next(error);
  }
};
