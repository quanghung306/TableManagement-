import { defineStore } from "pinia";
import { ref, computed } from "vue";
import router from "../router";
import { api, ensureCsrfToken } from "../data/axios";

interface User {
  id: number;
  Username: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const token = ref<string | null>(localStorage.getItem("token"));

  // Kiểm tra trạng thái xác thực
  const isAuthenticated = computed(() => !!token.value);

  // Lấy thông tin người dùng
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/user");
      user.value = response.data;
    } catch (error) {
      // clearAuthData();

      console.error("Fetch user error:", error);
    }
  };

  // // Xóa dữ liệu xác thực
  const clearAuthData = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  // Đăng ký người dùng
  const register = async (formData: {
    Username: string;
    Password: string;
    Password_confirmation: string;
  }) => {
    isLoading.value = true;
    errorMessage.value = "";
    try {
      await ensureCsrfToken();
      const response = await api.post("/auth/register", formData);

      // Lưu token sau khi đăng ký nếu API trả về
      if (response.data.token) {
        token.value = response.data.token;
        localStorage.setItem("token", response.data.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }

      user.value = response.data.user;
      router.push("/login");
    } catch (err: any) {
      errorMessage.value = err.response?.data?.message || "Đăng ký thất bại";
    } finally {
      isLoading.value = false;
    }
  };

  // Đăng nhập người dùng
  const login = async (formData: { Username: string; Password: string }) => {
    isLoading.value = true;
    errorMessage.value = "";
    try {
      await ensureCsrfToken();
      const response = await api.post("/auth/login", formData);

      // Lưu token và cấu hình axios
      token.value = response.data.token;
      localStorage.setItem("token", response.data.token);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      user.value = response.data.user;
      router.push("/users");
    } catch (err: any) {
      errorMessage.value = err.response?.data?.message || "Đăng nhập thất bại";
    } finally {
      isLoading.value = false;
    }
  };

  // Đăng xuất người dùng
  const logout = async () => {
    isLoading.value = true;
    try {
      await ensureCsrfToken();

      // Thêm token vào header nếu chưa có
      if (token.value && !api.defaults.headers.common["Authorization"]) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
      }

      await api.post("/logout");

      // Xóa dữ liệu và chuyển hướng
      clearAuthData();
      router.push("/login");
    } catch (err: any) {
      console.error("Logout error:", err);

      // Dù lỗi vẫn clear dữ liệu local
      clearAuthData();
      router.push("/login");

      errorMessage.value = err.response?.data?.message || "Đăng xuất thất bại";
    } finally {
      isLoading.value = false;
    }
  };

  // Khởi tạo xác thực khi load app
  const initializeAuth = async () => {
    if (token.value) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
      await fetchUser();
    }
  };

  return {
    user,
    token,
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
