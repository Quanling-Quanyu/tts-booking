const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * User模型
 * 處理用戶相關的資料庫操作
 */
class User {
  /**
   * 創建新用戶
   * @param {Object} userData - 用戶資料
   * @returns {Promise<Object>} 創建的用戶資料
   */
  static async create(userData) {
    const { email, password, full_name, phone, role = 'client' } = userData;
    
    // 1. 檢查email是否已存在
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      throw new Error('此電子郵件已被註冊');
    }
    
    // 2. 加密密碼 (bcrypt會自動加鹽)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 3. 插入新用戶資料
    const [result] = await pool.query(
      `INSERT INTO users (email, password, full_name, phone, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, hashedPassword, full_name, phone, role]
    );
    
    // 4. 返回新用戶資料(不含密碼)
    return {
      id: result.insertId,
      email,
      full_name,
      phone,
      role
    };
  }
  
  /**
   * 通過email查找用戶
   * @param {String} email - 電子郵件
   * @returns {Promise<Object|null>} 用戶資料或null
   */
  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }
  
  /**
   * 通過ID查找用戶
   * @param {Number} id - 用戶ID
   * @returns {Promise<Object|null>} 用戶資料(不含密碼)
   */
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, email, full_name, phone, role, avatar_url, is_active, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }
  
  /**
   * 驗證密碼
   * @param {String} plainPassword - 明文密碼
   * @param {String} hashedPassword - 加密後的密碼
   * @returns {Promise<Boolean>} 是否匹配
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  /**
   * 更新用戶資料
   * @param {Number} id - 用戶ID
   * @param {Object} updates - 要更新的欄位
   * @returns {Promise<Boolean>} 是否成功
   */
  static async update(id, updates) {
    const allowedFields = ['full_name', 'phone', 'avatar_url'];
    const fields = [];
    const values = [];
    
    // 只更新允許的欄位
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });
    
    if (fields.length === 0) {
      return false;
    }
    
    values.push(id);
    const [result] = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = User;
