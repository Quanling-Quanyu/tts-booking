import axios from 'axios';

/**
 * API基礎設定
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// 創建axios實例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,  // 10秒超時
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 請求攔截器
 * 在每個請求發送前執行
 */
api.interceptors.request.use(
  (config) => {
    // 從localStorage獲取令牌並附加到請求
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 回應攔截器
 * 處理API回應和錯誤
 */
api.interceptors.response.use(
  (response) => response.data,  // 只返回data部分
  (error) => {
    if (error.response) {
      // 伺服器回應了錯誤狀態碼
      if (error.response.status === 401) {
        // 未授權 - 清除令牌並跳轉登入頁
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // 請求已發送但沒有收到回應
      return Promise.reject({ message: '無法連接到伺服器' });
    } else {
      // 其他錯誤
      return Promise.reject({ message: error.message });
    }
  }
);

/**
 * 認證相關API
 */
export const authAPI = {
  // 註冊
  register: (userData) => api.post('/auth/register', userData),
  
  // 登入
  login: (credentials) => api.post('/auth/login', credentials),
  
  // 獲取當前用戶
  getMe: () => api.get('/auth/me')
};

/**
 * 服務相關API
 */
export const servicesAPI = {
  // 獲取所有服務
  getAll: (params) => api.get('/services', { params }),
  
  // 獲取單個服務
  getById: (id) => api.get(`/services/${id}`),
  
  // 搜尋服務
  search: (keyword) => api.get(`/services/search?q=${keyword}`)
};

/**
 * 預約相關API
 */
export const bookingsAPI = {
  // 創建預約
  create: (bookingData) => api.post('/bookings', bookingData),
  
  // 獲取我的預約
  getMine: () => api.get('/bookings/mine'),
  
  // 取消預約
  cancel: (id) => api.post(`/bookings/${id}/cancel`)
};

export default api;
