import axios from 'axios'
import router from "../router"; 
import { useAuthStore } from "../stores/authStore";

const api = axios.create({
baseURL: 'http://localhost:8000/api',
  withCredentials: true, 
})

// Thêm CSRF token tự động cho các request POST/PUT/PATCH/DELETE
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Thêm CSRF token cho các method không phải GET/HEAD/OPTIONS
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
    await ensureCsrfToken();
  }
  
  return config;
});

// Hàm đảm bảo có CSRF token
let csrfTokenRequest: Promise<void> | null = null;
const ensureCsrfToken = async () => {
  // Nếu đã có token trong cookie thì không cần request mới
  const existingToken = getCookie('XSRF-TOKEN');
  if (existingToken) return;
  
  // Tránh gọi nhiều request cùng lúc
  if (!csrfTokenRequest) {
    csrfTokenRequest = axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/sanctum/csrf-cookie`, 
      { withCredentials: true }
    ).then(() => {
      csrfTokenRequest = null;
    });
  }
  
  await csrfTokenRequest;
};

// Hàm helper đọc cookie
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};
export default api
