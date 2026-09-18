// Model สำหรับจัดการข้อมูลวัดในฐานข้อมูล
const { pool } = require('../config/database');

class TempleModel {
  // ดึงข้อมูลวัด (มีแค่ 1 วัดเสมอ)
  static async getInfo() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM temple_info WHERE id = 1'
      );
      return rows[0]; // return ข้อมูลวัดเดียว
    } catch (error) {
      throw error;
    }
  }

  // แก้ไขข้อมูลวัด (แก้ไขได้เฉพาะ id = 1 เท่านั้น)
  static async update(data) {
    try {
      const { name, address, phone, history, image_url } = data;
      
      const [result] = await pool.query(
        'UPDATE temple_info SET name = ?, address = ?, phone = ?, history = ?, image_url = ? WHERE id = 1',
        [name, address, phone || null, history || null, image_url || null]
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TempleModel;
