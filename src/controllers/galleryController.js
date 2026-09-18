// Controller สำหรับจัดการข้อมูลแกลเลอรี่
const GalleryModel = require('../models/galleryModel');
const { getFileUrl } = require('../middleware/upload');

// ดึงข้อมูลรูปทั้งหมด
exports.getAll = async (req, res, next) => {
  try {
    const gallery = await GalleryModel.findAll();
    
    res.status(200).json({
      success: true,
      count: gallery.length,
      data: gallery
    });
  } catch (error) {
    next(error);
  }
};

// ดึงข้อมูลรูปตาม ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await GalleryModel.findById(id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลรูปภาพที่ต้องการ'
      });
    }
    
    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    next(error);
  }
};

// สร้างข้อมูลรูปใหม่
exports.create = async (req, res, next) => {
  try {
    const data = req.body;

    // ถ้ามีการอัปโหลดไฟล์ ให้ใช้ path ของไฟล์ที่อัปโหลด
    if (req.file) {
      data.image_url = getFileUrl(req.file);
    }

    const imageId = await GalleryModel.create(data);
    const newImage = await GalleryModel.findById(imageId);
    
    res.status(201).json({
      success: true,
      message: 'เพิ่มรูปภาพสำเร็จ',
      data: newImage
    });
  } catch (error) {
    next(error);
  }
};

// แก้ไขข้อมูลรูป
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // ถ้ามีการอัปโหลดไฟล์ใหม่ ให้ใช้ path ของไฟล์ใหม่
    if (req.file) {
      data.image_url = getFileUrl(req.file);
    }

    const image = await GalleryModel.findById(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลรูปภาพที่ต้องการแก้ไข'
      });
    }
    
    const affectedRows = await GalleryModel.update(id, data);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        error: 'ไม่สามารถแก้ไขข้อมูลได้'
      });
    }
    
    const updatedImage = await GalleryModel.findById(id);
    
    res.status(200).json({
      success: true,
      message: 'แก้ไขข้อมูลรูปภาพสำเร็จ',
      data: updatedImage
    });
  } catch (error) {
    next(error);
  }
};

// ลบรูป
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const image = await GalleryModel.findById(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลรูปภาพที่ต้องการลบ'
      });
    }
    
    const affectedRows = await GalleryModel.delete(id);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        error: 'ไม่สามารถลบข้อมูลได้'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'ลบรูปภาพสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};
