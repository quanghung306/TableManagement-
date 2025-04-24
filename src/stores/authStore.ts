import { defineStore } from "pinia";
import { ref, computed } from "vue";
import router from "../router";
import api from "../data/axios";

interface User {
  id: number;
  Username: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const errorMessage = ref("");

  const isAuthenticated = computed(() => !!user.value);

  // Lấy thông tin user đang đăng nhập
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/user");
      user.value = response.data;
    } catch (error) {
      user.value = null;
    }
  };

  // Đăng ký tài khoản
  const register = async (formData: {
    Username: string;
    Password: string;
    Password_confirmation: string;
  }) => {
    isLoading.value = true;
    errorMessage.value = "";
    try {
      const response = await api.post("/auth/register", formData);
      
      localStorage.setItem('token', response.data.token);
      user.value = response.data.user;
      
      router.push("/users");
    } catch (err: any) {
      errorMessage.value = err.response?.data?.message || "Đăng ký thất bại";
    } finally {
      isLoading.value = false;
    }
  };

  // Đăng nhập
  const login = async (formData: { Username: string; Password: string }) => {
    isLoading.value = true;
    errorMessage.value = "";
    try {
      const response = await api.post("/auth/login", formData);
      
      // Lưu token và thông tin user
      localStorage.setItem('token', response.data.token);
      user.value = response.data.user;
      
      router.push("/users");
    } catch (err: any) {
      errorMessage.value = err.response?.data?.message || "Đăng nhập thất bại";
    } finally {
      isLoading.value = false;
    }
  };

  // Đăng xuất
  const logout = async () => {
    isLoading.value = true;
    try {
      await api.post("/logout");
      
      // Xóa dữ liệu người dùng
      localStorage.removeItem('token');
      user.value = null;
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/login");
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    } finally {
      isLoading.value = false;
    }
  };

  // Kiểm tra đăng nhập 
  const initializeAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetchUser();
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    errorMessage,
    register,
    login,
    logout,
    fetchUser,
    initializeAuth,
  };
});