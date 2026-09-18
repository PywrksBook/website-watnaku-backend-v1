// Middleware สำหรับตรวจสอบความถูกต้องของข้อมูล (Input Validation)
// Validation = ตรวจสอบข้อมูลก่อนส่งไปเก็บใน database

// ตรวจสอบข้อมูลวัด
exports.validateTemple = (req, res, next) => {
  
  const { name, address, phone } = req.body;
  const errors = [];

  // ตรวจสอบชื่อวัด (required)
  if (!name || name.trim() === '') {
    errors.push('กรุณาระบุชื่อวัด');
  } else if (name.length > 200) {
    errors.push('ชื่อวัดต้องไม่เกิน 200 ตัวอักษร');
  }

  // ตรวจสอบที่อยู่ (required)
  if (!address || address.trim() === '') {
    errors.push('กรุณาระบุที่อยู่วัด');
  }

  // ตรวจสอบเบอร์โทรศัพท์ (optional แต่ถ้ามีต้องถูกต้อง)
  if (phone) {
    // Regex สำหรับเบอร์โทรไทย: รับรูปแบบต่างๆ
    // ตัวอย่าง: 0801234567, 043-123456, 043-999999, 0-8012-34567
    const phoneRegex = /^0[\d]{8,9}$|^0[\d]{2,3}-[\d]{6,7}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      errors.push('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ตัวอย่าง: 0812345678 หรือ 043-123456 หรือ 043-999999)');
    }
  }

  // ถ้ามี errors ส่ง response 400 Bad Request
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'ข้อมูลไม่ถูกต้อง',
      details: errors
    });
  }

  // ถ้าผ่านการตรวจสอบ ให้ทำงานต่อ (ไปยัง controller)
  next();
};

// ตรวจสอบข้อมูลพระสงฆ์
exports.validateMonk = (req, res, next) => {
  const { name, position, ordination_date } = req.body;
  const errors = [];

  // ตรวจสอบชื่อพระ (required)
  if (!name || name.trim() === '') {
    errors.push('กรุณาระบุชื่อพระสงฆ์');
  } else if (name.length > 200) {
    errors.push('ชื่อพระสงฆ์ต้องไม่เกิน 200 ตัวอักษร');
  }

  // ตรวจสอบตำแหน่ง (optional)
  if (position && position.length > 100) {
    errors.push('ตำแหน่งต้องไม่เกิน 100 ตัวอักษร');
  }

  // ตรวจสอบวันอุปสมบท (optional แต่ถ้ามีต้องเป็นรูปแบบวันที่)
  if (ordination_date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(ordination_date)) {
      errors.push('รูปแบบวันที่ไม่ถูกต้อง (ตัวอย่าง: 2024-12-31)');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'ข้อมูลไม่ถูกต้อง',
      details: errors
    });
  }

  next();
};

// ตรวจสอบข้อมูลกิจกรรม
exports.validateActivity = (req, res, next) => {
  const { title, activity_date } = req.body;
  const errors = [];

  // ตรวจสอบชื่อกิจกรรม (required)
  if (!title || title.trim() === '') {
    errors.push('กรุณาระบุชื่อกิจกรรม');
  } else if (title.length > 255) {
    errors.push('ชื่อกิจกรรมต้องไม่เกิน 255 ตัวอักษร');
  }

  // ตรวจสอบวันที่จัดกิจกรรม (optional แต่ถ้ามีต้องเป็นรูปแบบวันที่)
  if (activity_date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(activity_date)) {
      errors.push('รูปแบบวันที่ไม่ถูกต้อง (ตัวอย่าง: 2024-12-31)');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'ข้อมูลไม่ถูกต้อง',
      details: errors
    });
  }

  next();
};

// ตรวจสอบข้อมูลข่าวสาร
exports.validateNews = (req, res, next) => {
  const { title, content } = req.body;
  const errors = [];

  // ตรวจสอบหัวข้อข่าว (required)
  if (!title || title.trim() === '') {
    errors.push('กรุณาระบุหัวข้อข่าว');
  } else if (title.length > 255) {
    errors.push('หัวข้อข่าวต้องไม่เกิน 255 ตัวอักษร');
  }

  // ตรวจสอบเนื้อหาข่าว (required)
  if (!content || content.trim() === '') {
    errors.push('กรุณาระบุเนื้อหาข่าว');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'ข้อมูลไม่ถูกต้อง',
      details: errors
    });
  }

  next();
};

// ตรวจสอบข้อมูลแกลเลอรี่
exports.validateGallery = (req, res, next) => {
  const { image_url } = req.body;
  const errors = [];

  // ตรวจสอบ URL รูปภาพ (required)
  // ยอมรับได้ทั้งการส่ง URL มาใน body หรือการอัปโหลดไฟล์ (req.file)
  if ((!image_url || image_url.trim() === '') && !req.file) {
    errors.push('กรุณาระบุ URL รูปภาพ หรืออัปโหลดไฟล์รูป');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'ข้อมูลไม่ถูกต้อง',
      details: errors
    });
  }

  next();
};

// ตรวจสอบข้อมูล Admin (สำหรับ Registration)
exports.validateAdmin = (req, res, next) => {
  const { username, password, email } = req.body;
  const errors = [];

  // ตรวจสอบ username (required)
  if (!username || username.trim() === '') {
    errors.push('กรุณาระบุ username');
  } else if (username.length < 3 || username.length > 50) {
    errors.push('username ต้องมีความยาว 3-50 ตัวอักษร');
  }

  // ตรวจสอบ password (required)
  if (!password || password.trim() === '') {
    errors.push('กรุณาระบุรหัสผ่าน');
  } else if (password.length < 6) {
    errors.push('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
  }

  // ตรวจสอบ email (optional แต่ถ้ามีต้องถูกต้อง)
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('รูปแบบ email ไม่ถูกต้อง');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'ข้อมูลไม่ถูกต้อง',
      details: errors
    });
  }

  next();
};

// ตรวจสอบข้อมูล Login
exports.validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  // ตรวจสอบ username (required)
  if (!username || username.trim() === '') {
    errors.push('กรุณาระบุ username');
  }

  // ตรวจสอบ password (required)
  if (!password || password.trim() === '') {
    errors.push('กรุณาระบุรหัสผ่าน');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      details: errors
    });
  }

  next();
};
