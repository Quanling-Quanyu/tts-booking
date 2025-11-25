// 引入必要套件
const express = require('express');          // Express框架
const cors = require('cors');                // 跨域請求處理
require('dotenv').config();                  // 載入環境變數

const { testConnection } = require('./src/config/database');

// 創建Express應用
const app = express();
const PORT = process.env.PORT || 5000;

/**
 * 中間件設定
 * 中間件是在處理請求前執行的函數
 */

// 1. CORS中間件 - 允許前端跨域請求
app.use(cors({
  origin: process.env.FRONTEND_URL,    // 只允許前端網址訪問
  credentials: true                     // 允許攜帶Cookie
}));

// 2. JSON解析中間件 - 自動解析JSON格式的請求內容
app.use(express.json());

// 3. URL編碼解析中間件 - 處理表單提交
app.use(express.urlencoded({ extended: true }));

// 4. 請求記錄中間件 - 記錄每個請求(開發時很有用)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();  // 呼叫next()繼續處理請求
});

/**
 * 路由設定
 * 路由決定不同網址要執行什麼功能
 */

// 健康檢查路由 - 確認伺服器運作正常
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'TTS預約平台API運作中',
    timestamp: new Date().toISOString()
  });
});
/**
 * API路由
 */

// 註冊路由
const authRoutes = require('./src/routes/auth');
const servicesRoutes = require('./src/routes/services'); // 新增
const bookingsRoutes = require('./src/routes/bookings');  // 新增

app.use('/api/services', servicesRoutes);  // 新增
app.use('/api/bookings', bookingsRoutes);  // 新增


// 首頁路由
app.get('/', (req, res) => {
  res.json({ 
    message: '歡迎使用TTS預約平台API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      services: '/api/services',
      bookings: '/api/bookings'
    }
  });
});

/**
 * 錯誤處理中間件
 * 當程式發生錯誤時統一處理
 */
app.use((err, req, res, next) => {
  console.error('❌ 伺服器錯誤:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '伺服器內部錯誤',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 處理404 - 找不到路由
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '找不到請求的資源'
  });
});

/**
 * 啟動伺服器
 */
async function startServer() {
  try {
    // 1. 測試資料庫連線
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('無法連接資料庫');
    }
    
    // 2. 啟動HTTP伺服器
    app.listen(PORT, () => {
      console.log(`
🚀 伺服器啟動成功!
📍 本機網址: http://localhost:${PORT}
🌍 環境: ${process.env.NODE_ENV}
📅 時間: ${new Date().toLocaleString('zh-TW')}
      `);
    });
  } catch (error) {
    console.error('❌ 伺服器啟動失敗:', error);
    process.exit(1);  // 退出程式
  }
}

// 執行啟動函數
startServer();

// 優雅關閉 - 當程式被終止時清理資源
process.on('SIGTERM', () => {
  console.log('⚠️ 收到終止信號,正在關閉伺服器...');
  process.exit(0);
});
