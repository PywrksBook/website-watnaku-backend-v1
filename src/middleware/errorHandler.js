// Middleware สำหรับจัดการ errors ทั้งหมดในระบบ
// Error Handler = จัดการ errors ให้อยู่ในรูปแบบที่สอดคล้องกัน

// จัดการกรณีที่ไม่พบ route ที่ request (404 Not Found)
exports.notFound = (req, res, next) => {
  const error = new Error(`ไม่พบหน้าที่ต้องการ - ${req.originalUrl}`);
  res.status(404);
  next(error); // ส่งต่อไปยัง errorHandler
};

// Global Error Handler
// จัดการ errors ทั้งหมดที่ถูกส่งมาด้วย next(error)
exports.errorHandler = (err, req, res, next) => {
  // ถ้า response ยังไม่มี status code ให้ใช้ 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log error ออกมาใน console (เพื่อ debug)
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);

  // ส่ง response กลับไปยัง client
  res.status(statusCode).json({
    success: false,
    error: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
    // แสดง stack trace เฉพาะใน development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// จัดการ Database Errors
exports.handleDatabaseError = (err, req, res, next) => {
  // MySQL Error Codes
  if (err.code === 'ER_DUP_ENTRY') {
    // Duplicate entry (เช่น username ซ้ำ)
    return res.status(400).json({
      success: false,
      error: 'ข้อมูลนี้มีอยู่ในระบบแล้ว'
    });
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
         // Foreign key constraint (เช่น อ้างอิงข้อมูลที่ไม่มีอยู่)
    return res.status(400).json({
      success: false,
      error: 'ไม่พบข้อมูลอ้างอิงที่เกี่ยวข้อง'
    });
  }
  
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    // Cannot delete because other records depend on this
    return res.status(400).json({
      success: false,
      error: 'ไม่สามารถลบข้อมูลได้เนื่องจากมีข้อมูลอื่นที่เกี่ยวข้อง'
    });
  }
  
  if (err.code === 'ECONNREFUSED') {
    // Database connection refused
    return res.status(503).json({
      success: false,
      error: 'ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้'
    });
  }

  // ส่งต่อไปยัง errorHandler ปกติ
  next(err);
};

// จัดการ ValidationError จาก middleware validation.js ที่กำหนดเอง
// (ระบบนี้ใช้ validation แบบกำหนดเอง ไม่ได้ใช้ Express Validator package)
exports.handleValidationError = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'ข้อมูลไม่ถูกต้อง',
      details: err.details
    });
  }
  
  next(err);
};

// จัดการ JWT Errors (สำหรับ authentication)
exports.handleJWTError = (err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token ไม่ถูกต้อง'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token หมดอายุ กรุณา login ใหม่'
    });
  }
  
  next(err);
};

// จัดการ Multer Errors (สำหรับ file upload)
exports.handleMulterError = (err, req, res, next) => {
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)'
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'จำนวนไฟล์เกินที่กำหนด'
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'ชื่อฟิลด์ไฟล์ไม่ถูกต้อง'
      });
    }
    
    return res.status(400).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์'
    });
  }
  
  next(err);
};
