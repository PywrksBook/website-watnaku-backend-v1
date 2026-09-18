// Model สำหรับจัดการข้อมูลพระสงฆ์
const { pool } = require('../config/database');

class MonkModel {
  // ดึงข้อมูลพระทั้งหมด
  static async findAll() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM monks ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // ดึงข้อมูลพระตาม ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM monks WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // สร้างข้อมูลพระใหม่
  static async create(data) {
    try {
      const { name, position, bio, image_url, ordination_date } = data;
      
      const [result] = await pool.query(
        'INSERT INTO monks (name, position, bio, image_url, ordination_date) VALUES (?, ?, ?, ?, ?)',
        [name, position || null, bio || null, image_url || null, ordination_date || null]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // แก้ไขข้อมูลพระ
  static async update(id, data) {
    try {
      const { name, position, bio, image_url, ordination_date } = data;
      
      const [result] = await pool.query(
        'UPDATE monks SET name = ?, position = ?, bio = ?, image_url = ?, ordination_date = ? WHERE id = ?',
        [name, position || null, bio || null, image_url || null, ordination_date || null, id]
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // ลบพระ
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM monks WHERE id = ?',
        [id]
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MonkModel;
