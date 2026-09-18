// Controller สำหรับจัดการข้อมูลวัด (Single Temple System)
const TempleModel = require('../models/templeModel');
const { getFileUrl } = require('../middleware/upload');

// ดึงข้อมูลวัด (มีแค่วัดเดียว)
exports.getInfo = async (req, res, next) => {
  try {
    const temple = await TempleModel.getInfo();
    
    if (!temple) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลวัด'
      });
    }
    
    res.status(200).json({
      success: true,
      data: temple
    });
  } catch (error) {
    next(error);
  }
};

// แก้ไขข้อมูลวัด
exports.update = async (req, res, next) => {
  try {
    const data = req.body;

    // ถ้ามีการอัปโหลดไฟล์รูป ให้ใช้ path ของไฟล์ที่อัปโหลด
    if (req.file) {
      data.image_url = getFileUrl(req.file);
    }
    
    // ตรวจสอบว่ามีข้อมูลวัดอยู่หรือไม่
    const temple = await TempleModel.getInfo();
    if (!temple) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลวัด'
      });
    }
    
    // แก้ไขข้อมูล
    const affectedRows = await TempleModel.update(data);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        error: 'ไม่สามารถแก้ไขข้อมูลได้'
      });
    }
    
    // ดึงข้อมูลที่แก้ไขแล้วมาส่งกลับ
    const updatedTemple = await TempleModel.getInfo();
    
    res.status(200).json({
      success: true,
      message: 'แก้ไขข้อมูลวัดสำเร็จ',
      data: updatedTemple
    });
  } catch (error) {
    next(error);
  }
};
