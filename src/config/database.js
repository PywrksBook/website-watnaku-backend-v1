// ไฟล์นี้จัดการการเชื่อมต่อกับ MySQL Database
const mysql = require('mysql2/promise');

// สร้าง connection pool เพื่อจัดการ connections อย่างมีประสิทธิภาพ
// Connection Pool = กลุ่มของ connections ที่สร้างไว้พร้อมใช้งาน
// ข้อดี: ไม่ต้องสร้าง connection ใหม่ทุกครั้ง ทำให้เร็วขึ้น
const pool = mysql.createPool({
  host: process.env.DB_HOST,           // ที่อยู่ของ database (localhost)
  user: process.env.DB_USER,           // username สำหรับเข้าใช้งาน (root)
  password: process.env.DB_PASSWORD,    // รหัสผ่าน
  database: process.env.DB_NAME,        // ชื่อ database (watnaku_db)
  waitForConnections: true,             // รอถ้า connections เต็ม
  connectionLimit: 10,                  // จำนวน connections สูงสุดที่เปิดพร้อมกัน
  queueLimit: 0                         // ไม่จำกัดจำนวนคำขอที่รออยู่ในคิว
});

// ฟังก์ชันทดสอบการเชื่อมต่อ database
// async = ฟังก์ชันที่ทำงานแบบ asynchronous (ไม่ block การทำงานอื่น)
const testConnection = async () => {
  try {
    // await = รอให้คำสั่งทำงานเสร็จก่อนทำบรรทัดถัดไป
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    console.log(`📊 Connected to: ${process.env.DB_NAME}`);
    
    // คืน connection กลับเข้า pool เมื่อใช้เสร็จ
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1); // หยุดโปรแกรมถ้าเชื่อมต่อไม่ได้
  }
};

// Export pool และ testConnection เพื่อให้ไฟล์อื่นใช้งานได้
module.exports = { pool, testConnection };
