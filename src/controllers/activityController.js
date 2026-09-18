// Controller สำหรับจัดการข้อมูลกิจกรรม
const ActivityModel = require('../models/activityModel');
const { getFileUrl } = require('../middleware/upload');

// ดึงข้อมูลกิจกรรมทั้งหมด
exports.getAll = async (req, res, next) => {
  try {
    const activities = await ActivityModel.findAll();
    
    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    next(error);
  }
};

// ดึงข้อมูลกิจกรรมตาม ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const activity = await ActivityModel.findById(id);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลกิจกรรมที่ต้องการ'
      });
    }
    
    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    next(error);
  }
};

// สร้างข้อมูลกิจกรรมใหม่
exports.create = async (req, res, next) => {
  try {
    const data = req.body;

    // ถ้ามีการอัปโหลดไฟล์รูป ให้ใช้ path ของไฟล์
    if (req.file) {
      data.image_url = getFileUrl(req.file);
    }

    const activityId = await ActivityModel.create(data);
    const newActivity = await ActivityModel.findById(activityId);
    
    res.status(201).json({
      success: true,
      message: 'เพิ่มข้อมูลกิจกรรมสำเร็จ',
      data: newActivity
    });
  } catch (error) {
    next(error);
  }
};

// แก้ไขข้อมูลกิจกรรม
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // ถ้ามีการอัปโหลดไฟล์รูปใหม่ ให้ใช้ path ของไฟล์ใหม่
    if (req.file) {
      data.image_url = getFileUrl(req.file);
    }

    const activity = await ActivityModel.findById(id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลกิจกรรมที่ต้องการแก้ไข'
      });
    }
    
    const affectedRows = await ActivityModel.update(id, data);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        error: 'ไม่สามารถแก้ไขข้อมูลได้'
      });
    }
    
    const updatedActivity = await ActivityModel.findById(id);
    
    res.status(200).json({
      success: true,
      message: 'แก้ไขข้อมูลกิจกรรมสำเร็จ',
      data: updatedActivity
    });
  } catch (error) {
    next(error);
  }
};

// ลบกิจกรรม
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const activity = await ActivityModel.findById(id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลกิจกรรมที่ต้องการลบ'
      });
    }
    
    const affectedRows = await ActivityModel.delete(id);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        error: 'ไม่สามารถลบข้อมูลได้'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'ลบข้อมูลกิจกรรมสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};
