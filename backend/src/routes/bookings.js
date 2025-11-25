// backend/src/routes/bookings.js
// 預約相關API路由

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// === 建立新預約 ===
// POST /api/bookings
// 功能：用戶選擇服務與時段後建立預約
router.post('/', async (req, res) => {
  try {
    const { user_id, service_id, booking_date, booking_time, notes } = req.body;
    
    // 驗證必填欄位
    if (!user_id || !service_id || !booking_date || !booking_time) {
      return res.status(400).json({ success: false, message: '缺少必填欄位' });
    }
    
    // 插入預約記錄
    const [result] = await db.query(`
      INSERT INTO bookings (user_id, service_id, booking_date, booking_time, status, notes)
      VALUES (?, ?, ?, ?, 'pending', ?)
    `, [user_id, service_id, booking_date, booking_time, notes || '']);
    
    res.json({ 
      success: true, 
      message: '預約成功',
      booking_id: result.insertId 
    });
  } catch (error) {
    console.error('建立預約錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
});

// === 取得用戶的所有預約 ===
// GET /api/bookings/user/:user_id
// 功能：會員中心查看自己的預約紀錄
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const [bookings] = await db.query(`
      SELECT 
        b.*,
        s.title as service_title,
        s.duration,
        s.price,
        c.full_name as consultant_name
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN consultants c ON s.consultant_id = c.id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `, [user_id]);
    
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('取得預約列表錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
});

// === 取得顧問的所有預約（顧問後台用）===
// GET /api/bookings/consultant/:consultant_id
router.get('/consultant/:consultant_id', async (req, res) => {
  try {
    const { consultant_id } = req.params;
    
    const [bookings] = await db.query(`
      SELECT 
        b.*,
        s.title as service_title,
        u.full_name as user_name,
        u.email as user_email,
        u.phone as user_phone
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE s.consultant_id = ?
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `, [consultant_id]);
    
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('取得顧問預約錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
});

module.exports = router;
