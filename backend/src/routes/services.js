// backend/src/routes/services.js
// 服務相關API路由（供前台瀏覽、顧問上架使用）

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// === 取得所有服務列表 ===
// GET /api/services
// 功能：前台用戶瀏覽所有已上架服務
router.get('/', async (req, res) => {
  try {
    // 查詢所有服務，包含顧問姓名
    const [services] = await db.query(`
      SELECT 
        s.id, 
        s.consultant_id,
        s.title,
        s.description,
        s.duration,
        s.price,
        s.category,
        s.created_at,
        c.full_name as consultant_name
      FROM services s
      LEFT JOIN consultants c ON s.consultant_id = c.id
      WHERE s.is_active = 1
      ORDER BY s.created_at DESC
    `);
    
    res.json({ success: true, services });
  } catch (error) {
    console.error('取得服務列表錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
});

// === 取得單一服務詳情 ===
// GET /api/services/:id
// 功能：查看特定服務的詳細資訊
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [services] = await db.query(`
      SELECT 
        s.*,
        c.full_name as consultant_name,
        c.bio as consultant_bio,
        c.avatar_url as consultant_avatar
      FROM services s
      LEFT JOIN consultants c ON s.consultant_id = c.id
      WHERE s.id = ? AND s.is_active = 1
    `, [id]);
    
    if (services.length === 0) {
      return res.status(404).json({ success: false, message: '服務不存在' });
    }
    
    res.json({ success: true, service: services[0] });
  } catch (error) {
    console.error('取得服務詳情錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
});

// === 新增服務（顧問專用）===
// POST /api/services
// 功能：顧問上架新服務
router.post('/', async (req, res) => {
  try {
    const { consultant_id, title, description, duration, price, category } = req.body;
    
    // 驗證必填欄位
    if (!consultant_id || !title || !duration || !price) {
      return res.status(400).json({ success: false, message: '缺少必填欄位' });
    }
    
    // 插入新服務
    const [result] = await db.query(`
      INSERT INTO services (consultant_id, title, description, duration, price, category, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [consultant_id, title, description, duration, price, category || '其他']);
    
    res.json({ 
      success: true, 
      message: '服務新增成功',
      service_id: result.insertId 
    });
  } catch (error) {
    console.error('新增服務錯誤:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
});

module.exports = router;
