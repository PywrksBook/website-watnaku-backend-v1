# Watnaku Temple Management API

Backend API สำหรับบริหารจัดการข้อมูลวัดนาคู พัฒนาโดยใช้ **Node.js + Express + MySQL**
ระบบเป็น REST API ที่รองรับการจัดการข้อมูลวัด พระสงฆ์ กิจกรรม ข่าวสาร และแกลเลอรี่รูปภาพ พร้อมระบบยืนยันตัวตน (JWT) และอัปโหลดรูป

---

## เทคโนโลยี (Tech Stack)

| ส่วน | เทคโนโลยี |
|------|-----------|
| Runtime | Node.js (v20+) |
| Framework | Express.js 5 |
| Database | MySQL (ใช้ mysql2/promise + Connection Pool) |
| Auth | JSON Web Token (jsonwebtoken) |
| Password Hash | bcrypt |
| File Upload | multer (รองรับรูปสูงสุด 5 MB) |
| Env | dotenv |
| Dev Tool | nodemon |
| อื่นๆ | cors, express.static (สำหรับ /uploads และ /public) |

---

## 📁 โครงสร้างโปรเจค (Project Structure)

```
website-watnaku-v1/
├── src
│   ├── config/
│   │   └── database.js        # ตั้งค่า MySQL Connection Pool + ทดสอบการเชื่อมต่อ
│   ├── controllers/
│   │   ├── authController.js  # login, getMe
│   │   ├── templeController.js, monkController.js,
│   │   ├── activityController.js, newsController.js,
│   │   └── galleryController.js
│   ├── middleware/
│   │   ├── auth.js            # ตรวจสอบ JWT Bearer Token
│   │   ├── upload.js          # multer (5MB, เฉพาะรูป, field "image")
│   │   ├── validation.js      # ตรวจสอบข้อมูลเข้า (กำหนดเอง)
│   │   └── errorHandler.js    # จัดการ error (404, DB error, JWT, Multer)
│   ├── models/                # คิวรี MySQL (ใช้ Parameterized Queries)
│   ├── routes/                # 6 route files (แยกตามหมวด)
│   └── server.js              # entry point — ตั้งค่า Express, routes, error handlers
├── uploads/                   # เก็บไฟล์รูปที่อัปโหลด (เปล่า, .gitkeep เท่า)
├── schema.sql                 # โครงสร้างฐานข้อมูล + seed data (ไม่มีรหัสผ่าน default)
├── .env.example               # ตัวอย่าง environment variables
├── .gitignore
└── package.json
```


---

##  เริ่มต้นใช้งาน

### ข้อก่อนหน้าต่อไป (Prerequisites)

- **Node.js** v20+ → ตรวจสอบด้วย `node -v`
- **npm** → มาพร้อม Node.js (`npm -v`)
- **MySQL** 8.0+ (หรือ MariaDB 10.5+)

### ขั้นตอนติดตั้ง

1. ดาวน์โหลด/คัดลอกโปรเจคหรือเปิดโฟลเดอร์ที่คุณได้มา
2. ติดตั้ง dependencies:
   ```bash
   npm install
   ```

### ตั้งค่า Environment Variables

1. คัดลอกไฟล์ตัวอย่าง:
   ```bash
   # Windows:
   copy .env.example .env
   # macOS / Linux:
   cp .env.example .env
   ```
2. แก้ไข `.env` ด้วย text editor ใดๆ → ตั้งค่าตามเครื่องของคุณ:
   ```env
   PORT=3000
   NODE_ENV=development

   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=           # ← ใส่รหัสผ่าน MySQL ของคุณ
   DB_NAME=watnaku_db

   JWT_SECRET=change_this_to_a_long_random_secret_string
   JWT_EXPIRES_IN=1d

   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=5242880
   ```
> ⚠️ **ไม่ควร commit ไฟล์ `.env`** — มีข้อมูลลับอยู่ ตรวจสอบให้แน่ใจว่า `JWT_SECRET` เป็นค่าที่ปลอดภัย

### ตั้งค่าฐานข้อมูล (Create Database)

```bash
mysql -u root -p < schema.sql
```
(ระบบจะสร้างฐานข้อมูล `watnaku_db` พร้อม 6 ตาราง + seed data ของวัด พระ กิจกรรม ข่าว และแกลเลอรี่อัตโนมัติ)

---

##  สร้างผู้ดูแลระบบ (Admin Account)

**ฐานข้อมูลไม่มีบัญชี admin เริ่มต้น** — คุณต้องสร้างเอง 3 ขั้นตอน:

### ขั้นตอนที่ 1: สร้าง bcrypt hash ของรหัสผ่าน

เปิด Terminal ไปที่โฟลเดอร์โปรเจคแล้วรัน:

```bash
node -e "console.log(require('bcrypt').hashSync('รหัสผ่านที่คุณตั้ง', 10))"
```

ตัวอย่าง:
```bash
node -e "console.log(require('bcrypt').hashSync('your-password', 10))"
```
คัดลอกค่าที่ได้ (ข้อความยาว เช่น `$2b$10$RpMO...` — ขึ้นอยู่กับรหัสผ่าน)

### ขั้นตอนที่ 2: ใส่ hash ลงฐานข้อมูล

ใช้ MySQL Workbench หรือ CLI รันคิวรี:

```sql
USE watnaku_db;
INSERT INTO admins (username, password_hash, email)
VALUES ('admin', '<วาง hash ที่คัดลอกมา>', 'admin@watnaku.com');
```

---

## ▶️ เริ่มเซิร์ฟเวอร์

```bash
npm run dev     # ปกติ (รีสตาร์ตอัตโนมัติเมื่อแก้ไฟล์)
# หรือ
npm start       # รันจริง (ไม่รีสตาร์ต)
```
Start server สำเร็จ
🚀 Watnaku Temple Management API
📡 Server running on: http://localhost:3000
📊 Health check: http://localhost:3000/api/v1/health
```

---

## 🔍 ทดสอบว่าเซิร์ฟเวอร์ทำงาน

```bash
curl http://localhost:3000/api/v1/health
```

ผลต้องได้:
```json
{
  "success": true,
  "message": "Server is running!",
  ...
}
```

---

## 🔐 เข้าสู่ระบบ (Login)

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"รหัสผ่านที่คุณตั้ง"}'
```

ถ้าถูกต้อง จะได้:
```json
{
  "success": true,
  "message": "เข้าสู่ระบบสำเร็จ",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": { "id": 1, "username": "admin", "email": "admin@watnaku.com" }
}
```

คัดลอกค่า `token` (ข้อความยาว) ไปใช้ต่อ

### ส่ง Token ไปยัง API ที่ต้องการ login

เติมในหัวข้อ (Header) ทุก request:
```
Authorization: Bearer ค่า_Token_ที่คัดลอกมา
```


---

## 📋 รายชื่อ API Endpoints

> 📌 URL พื้นฐาน: `http://localhost:3000`
> 📌 คำขอที่ต้อง `🔐` = ต้องใส่ JWT Bearer Token

| หมวด | เมธอด | URL | สาธารณะ/ต้อง login | รายละเอียด |
|------|--------|-----|--------------------|------------|
| **Auth** | POST | `/api/v1/auth/login` | สาธารณะ | เข้าสู่ระบบ → ได้ token |
| **Auth** | GET | `/api/v1/auth/me` | 🔐 | ดูข้อมูล admin ที่ login อยู่ |
| **Temple** | GET | `/api/v1/temple` | สาธารณะ | ดูข้อมูลวัด (มีแค่ 1) |
| **Temple** | PUT | `/api/v1/temple` | 🔐 + รูปได้ | แก้ไขข้อมูลวัด |
| **Monks** | GET | `/api/v1/monks` | สาธารณะ | รายชื่อพระทั้งหมด |
| **Monks** | GET | `/api/v1/monks/:id` | สาธารณะ | ดูพระตาม id |
| **Monks** | POST | `/api/v1/monks` | 🔐 + รูปได้ | เพิ่มพระใหม่ |
| **Monks** | PUT | `/api/v1/monks/:id` | 🔐 + รูปได้ | แก้ไขข้อมูลพระ |
| **Monks** | DELETE | `/api/v1/monks/:id` | 🔐 | ลบพระ |
| **Activities** | GET | `/api/v1/activities` | สาธารณะ | รายชื่อกิจกรรม |
| **Activities** | GET | `/api/v1/activities/:id` | สาธารณะ | ดูกิจกรรมตาม id |
| **Activities** | POST | `/api/v1/activities` | 🔐 + รูปได้ | เพิ่มกิจกรรม |
| **Activities** | PUT | `/api/v1/activities/:id` | 🔐 + รูปได้ | แก้ไขกิจกรรม |
| **Activities** | DELETE | `/api/v1/activities/:id` | 🔐 | ลบกิจกรรม |
| **News** | GET | `/api/v1/news` | สาธารณะ | รายชื่อข่าว |
| **News** | GET | `/api/v1/news/:id` | สาธารณะ | ดูข่าวตาม id |
| **News** | POST | `/api/v1/news` | 🔐 + รูปได้ | เพิ่มข่าว |
| **News** | PUT | `/api/v1/news/:id` | 🔐 + รูปได้ | แก้ไขข่าว |
| **News** | DELETE | `/api/v1/news/:id` | 🔐 | ลบข่าว |
| **Gallery** | GET | `/api/v1/gallery` | สาธารณะ | รายชื่อรูปทั้งหมด |
| **Gallery** | GET | `/api/v1/gallery/:id` | สาธารณะ | ดูรูปตาม id |
| **Gallery** | POST | `/api/v1/gallery` | 🔐 + รูปได้ | อัปโหลดรูปใหม่ |
| **Gallery** | PUT | `/api/v1/gallery/:id` | 🔐 + รูปได้ | แก้ไข caption หรือรูป |
| **Gallery** | DELETE | `/api/v1/gallery/:id` | 🔐 | ลบรูป |

> 🟢 คำท้ายคอลัมน์ "รูปได้" = สามารถแนบรูปภาพได้ (field ชื่อ `image`)

---

##  อัปโหลดรูปภาพ (Image Upload)

รองรับการอัปโหลดรูปภาพผ่าน **field ชื่อ `image`** :

- รองรับไฟล์: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- ขนาดไฟล์สูงสุด: **5 MB**
- ตั้งชื่อไฟล์ใหม่อัตโนมัติ (ป้องกันการซ้ำ) → เก็บที่โฟลเดอร์ `uploads/`
- URL ของรูปให้เข้าถึงได้ที่: `http://localhost:3000/uploads/<ชื่อ_ไฟล์>`

ตัวอย่างการอัปโหลดด้วย curl:
```bash
curl -X POST http://localhost:3000/api/v1/gallery \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/your/image.jpg" \
  -F "caption=คำบรรยายรูป"
```

---

##  ระบบความปลอดภัย (Security)

- **ไม่มี route `/auth/register`** — บัญชี admin ต้องสร้างเองภายในฐานข้อมูล (ดูขั้นตอน "สร้างผู้ดูแลระบบ")
- รหัสผ่านเข้ารหัสด้วย **bcrypt** (SALT_ROUNDS = 10)
- JWT Token มีอายุจำกัด (`JWT_EXPIRES_IN=1d`)
- ใช้ **Parameterized Queries** ป้องกัน SQL Injection
- คำขอที่ต้อง login (POST/PUT/DELETE) ถูกป้องกันโดย middleware `auth.js`

---

##  การจัดการข้อผิดพลาด (Error Handling)

ระบบมี middleware จัดการ error ครบวงจร:

| ประเภท | สถานะ | รายละเอียด |
|--------|------|-----------|
| 404 Not Found | 404 | ไม่มี route หรือข้อมูลที่ขอ |
| Validation Error | 400 | ข้อมูลผิดพลาด (กรอบตามกฎ) |
| Auth Error | 401 | ไม่มี token หรือ token ไม่ถูกต้อง |
| Duplicate Entry | 400 | มูลค่าที่ซ้ำ (เช่น username) |
| File Too Large | 400 | รูปใหญ่เกิน 5MB |
| Unexpected File | 400 | ชื่อ field ไฟล์ผิด |
| DB Connection Failed | 503 | เชื่อมต่อ MySQL ไม่ได้ |
| Internal Server Error | 500 | ข้อผิดพลาดภายในเซิร์ฟเวอร์ |

---

## ทดสอบ API

คุณสามารถใช้ **Postman** หรือ **curl** ทดสอบได้โดยตรง

---

##  License

โครงการนี้เป็นส่วนหนึ่งของการฝึกฝนส่วนบุคคล — License: Not specified

---


