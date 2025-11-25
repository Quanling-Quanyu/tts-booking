CREATE DATABASE tts_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tts_booking;
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role ENUM('client', 'consultant', 'admin') DEFAULT 'client',
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE consultants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  bio TEXT,
  expertise VARCHAR(500),
  years_experience INT,
  certificate_urls TEXT,
  hourly_rate DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  subscription_status ENUM('active', 'inactive', 'trial') DEFAULT 'inactive',
  subscription_plan ENUM('monthly', 'yearly'),
  subscription_start DATE,
  subscription_end DATE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

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



