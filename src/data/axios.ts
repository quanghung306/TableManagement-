import axios from 'axios';

// Cấu hình API client
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': localStorage.getItem('locale') || 'en' 
  }
});

// Hàm đảm bảo CSRF token
let csrfTokenRequest: Promise<void> | null = null;
const ensureCsrfToken = async () => {
  const existingToken = getCookie('XSRF-TOKEN');
  if (existingToken) return;

  if (!csrfTokenRequest) {
    csrfTokenRequest = axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true,
    }).then(() => {
      csrfTokenRequest = null;
    });
  }

  await csrfTokenRequest;
};

// Interceptor cho request
api.interceptors.request.use(async (config) => {
  if (localStorage.getItem('locale')) {
    config.headers['Accept-Language'] = localStorage.getItem('locale');
  }

  if (["post", "put", "patch", "delete"].includes(config.method?.toLowerCase() || '')) {
    await ensureCsrfToken();
  }
  return config;
});

// Interceptor cho response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý message lỗi đa ngôn ngữ từ server
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

// Lấy cookie từ document.cookie
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

// Hàm thay đổi ngôn ngữ
const setLanguage = (locale: string) => {
  localStorage.setItem('locale', locale);
  api.defaults.headers['Accept-Language'] = locale;
};

export { api, ensureCsrfToken, setLanguage };