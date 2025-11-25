# 🌟 諮詢預約系統建構專案 - 開發進度規劃表

## 📋 專案概述
**專案名稱**：身心靈諮詢預約平台（獨立系統，可整合 WordPress）  
**技術架構**：Node.js + 前後端分離 + Azure 部署  
**核心功能**：類 Amelia 預約系統，支援多專家、多服務、自訂表單、**師資自行收款**

**金流策略**：
- 階段一：師資自行申請綠界，平台提供串接欄位，師資直接收款
- 階段二：（未來）提供平台統一金流選項，用以做活動

---

## 🎯 階段規劃總覽

| 階段 | 里程碑 | 預計完成 | 狀態 |
|------|--------|----------|------|
| Phase 1 | 需求確認 & 架構設計 | Week 1-2 | 🟡 進行中 |
| Phase 2 | 前台頁面開發 | Week 3-5 | ⚪ 待開始 |
| Phase 3 | 後台頁面開發（含師資端） | Week 6-9 | ⚪ 待開始 |
| Phase 4 | API 與資料庫設計 | Week 5-10 | ⚪ 待開始 |
| Phase 5 | 師資金流串接 & 通知 | Week 10-11 | ⚪ 待開始 |
| Phase 6 | 評價系統 & 認證功能 | Week 12 | ⚪ 待開始 |
| Phase 7 | 數據分析儀表板 | Week 13 | ⚪ 待開始 |
| Phase 8 | WordPress 資料同步 | Week 14 | ⚪ 待開始 |
| Phase 9 | 測試與優化 | Week 15-16 | ⚪ 待開始 |
| Phase 10 | Azure 部署 & 上線 | Week 17 | ⚪ 待開始 |

---

## 📱 前台頁面清單（User-facing Pages）

### ✅ 預約者流程頁面
| 編號 | 頁面名稱 | 功能描述 | 優先級 | 負責人 | 狀態 |
|------|----------|----------|--------|--------|------|
| F-01 | 服務清單頁 | 顯示所有可預約服務（分類/搜尋/篩選） | 🔴 High | - | ⚪ TODO |
| F-02 | 服務詳情頁 | 單一服務介紹、價格、時長、**師資評價** | 🔴 High | - | ⚪ TODO |
| F-03 | 日曆選擇頁 | 選擇預約日期（日曆元件） | 🔴 High | - | ⚪ TODO |
| F-04 | 專家選擇頁 | 該服務可預約的專家列表 + **認證徽章** | 🔴 High | - | ⚪ TODO |
| F-05 | 專家個人檔案頁 | 專家簡介、專長、**評價列表**、**認證徽章** | 🟡 Medium | - | ⚪ TODO |
| F-06 | 預約表單頁 | 填寫姓名、email、需求等 | 🔴 High | - | ⚪ TODO |
| F-07 | 結帳頁 | **跳轉至師資綠界金流** + 登入/註冊 | 🔴 High | - | ⚪ TODO |
| F-08 | 預約成功頁 | 顯示預約資訊與下一步 | 🔴 High | - | ⚪ TODO |
| F-09 | 會員中心 - 我的預約 | 查看所有預約紀錄 + **評價按鈕** | 🟡 Medium | - | ⚪ TODO |
| F-10 | 會員中心 - 個人資料 | 編輯個人訊息 | 🟡 Medium | - | ⚪ TODO |
| F-11 | 會員登入/註冊頁 | Email/LINE/FB 登入 | 🔴 High | - | ⚪ TODO |
| F-12 | 評價撰寫頁 | 完成預約後撰寫評價（星等+文字） | 🟡 Medium | - | ⚪ TODO |

### 🌐 其他前台頁面
| 編號 | 頁面名稱 | 功能描述 | 優先級 | 負責人 | 狀態 |
|------|----------|----------|--------|--------|------|
| F-13 | 首頁 | 品牌介紹、快速導覽、**熱門師資** | 🔴 High | - | ⚪ TODO |
| F-14 | 關於我們 | 平台介紹、使命願景 | 🟢 Low | - | ⚪ TODO |
| F-15 | 常見問題 FAQ | 預約流程、退款政策、**金流說明** | 🟡 Medium | - | ⚪ TODO |
| F-16 | 聯絡我們 | 表單或社群連結 | 🟡 Medium | - | ⚪ TODO |

---

## 🔧 後台頁面清單（Admin & Provider Pages）

### 👨‍💼 服務提供者（師資）後台
| 編號 | 頁面名稱 | 功能描述 | 優先級 | 負責人 | 狀態 |
|------|----------|----------|--------|--------|------|
| B-01 | 訂閱/註冊頁 | 選擇方案並註冊帳號 | 🔴 High | - | ⚪ TODO |
| B-02 | 個人檔案設定 | 頭像、簡介、專業證照、**申請認證徽章** | 🔴 High | - | ⚪ TODO |
| B-03 | 服務管理 | 新增/編輯/刪除服務 | 🔴 High | - | ⚪ TODO |
| B-04 | 日曆與時段設定 | 設定營業時間、可預約時段 | 🔴 High | - | ⚪ TODO |
| B-05 | 自訂表單設計器 | 設計預約表單問題 | 🟡 Medium | - | ⚪ TODO |
| B-06 | **金流串接設定** | 填入綠界 MerchantID/HashKey/HashIV | 🔴 High | - | ⚪ TODO |
| B-07 | 預約管理 | 查看/確認/取消預約 | 🔴 High | - | ⚪ TODO |
| B-08 | **收入報表** | 查看預約數、收益趋勢、熱門服務 | 🟡 Medium | - | ⚪ TODO |
| B-09 | **預約數據分析** | 客戶來源、回購率、時段熱度 | 🟡 Medium | - | ⚪ TODO |
| B-10 | **客戶評價管理** | 查看所有評價、回覆評價 | 🟡 Medium | - | ⚪ TODO |
| B-11 | 通知設定 | Email/LINE 通知偏好 | 🟢 Low | - | ⚪ TODO |
| B-12 | **認證狀態** | 查看認證申請進度與徽章 | 🟡 Medium | - | ⚪ TODO |

### 🛠️ 超級管理員後台
| 編號 | 頁面名稱 | 功能描述 | 優先級 | 負責人 | 狀態 |
|------|----------|----------|--------|--------|------|
| A-01 | Dashboard 儀表板 | 總覽統計、待審核項目、**平台數據** | 🔴 High | - | ⚪ TODO |
| A-02 | 服務提供者審核 | 審核專家申請 | 🔴 High | - | ⚪ TODO |
| A-03 | 服務審核 | 審核新建立的服務 | 🔴 High | - | ⚪ TODO |
| A-04 | **認證徽章管理** | 審核師資認證申請、發放徽章 | 🟡 Medium | - | ⚪ TODO |
| A-05 | 會員管理 | 查看/編輯所有會員（預約者+師資） | 🟡 Medium | - | ⚪ TODO |
| A-06 | 訂單管理 | 查看所有預約訂單（**透過 Webhook**） | 🟡 Medium | - | ⚪ TODO |
| A-07 | **評價管理** | 審核/刪除不當評價 | 🟡 Medium | - | ⚪ TODO |
| A-08 | 訂閱與收費管理 | 師資訂閱方案、繳費紀錄 | 🔴 High | - | ⚪ TODO |
| A-09 | 系統設定 | 網站基本設定、Email 範本 | 🟡 Medium | - | ⚪ TODO |
| A-10 | **平台數據分析** | 營收、用戶成長、預約數據、熱門服務 | 🟡 Medium | - | ⚪ TODO |

---

## 🔌 API 與後端功能

### 核心 API 端點
| 編號 | API 路徑 | 功能 | 方法 | 優先級 | 狀態 |
|------|----------|------|------|--------|------|
| API-01 | `/api/services` | 取得所有服務列表 | GET | 🔴 High | ⚪ TODO |
| API-02 | `/api/services/:id` | 取得單一服務詳情 + **評價** | GET | 🔴 High | ⚪ TODO |
| API-03 | `/api/providers` | 取得所有專家列表 + **認證徽章** | GET | 🔴 High | ⚪ TODO |
| API-04 | `/api/providers/:id` | 取得單一專家資訊 + **評價** | GET | 🔴 High | ⚪ TODO |
| API-05 | `/api/availability` | 查詢可預約時段 | GET | 🔴 High | ⚪ TODO |
| API-06 | `/api/bookings` | 建立預約 | POST | 🔴 High | ⚪ TODO |
| API-07 | `/api/bookings/:id` | 查詢/更新/取消預約 | GET/PUT/DELETE | 🔴 High | ⚪ TODO |
| API-08 | `/api/auth/register` | 會員註冊 | POST | 🔴 High | ⚪ TODO |
| API-09 | `/api/auth/login` | 會員登入 | POST | 🔴 High | ⚪ TODO |
| API-10 | `/api/auth/social` | 社群登入（LINE/FB） | POST | 🟡 Medium | ⚪ TODO |
| API-11 | **`/api/payments/checkout`** | **產生師資綠界金流表單** | POST | 🔴 High | ⚪ TODO |
| API-12 | **`/api/payments/callback`** | **接收綠界 Webhook 通知** | POST | 🔴 High | ⚪ TODO |
| API-13 | `/api/notifications` | 發送通知 | POST | 🟡 Medium | ⚪ TODO |
| API-14 | `/api/forms/:id` | 取得自訂表單結構 | GET | 🟡 Medium | ⚪ TODO |
| API-15 | `/api/admin/approval` | 審核服務/專家 | PUT | 🔴 High | ⚪ TODO |
| API-16 | **`/api/reviews`** | **建立評價** | POST | 🟡 Medium | ⚪ TODO |
| API-17 | **`/api/reviews/:id`** | **查詢/更新/刪除評價** | GET/PUT/DELETE | 🟡 Medium | ⚪ TODO |
| API-18 | **`/api/badges`** | **取得所有認證徽章類型** | GET | 🟡 Medium | ⚪ TODO |
| API-19 | **`/api/badges/apply`** | **申請認證徽章** | POST | 🟡 Medium | ⚪ TODO |
| API-20 | **`/api/analytics/provider`** | **師資數據分析（預約/收入）** | GET | 🟡 Medium | ⚪ TODO |
| API-21 | **`/api/analytics/admin`** | **管理員平台數據分析** | GET | 🟡 Medium | ⚪ TODO |

---

## 💾 資料庫設計

### 核心資料表
| 編號 | 資料表名稱 | 說明 | 優先級 | 狀態 |
|------|------------|------|--------|------|
| DB-01 | users | 會員資料（預約者+提供者） | 🔴 High | ⚪ TODO |
| DB-02 | providers | 服務提供者資料 | 🔴 High | ⚪ TODO |
| DB-03 | services | 服務項目 | 🔴 High | ⚪ TODO |
| DB-04 | bookings | 預約紀錄 | 🔴 High | ⚪ TODO |
| DB-05 | availability | 專家可預約時段 | 🔴 High | ⚪ TODO |
| DB-06 | **payments** | **付款紀錄（Webhook 回傳）** | 🔴 High | ⚪ TODO |
| DB-07 | custom_forms | 自訂表單結構 | 🟡 Medium | ⚪ TODO |
| DB-08 | form_responses | 表單回覆內容 | 🟡 Medium | ⚪ TODO |
| DB-09 | notifications | 通知紀錄 | 🟢 Low | ⚪ TODO |
| DB-10 | **reviews** | **評價系統** | 🟡 Medium | ⚪ TODO |
| DB-11 | **badges** | **認證徽章資料** | 🟡 Medium | ⚪ TODO |
| DB-12 | **provider_payment_info** | **師資綠界金流設定** | 🔴 High | ⚪ TODO |

---

## 🔗 第三方整合

| 編號 | 整合項目 | 說明 | 優先級 | 狀態 |
|------|----------|------|--------|------|
| INT-01 | WordPress API | 同步會員、文章資料 | 🟡 Medium | ⚪ TODO |
| INT-02 | **綠界金流（師資自行串接）** | **信用卡、ATM、超商付款** | 🔴 High | ⚪ TODO |
| INT-03 | LINE Login | 社群登入 | 🟡 Medium | ⚪ TODO |
| INT-04 | Facebook Login | 社群登入 | 🟡 Medium | ⚪ TODO |
| INT-05 | Email 發送服務 | SendGrid / AWS SES | 🔴 High | ⚪ TODO |
| INT-06 | LINE Notify | 預約通知 | 🟢 Low | ⚪ TODO |
| INT-07 | Google Calendar | 同步預約到行事曆 | 🟢 Low | ⚪ TODO |

---

## ☁️ 部署與 DevOps

| 編號 | 任務 | 說明 | 優先級 | 狀態 |
|------|------|------|--------|------|
| DEV-01 | Azure App Service 設定 | Node.js 環境配置 | 🔴 High | ⚪ TODO |
| DEV-02 | Azure Database 建立 | MySQL/PostgreSQL | 🔴 High | ⚪ TODO |
| DEV-03 | CI/CD Pipeline | GitHub Actions 自動部署 | 🟡 Medium | ⚪ TODO |
| DEV-04 | 環境變數管理 | dev/staging/production | 🔴 High | ⚪ TODO |
| DEV-05 | SSL 憑證設定 | HTTPS 加密 | 🔴 High | ⚪ TODO |
| DEV-06 | CDN 設定 | 靜態資源加速 | 🟢 Low | ⚪ TODO |
| DEV-07 | 備份機制 | 資料庫自動備份 | 🟡 Medium | ⚪ TODO |
| DEV-08 | 監控與警示 | Application Insights | 🟡 Medium | ⚪ TODO |

---

## 📝 開發注意事項

### 金流部分（重點）
1. **師資自行申請綠界**：
   - 師資後台提供 `MerchantID`、`HashKey`、`HashIV` 填寫欄位
   - 結帳時動態產生該師資的綠界表單
   - 付款完成後透過 Webhook 通知平台更新預約狀態

2. **Webhook 處理**：
   - 接收綠界回傳的付款通知
   - 驗證 CheckMacValue 確保資料安全
   - 更新 `bookings` 與 `payments` 資料表

### 評價系統
- 只有完成預約的用戶才能評價
- 師資可回覆評價，但不能刪除
- 管理員可審核/刪除不當評價

### 認證徽章
- 師資可申請多種徽章（如：平台認證、專業證照、熱門師資）
- 需管理員審核通過後才顯示
- 徽章顯示於專家列表、個人檔案頁

### 數據分析
- 師資端：收入趋勢、預約數、客戶回購率、時段熱度
- 管理員端：平台總營收（訂閱費）、用戶成長、熱門服務、活躍師資

---

## 🚀 如何使用這個規劃表

1. **建立 GitHub Issues**：每一個功能項可建立為一個 Issue
2. **使用 GitHub Projects**：建立 Kanban 看板追蹤進度
3. **標記 Labels**：`frontend`、`backend`、`database`、`high-priority` 等
4. **Milestones**：按 Phase 1-10 建立里程碑
5. **協作開發**：在 Issues 中討論、分配任務、追蹤進度

---

## 💬 聯絡與貢獻

如有任何問題或建議，歡迎建立 Issue 或聯絡團隊！

---

**最後更新：2025-11-24**  
**版本：v1.0 - 初始規劃**


---

2025/11/25由perplexity MAX LABS提供

## 專案架構圖

┌─────────────────┐
│   前台用戶端     │ (React - 瀏覽器)
│  - 註冊/登入     │
│  - 瀏覽服務      │
│  - 預約/付款     │
└────────┬────────┘
         │
         ↓ HTTPS
┌─────────────────┐
│   後端API伺服器  │ (Node.js + Express)
│  - 用戶管理      │
│  - 預約邏輯      │
│  - 金流處理      │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌────────┐ ┌─────────┐
│ 資料庫 │ │ Azure   │
│ MySQL  │ │ Storage │
└────────┘ └─────────┘


## 技術選擇理由
|技術|為什麼選擇|新手友善度|
|------|------|------|
|Node.js|JavaScript語法,前後端共用,易學|	⭐⭐⭐⭐⭐|
|Express|簡單的路由系統,中文資源多|⭐⭐⭐⭐⭐|
|React|組件化開發,容易維護|⭐⭐⭐⭐|
|MySQL|關聯式資料庫,結構清晰|⭐⭐⭐⭐|
|Azure|微軟平台,中文文檔完整|⭐⭐⭐⭐|

## 環境準備
### 第一步：安裝必要工具

#### 1. 安裝 Node.js (LTS版本 - 建議v20.x)
##### 前往 https://nodejs.org/zh-tw/ 下載並安裝

#### 2. 驗證安裝
node --version  # 應該顯示 v20.x.x
npm --version   # 應該顯示 10.x.x

#### 3. 安裝 Git (版本控制)
##### 前往 https://git-scm.com/downloads 下載並安裝

#### 4. 安裝 Visual Studio Code (程式編輯器)
##### 前往 https://code.visualstudio.com/ 下載並安裝

### 第二步：建立專案結構

##### 在終端機執行以下指令

#### 1. 創建專案資料夾
mkdir tts-booking-platform
cd tts-booking-platform

#### 2. 初始化 Git 版本控制
git init

#### 3. 創建前後端資料夾
mkdir backend frontend

#### 4. 初始化後端專案
cd backend
npm init -y

#### 5. 安裝後端必要套件
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon

#### 6. 返回根目錄,初始化前端專案
cd ..
npx create-react-app frontend

#### 7. 創建資料夾結構
cd backend
mkdir src
cd src
mkdir controllers models routes middleware utils config
cd ../..

##### 專案資料夾結構
tts-booking-platform/
├── backend/                 # 後端程式碼
│   ├── src/
│   │   ├── controllers/    # 處理業務邏輯
│   │   ├── models/         # 資料庫模型
│   │   ├── routes/         # API路由
│   │   ├── middleware/     # 中間件(驗證等)
│   │   ├── utils/          # 工具函數
│   │   └── config/         # 設定檔
│   ├── tests/              # 測試檔案
│   ├── .env                # 環境變數(機密資訊)
│   ├── .gitignore          # Git忽略檔案
│   ├── package.json        # 專案設定
│   └── server.js           # 主程式進入點
│
├── frontend/               # 前端程式碼
│   ├── public/             # 靜態檔案
│   ├── src/
│   │   ├── components/     # React組件
│   │   ├── pages/          # 頁面組件
│   │   ├── services/       # API呼叫
│   │   ├── utils/          # 工具函數
│   │   └── App.js          # 主應用組件
│   ├── package.json
│   └── README.md
│
├── docs/                   # 文件資料夾
│   ├── API.md             # API文件
│   └── DEPLOY.md          # 部署指南
│
└── README.md              # 專案說明

// 2025/11/25 19:18完成以下本地測試

## 測試階段一成果
### 測試清單
#### 後端測試
bash
##### 1. 進入後端資料夾
cd backend

##### 2. 啟動開發伺服器
npm run dev

##### 3. 測試健康檢查 (另開終端機)
curl http://localhost:5000/api/health

##### 4. 測試註冊API
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "full_name": "測試用戶",
    "phone": "0912345678"
  }'

##### 5. 測試登入API
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
#### 前端測試

bash
##### 1. 進入前端資料夾
cd frontend

##### 2. 啟動開發伺服器
npm start

##### 3. 瀏覽器會自動開啟 http://localhost:3000
##### 4. 測試註冊功能
##### 5. 測試登入功能
##### 6. 查看瀏覽器開發者工具的Network標籤確認API呼叫
