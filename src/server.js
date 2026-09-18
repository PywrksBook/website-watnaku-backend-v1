// โหลด environment variables จากไฟล์ .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Import database config
const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const templeRoutes = require('./routes/templeRoutes');
const monkRoutes = require('./routes/monkRoutes');
const activityRoutes = require('./routes/activityRoutes');
const newsRoutes = require('./routes/newsRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

// Import error handlers
const {
  notFound,
  errorHandler,
  handleDatabaseError,
  handleValidationError,
  handleJWTError,
  handleMulterError
} = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware Configuration
// ============================================

// CORS - อนุญาตให้ frontend เรียกใช้ API จากต่างโดเมน
app.use(cors());

// Body Parser - แปลง request body เป็น JSON และ URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - สำหรับเสิร์ฟไฟล์รูปภาพที่อัพโหลด
app.use('/uploads', express.static('uploads'));

// Static files - สำหรับเสิร์ฟหน้าเว็บ (frontend)
app.use(express.static('public'));
// Logging middleware (Development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// Routes
// ============================================

// Health check endpoint - ตรวจสอบว่า server ทำงานปกติ
const healthCheck = (req, res) => {
  res.json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};

app.get('/api/health', healthCheck);
app.get('/api/v1/health', healthCheck);

// API Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', templeRoutes);
app.use('/api/v1', monkRoutes);
app.use('/api/v1', activityRoutes);
app.use('/api/v1', newsRoutes);
app.use('/api/v1', galleryRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ยินดีต้อนรับสู่ Watnaku Temple Management API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      temple: '/api/v1/temple',
      monks: '/api/v1/monks',
      activities: '/api/v1/activities',
      news: '/api/v1/news',
      gallery: '/api/v1/gallery'
    }
  });
});

// ============================================
// Error Handling Middleware
// ============================================

// จัดการ 404 Not Found (ต้องอยู่หลัง routes ทั้งหมด)
app.use(notFound);

// จัดการ errors แต่ละประเภท
app.use(handleDatabaseError);
app.use(handleValidationError);
app.use(handleJWTError);
app.use(handleMulterError);

// Global Error Handler (ต้องอยู่สุดท้าย)
app.use(errorHandler);

// ============================================
// Start Server
// ============================================

const startServer = async () => {
  try {
    // ทดสอบการเชื่อมต่อ database ก่อน
    await testConnection();
    
    // ถ้าเชื่อมต่อสำเร็จ ค่อยเปิด server
    app.listen(PORT, () => {
      console.log('\n===========================================');
      console.log('🚀 Watnaku Temple Management API');
      console.log('===========================================');
      console.log(`📡 Server running on: http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`);
      console.log(`🔐 Auth API: http://localhost:${PORT}/api/v1/auth`);
      console.log(`🏛️  Temple API: http://localhost:${PORT}/api/v1/temple`);
      console.log(`👤 Monks API: http://localhost:${PORT}/api/v1/monks`);
      console.log(`📅 Activities API: http://localhost:${PORT}/api/v1/activities`);
      console.log(`📰 News API: http://localhost:${PORT}/api/v1/news`);
      console.log(`🖼️  Gallery API: http://localhost:${PORT}/api/v1/gallery`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('===========================================\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1); // หยุดโปรแกรมถ้า start ไม่ได้
  }
};

// เริ่มต้น server
startServer();

// จัดการ Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// จัดการ Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});
