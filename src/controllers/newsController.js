// Controller สำหรับจัดการข้อมูลข่าวสาร
const NewsModel = require('../models/newsModel');
const { getFileUrl } = require('../middleware/upload');

// ดึงข้อมูลข่าวทั้งหมด
exports.getAll = async (req, res, next) => {
  try {
    const news = await NewsModel.findAll();
    
    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    next(error);
  }
};

// ดึงข้อมูลข่าวตาม ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newsItem = await NewsModel.findById(id);
    
    if (!newsItem) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลข่าวที่ต้องการ'
      });
    }
    
    res.status(200).json({
      success: true,
      data: newsItem
    });
  } catch (error) {
    next(error);
  }
};

// สร้างข้อมูลข่าวใหม่
exports.create = async (req, res, next) => {
  try {
    const data = req.body;

    // ถ้ามีการอัปโหลดไฟล์รูป ให้ใช้ path ของไฟล์
    if (req.file) {
      data.image_url = getFileUrl(req.file);
    }

    const newsId = await NewsModel.create(data);
    const newNews = await NewsModel.findById(newsId);
    
    res.status(201).json({
      success: true,
      message: 'เพิ่มข้อมูลข่าวสำเร็จ',
      data: newNews
    });
  } catch (error) {
    next(error);
  }
};

// แก้ไขข้อมูลข่าว
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // ถ้ามีการอัปโหลดไฟล์รูปใหม่ ให้ใช้ path ของไฟล์ใหม่
    if (req.file) {
      data.image_url = getFileUrl(req.file);
    }

    const newsItem = await NewsModel.findById(id);
    if (!newsItem) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลข่าวที่ต้องการแก้ไข'
      });
    }
    
    const affectedRows = await NewsModel.update(id, data);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        error: 'ไม่สามารถแก้ไขข้อมูลได้'
      });
    }
    
    const updatedNews = await NewsModel.findById(id);
    
    res.status(200).json({
      success: true,
      message: 'แก้ไขข้อมูลข่าวสำเร็จ',
      data: updatedNews
    });
  } catch (error) {
    next(error);
  }
};

// ลบข่าว
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const newsItem = await NewsModel.findById(id);
    if (!newsItem) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบข้อมูลข่าวที่ต้องการลบ'
      });
    }
    
    const affectedRows = await NewsModel.delete(id);
    
    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        error: 'ไม่สามารถลบข้อมูลได้'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'ลบข้อมูลข่าวสำเร็จ'
    });
  } catch (error) {
    next(error);
  }
};
