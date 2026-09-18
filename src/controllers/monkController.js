// Controller สำหรับจัดการข้อมูลพระสงฆ์
const MonkModel = require('../models/monkModel');
const { getFileUrl } = require('../middleware/upload');

// ดึงข้อมูลพระทั้งหมด
exports.getAll = async (req, res, next) => {
  try {
    const monks = await MonkModel.findAll();
    
    res.status(200).json({
      success: true,
      count: monks.length,
      data: monks
    });
  } catch (error) {
    next(error);
  }
};

// ดึงข้อมูลพระตาม ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const monk = await MonkModel.findById(id);
    
    if (!monk) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลพระสงฆ์ที่ต้องการ'
      });
    }
    
    res.status(200).json({
      success: true,
      data: monk
    });
  } catch (error) {
    next(error);
  }
};

// สร้างข้อมูลพระใหม่
exports.create = async (req, res, next) => {
  try {
    const data = req.body;

    // ถ้ามีการอัปโหลดไฟล์รูป ให้ใช้ path ของไฟล์
    if (req.file) {
      data.image_url = getFileUrl(req.file);
    }

    const monkId = await MonkModel.create(data);
    const newMonk = await MonkModel.findById(monkId);
    
    res.status(201).json({
      success: true,
      message: 'เพิ่มข้อมูลพระสงฆ์สำเร็จ',
      data: newMonk
    });
  } catch (error) {
    next(error);
  }
};

// แก้ไขข้อมูลพระ
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // ถ้ามีการอัปโหลดไฟล์รูปใหม่ ให้ใช้ path ของไฟล์ใหม่
    if (req.file) {
      data.image_url = getFileUrl(req.file);
    }

    const monk = await MonkModel.findById(id);
    if (!monk) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลพระสงฆ์ที่ต้องการแก้ไข'
      });
    }
    
    const affectedRows = await MonkModel.update(id, data);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        error: 'ไม่สามารถแก้ไขข้อมูลได้'
      });
    }
    
    const updatedMonk = await MonkModel.findById(id);
    
    res.status(200).json({
      success: true,
      message: 'แก้ไขข้อมูลพระสงฆ์สำเร็จ',
      data: updatedMonk
    });
  } catch (error) {
    next(error);
  }
};

// ลบพระ
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const monk = await MonkModel.findById(id);
    if (!monk) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลพระสงฆ์ที่ต้องการลบ'
      });
    }
    
    const affectedRows = await MonkModel.delete(id);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        error: 'ไม่สามารถลบข้อมูลได้'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'ลบข้อมูลพระสงฆ์สำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};
