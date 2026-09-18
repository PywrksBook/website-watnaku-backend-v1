-- ========================================
-- Watnaku Temple Management Database Schema
-- ========================================
-- วิธีใช้: mysql -u root -p < schema.sql
-- ========================================

-- สร้างฐานข้อมูลเมื่อยังไม่มี (ปลอดภัยต่อการรันซ้ำ)
CREATE DATABASE IF NOT EXISTS watnaku_db CHARACTER SET utf8mb4;
USE watnaku_db;

-- ========================================
-- ตาราง (Tables)
-- ========================================

-- ตาราง temple_info สำหรับข้อมูลวัดเดียว (มีแค่ 1 แถวเท่านั้น)
CREATE TABLE temple_info (
  id INT PRIMARY KEY CHECK (id = 1),
  name VARCHAR(200) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  history TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ตาราง admins สำหรับผู้ดูแลระบบ
CREATE TABLE admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง monks สำหรับข้อมูลพระสงฆ์ (ไม่มี temple_id)
CREATE TABLE monks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  position VARCHAR(100),
  bio TEXT,
  image_url VARCHAR(255),
  ordination_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง activities สำหรับกิจกรรมวัด (ไม่มี temple_id)
CREATE TABLE activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  activity_date DATE,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง news สำหรับข่าวสารวัด (ไม่มี temple_id)
CREATE TABLE news (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(255),
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง gallery สำหรับรูปภาพวัด (ไม่มี temple_id)
CREATE TABLE gallery (
  id INT PRIMARY KEY AUTO_INCREMENT,
  image_url VARCHAR(255) NOT NULL,
  caption TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ข้อมูลเริ่มต้น (Seed Data)
-- ========================================

-- ข้อมูลวัด (1 แถวเดียว)
INSERT INTO temple_info (id, name, address, phone, history) VALUES
(1, 'วัดนาคู', '123 ถนนประชาธิปัตย์ ต.ในเมือง อ.เมือง จ.ขอนแก่น 40000', '043-123456', 'วัดเก่าแก่มีประวัติยาวนาน ตั้งอยู่ในใจกลางเมืองขอนแก่น');

-- ข้อมูลพระสงฆ์
INSERT INTO monks (name, position, bio, ordination_date) VALUES
('พระครูสุวรรณวิหารคุณ', 'เจ้าอาวาส', 'เจ้าอาวาสวัดนาคู มีความรู้ในพระธรรมวินัยยิ่ง', '1990-07-15'),
('พระมหาสมชาย จิตตสุภโร', 'รองเจ้าอาวาส', 'เปรียญธรรม 5 ประโยค ท่องเทพศาสตร์ได้', '1995-08-22'),
('พระมหาวิชัย ธมฺมทีโป', 'พระสังฆาธิการ', 'พระนักเทศน์ผู้เชี่ยวชาญ', '2000-04-10');

-- ข้อมูลกิจกรรม
INSERT INTO activities (title, description, activity_date) VALUES
('ถวายโภคนฏฐแก่พระสงฆ์', 'อบรมการถวายโภคนฏฐโดยวิธีที่ถูกต้องตามพระวินัย', '2024-12-15'),
('บวชน้อย', 'พิธีบวชน้อยสำหรับเยาวชนในช่วงปิดเทอม', '2024-04-13'),
('ทำบุญวันวิสาขบูชา', 'พิธีทำบุญเนื่องในวันวิสาขบูชา', '2024-05-22');

-- ข้อมูลข่าวสาร
INSERT INTO news (title, content) VALUES
('วัดนาคูจัดกิจกรรมเลี้ยงสังฆาคม', 'วัดนาคูขอเรียนชวนให้ท่านศรัทธาพร้อมใจเข้าไปร่วมเลี้ยงสังฆาคมเนื่องในวันสำคัญทางพระพุทธศาสนา'),
('ปลูกต้นไม้ภูมิปัญญาไทย', 'วัดนาคูร่วมกับชุมชนในการปลูกต้นไม้ภูมิปัญญาไทยจำนวน 500 ต้น เพื่อสิ่งแวดล้อมที่ดี'),
('เปิดรับสมัครเรียนพระปริยัติธรรม', 'วัดนาคูเปิดรับสมัครเยาวชนเข้าเรียนพระปริยัติธรรม เพื่อศึกษาหลักธรรมคำสอน');

-- ========================================
-- การสร้าง Admin (ทำหลังรัน schema.sql เสร็จ)
-- ========================================
-- วิธีทำง่ายที่สุด: ใช้ MySQL Workbench หรือ phpMyAdmin
-- ดูวิธีสร้าง bcrypt hash + INSERT ใน README.md ขั้นตอน "สร้างผู้ดูแลระบบ"
-- ========================================

-- ข้อมูลแกลเลอรี่
INSERT INTO gallery (image_url, caption) VALUES
('/uploads/temple-main.jpg', 'วิหารหลักของวัดนาคู'),
('/uploads/temple-sala.jpg', 'ศาลาการเปรียญในเวลาเช้า'),
('/uploads/temple-pagoda.jpg', 'เจดีย์ประธานของวัด'),
('/uploads/temple-gate.jpg', 'ประตูทางเข้าวัด');
