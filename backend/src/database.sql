-- 創建資料庫
CREATE DATABASE IF NOT EXISTS tts_booking DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tts_booking;

-- 複製上面所有的CREATE TABLE語句到這裡

-- 插入預設訂閱方案
INSERT INTO subscription_plans (name, description, duration_type, price, features, max_services) VALUES
('月度方案', '適合剛起步的顧問', 'monthly', 666, '["無限預約", "數據分析", "email支援"]', 5),
('年度方案', '最划算的選擇,省下兩個月費用', 'yearly', 6666, '["無限預約", "進階數據分析", "優先客服", "自訂品牌"]', 20);

-- 創建管理員帳號
-- 帳號: ttsbooking
-- Email: teamtogether1123@yahoo.com
-- 密碼: TTSbooking (此 hash 為臨時範例,請用方案2生成正確密碼)
-- 全名: Quan Yu
INSERT INTO users (email, password, full_name, role, is_active, email_verified) VALUES
('teamtogether1123@yahoo.com', '$2a$12$L7sZ3xKNyARtBIRqsxB9dO4as0NRwI.s9PNvE47UR8Xa5MeA3c/a.', 'Quan Yu', 'admin', TRUE, TRUE);
