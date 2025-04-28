import { defineStore } from "pinia";
import { ref, computed } from "vue";
import router from "../router";
import { useI18n } from "vue-i18n";
import { api, ensureCsrfToken } from "../data/axios";

interface User {
  id: number;
  Username: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  console.log("🚀 ~ useAuthStore ~ user:", user);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const token = ref<string | null>(localStorage.getItem("token"));
  const { t } = useI18n();

  // Kiểm tra trạng thái xác thực
  const isAuthenticated = computed(() => !!token.value);
  
  // Lấy thông tin người dùng
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/user");
      user.value = response.data;
    } catch (error) {
      clearAuthData();
      console.error("Fetch user error:", error);
    }
  };

  const clearAuthData = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("locale");
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
      errorMessage.value = err.response?.data?.message || t("register_failed");
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
      console.log("🚀 ~ login ~ user.value:", user.value?.Username)
      router.push("/users");
    } catch (err: any) {
      errorMessage.value = err.response?.data?.message || t("login_failed");
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

      errorMessage.value = err.response?.data?.message || t("logout_failed");
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
