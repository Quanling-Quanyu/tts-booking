// 引入mysql2套件 - 用於連接MySQL資料庫
const mysql = require('mysql2');
// 引入dotenv套件 - 用於讀取.env環境變數
require('dotenv').config();

/**
 * 創建資料庫連線池
 * 連線池可以重複使用連線,提高效能
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,           // 資料庫主機位址
  port: process.env.DB_PORT,           // 資料庫埠號
  user: process.env.DB_USER,           // 資料庫用戶名
  password: process.env.DB_PASSWORD,   // 資料庫密碼
  database: process.env.DB_NAME,       // 資料庫名稱
  waitForConnections: true,            // 當無可用連線時等待
  connectionLimit: 10,                 // 最多10個連線
  queueLimit: 0                        // 無限制排隊請求
});

// 使用Promise包裝,讓程式碼可以使用async/await語法
const promisePool = pool.promise();

/**
 * 測試資料庫連線是否成功
 */
async function testConnection() {
  try {
    const [rows] = await promisePool.query('SELECT 1');
    console.log('✅ 資料庫連線成功!');
    return true;
  } catch (error) {
    console.error('❌ 資料庫連線失敗:', error.message);
    return false;
  }
}

// 匯出連線池供其他檔案使用
module.exports = {
  pool: promisePool,
  testConnection
};
