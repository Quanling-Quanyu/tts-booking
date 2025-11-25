const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * 認證控制器
 * 處理註冊、登入等認證相關功能
 */

/**
 * 用戶註冊
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;
    
    // 1. 驗證必填欄位
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: '請填寫所有必填欄位'
      });
    }
    
    // 2. 驗證email格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '電子郵件格式不正確'
      });
    }
    
    // 3. 驗證密碼強度
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密碼長度至少6個字元'
      });
    }
    
    // 4. 創建用戶
    const user = await User.create({ email, password, full_name, phone });
    
    // 5. 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // 6. 返回成功回應
    res.status(201).json({
      success: true,
      message: '註冊成功',
      data: {
        user,
        token
      }
    });
    
  } catch (error) {
    console.error('註冊錯誤:', error);
    res.status(500).json({
      success: false,
      message: error.message || '註冊失敗,請稍後再試'
    });
  }
};

/**
 * 用戶登入
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. 驗證必填欄位
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '請輸入電子郵件和密碼'
      });
    }
    
    // 2. 查找用戶
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '電子郵件或密碼錯誤'
      });
    }
    
    // 3. 驗證密碼
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '電子郵件或密碼錯誤'
      });
    }
    
    // 4. 檢查帳號是否啟用
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: '您的帳號已被停用,請聯繫客服'
      });
    }
    
    // 5. 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // 6. 返回成功回應(不含密碼)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: '登入成功',
      data: {
        user: userWithoutPassword,
        token
      }
    });
    
  } catch (error) {
    console.error('登入錯誤:', error);
    res.status(500).json({
      success: false,
      message: '登入失敗,請稍後再試'
    });
  }
};

/**
 * 獲取當前用戶資料
 * GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    // req.user是由中間件設定的(稍後建立)
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '找不到用戶資料'
      });
    }
    
    res.json({
      success: true,
      data: { user }
    });
    
  } catch (error) {
    console.error('獲取用戶資料錯誤:', error);
    res.status(500).json({
      success: false,
      message: '獲取用戶資料失敗'
    });
  }
};
