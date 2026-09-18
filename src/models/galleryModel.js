// Model สำหรับจัดการข้อมูลแกลเลอรี่
const { pool } = require('../config/database');

class GalleryModel {
  // ดึงข้อมูลรูปทั้งหมด
  static async findAll() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM gallery ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // ดึงข้อมูลรูปตาม ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM gallery WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // สร้างข้อมูลรูปใหม่
  static async create(data) {
    try {
      const { image_url, caption } = data;
      
      const [result] = await pool.query(
        'INSERT INTO gallery (image_url, caption) VALUES (?, ?)',
        [image_url, caption || null]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // แก้ไขข้อมูลรูป
  static async update(id, data) {
    try {
      const { image_url, caption } = data;
      
      const [result] = await pool.query(
        'UPDATE gallery SET image_url = ?, caption = ? WHERE id = ?',
        [image_url, caption || null, id]
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // ลบรูป
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM gallery WHERE id = ?',
        [id]
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GalleryModel;
