const jwt = require('jsonwebtoken');

/**
 * JWT驗證中間件
 * 驗證請求的Authorization標頭中的JWT令牌
 */
exports.authenticate = (req, res, next) => {
  try {
    // 1. 從標頭獲取令牌
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供認證令牌'
      });
    }
    
    // 2. 提取令牌(移除"Bearer "前綴)
    const token = authHeader.substring(7);
    
    // 3. 驗證令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. 將用戶資訊附加到請求物件
    req.user = decoded;
    
    // 5. 繼續處理請求
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '無效的認證令牌'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '認證令牌已過期,請重新登入'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: '認證失敗'
    });
  }
};

/**
 * 角色權限檢查中間件
 * 檢查用戶是否擁有指定角色
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '請先登入'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '您沒有權限執行此操作'
      });
    }
    
    next();
  };
};
