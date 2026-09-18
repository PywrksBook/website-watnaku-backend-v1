// Model สำหรับจัดการข้อมูลข่าวสาร
const { pool } = require('../config/database');

class NewsModel {
  // ดึงข้อมูลข่าวทั้งหมด
  static async findAll() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM news ORDER BY published_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // ดึงข้อมูลข่าวตาม ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM news WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // สร้างข้อมูลข่าวใหม่
  static async create(data) {
    try {
      const { title, content, image_url } = data;
      
      const [result] = await pool.query(
        'INSERT INTO news (title, content, image_url) VALUES (?, ?, ?)',
        [title, content, image_url || null]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // แก้ไขข้อมูลข่าว
  static async update(id, data) {
    try {
      const { title, content, image_url } = data;
      
      const [result] = await pool.query(
        'UPDATE news SET title = ?, content = ?, image_url = ? WHERE id = ?',
        [title, content, image_url || null, id]
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // ลบข่าว
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM news WHERE id = ?',
        [id]
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NewsModel;
