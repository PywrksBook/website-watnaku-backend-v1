// Model สำหรับจัดการข้อมูลผู้ดูแลระบบ (admins)
const { pool } = require('../config/database');

class AdminModel {
  // ค้นหาผู้ดูแลระบบจาก username
  static async findByUsername(username) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM admins WHERE username = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // ค้นหาผู้ดูแลระบบจาก ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT id, username, email, created_at FROM admins WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // สร้างผู้ดูแลระบบใหม่
  static async create(data) {
    try {
      const { username, password_hash, email } = data;

      const [result] = await pool.query(
        'INSERT INTO admins (username, password_hash, email) VALUES (?, ?, ?)',
        [username, password_hash, email || null]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AdminModel;
