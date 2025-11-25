#資料庫設計

1. 用戶表 (users)
-- 儲存所有用戶(客戶、顧問、管理員)的基本資料
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,           -- 用戶ID(自動增長)
  email VARCHAR(255) UNIQUE NOT NULL,          -- 電子郵件(唯一,不能空白)
  password VARCHAR(255) NOT NULL,              -- 加密後的密碼
  full_name VARCHAR(100) NOT NULL,             -- 全名
  phone VARCHAR(20),                           -- 電話號碼
  role ENUM('client', 'consultant', 'admin') DEFAULT 'client',  -- 用戶角色
  avatar_url VARCHAR(500),                     -- 頭像圖片連結
  is_active BOOLEAN DEFAULT TRUE,              -- 帳號是否啟用
  email_verified BOOLEAN DEFAULT FALSE,        -- 信箱是否驗證
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- 創建時間
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- 更新時間
  
  INDEX idx_email (email),                     -- 索引:加速email查詢
  INDEX idx_role (role)                        -- 索引:加速角色查詢
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用戶基本資料表';


2. 顧問資料表 (consultants)
-- 儲存顧問/老師的專業資料
CREATE TABLE consultants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,                        -- 關聯到users表
  bio TEXT,                                    -- 自我介紹
  expertise VARCHAR(500),                      -- 專長領域(逗號分隔)
  years_experience INT,                        -- 從業年資
  certificate_urls TEXT,                       -- 證照圖片連結(JSON格式)
  hourly_rate DECIMAL(10,2),                   -- 時薪
  rating DECIMAL(3,2) DEFAULT 0,               -- 平均評分(0-5)
  total_reviews INT DEFAULT 0,                 -- 總評價數
  subscription_status ENUM('active', 'inactive', 'trial') DEFAULT 'inactive',  -- 訂閱狀態
  subscription_plan ENUM('monthly', 'yearly'),  -- 訂閱方案
  subscription_start DATE,                     -- 訂閱開始日期
  subscription_end DATE,                       -- 訂閱結束日期
  is_approved BOOLEAN DEFAULT FALSE,           -- 是否通過審核
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,  -- 外鍵約束
  INDEX idx_subscription_status (subscription_status),
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='顧問專業資料表';

3. 服務項目表 (services)
-- 儲存顧問提供的各項服務
CREATE TABLE services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  consultant_id INT NOT NULL,                  -- 提供服務的顧問
  title VARCHAR(200) NOT NULL,                 -- 服務名稱
  description TEXT,                            -- 服務描述
  category VARCHAR(50),                        -- 服務分類(塔羅、占星等)
  duration INT NOT NULL,                       -- 服務時長(分鐘)
  price DECIMAL(10,2) NOT NULL,                -- 服務價格
  image_url VARCHAR(500),                      -- 服務圖片
  is_active BOOLEAN DEFAULT TRUE,              -- 是否上架
  custom_fields JSON,                          -- 自訂表單欄位(JSON格式)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE,
  INDEX idx_category (category),
  INDEX idx_price (price),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='服務項目表';

4. 預約表 (bookings)
-- 儲存所有預約記錄
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,                      -- 預約的客戶
  service_id INT NOT NULL,                     -- 預約的服務
  consultant_id INT NOT NULL,                  -- 提供服務的顧問
  booking_date DATE NOT NULL,                  -- 預約日期
  booking_time TIME NOT NULL,                  -- 預約時間
  duration INT NOT NULL,                       -- 時長(分鐘)
  total_price DECIMAL(10,2) NOT NULL,          -- 總價格
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',  -- 預約狀態
  custom_form_data JSON,                       -- 客戶填寫的自訂表單資料
  notes TEXT,                                  -- 備註
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE,
  INDEX idx_booking_date (booking_date),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='預約記錄表';


5. 付款表 (payments)
-- 儲存所有付款交易記錄
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT,                              -- 關聯預約(可為NULL,訂閱付款時)
  user_id INT NOT NULL,                        -- 付款用戶
  payment_type ENUM('booking', 'subscription') NOT NULL,  -- 付款類型
  amount DECIMAL(10,2) NOT NULL,               -- 付款金額
  payment_method VARCHAR(50),                  -- 付款方式(信用卡/ATM/超商等)
  ecpay_trade_no VARCHAR(100),                 -- 綠界交易編號
  ecpay_payment_date DATETIME,                 -- 綠界付款時間
  status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',  -- 付款狀態
  payment_info JSON,                           -- 綠界回傳的完整資訊
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_ecpay_trade_no (ecpay_trade_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='付款交易表';

6. 評價表 (reviews)
-- 儲存客戶對顧問的評價
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,                     -- 關聯預約
  client_id INT NOT NULL,                      -- 評價的客戶
  consultant_id INT NOT NULL,                  -- 被評價的顧問
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),  -- 評分(1-5星)
  comment TEXT,                                -- 評論內容
  is_visible BOOLEAN DEFAULT TRUE,             -- 是否公開顯示
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE,
  UNIQUE KEY unique_booking_review (booking_id),  -- 每個預約只能評價一次
  INDEX idx_consultant_id (consultant_id),
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='評價表';

7. 訂閱方案表 (subscription_plans)
-- 定義顧問可選擇的訂閱方案
CREATE TABLE subscription_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,                  -- 方案名稱
  description TEXT,                            -- 方案說明
  duration_type ENUM('monthly', 'yearly') NOT NULL,  -- 週期類型
  price DECIMAL(10,2) NOT NULL,                -- 方案價格
  features JSON,                               -- 方案功能(JSON陣列)
  max_services INT,                            -- 最多可上架服務數
  is_active BOOLEAN DEFAULT TRUE,              -- 是否啟用
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_duration_type (duration_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='訂閱方案表';


8. 通知表 (notifications)
-- 儲存系統通知記錄
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,                        -- 接收通知的用戶
  type VARCHAR(50) NOT NULL,                   -- 通知類型
  title VARCHAR(200) NOT NULL,                 -- 通知標題
  message TEXT NOT NULL,                       -- 通知內容
  related_id INT,                              -- 關聯ID(如booking_id)
  is_read BOOLEAN DEFAULT FALSE,               -- 是否已讀
  sent_via JSON,                               -- 發送管道(email/line等)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知記錄表';

