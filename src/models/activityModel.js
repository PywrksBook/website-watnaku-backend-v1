// Model สำหรับจัดการข้อมูลกิจกรรม
const { pool } = require('../config/database');

class ActivityModel {
  // ดึงข้อมูลกิจกรรมทั้งหมด
  static async findAll() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM activities ORDER BY activity_date DESC, created_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // ดึงข้อมูลกิจกรรมตาม ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM activities WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // สร้างข้อมูลกิจกรรมใหม่
  static async create(data) {
    try {
      const { title, description, activity_date, image_url } = data;
      
      const [result] = await pool.query(
        'INSERT INTO activities (title, description, activity_date, image_url) VALUES (?, ?, ?, ?)',
        [title, description || null, activity_date || null, image_url || null]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // แก้ไขข้อมูลกิจกรรม
  static async update(id, data) {
    try {
      const { title, description, activity_date, image_url } = data;
      
      const [result] = await pool.query(
        'UPDATE activities SET title = ?, description = ?, activity_date = ?, image_url = ? WHERE id = ?',
        [title, description || null, activity_date || null, image_url || null, id]
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // ลบกิจกรรม
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM activities WHERE id = ?',
        [id]
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ActivityModel;
