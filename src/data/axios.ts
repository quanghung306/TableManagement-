import axios from 'axios';

// Cấu hình API client
const api = axios.create({
  baseURL: 'http://localhost:8000/api', 
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
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

// Interceptor cho tất cả các yêu cầu POST, PUT, PATCH, DELETE
api.interceptors.request.use(async (config) => {
  if (["post", "put", "patch", "delete"].includes(config.method?.toLowerCase() || '')) {
    await ensureCsrfToken();
  }
  return config;
});

// Lấy cookie từ document.cookie
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

export { api, ensureCsrfToken };
