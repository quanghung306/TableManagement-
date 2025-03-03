import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const router = useRouter();
  const isLoading = ref(false);
  const errorMessage = ref("");

  const getRegisteredUsers = () =>
    JSON.parse(localStorage.getItem("registeredUsers")) || [];

  const checkAuth = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) user.value = JSON.parse(savedUser);
  };
  checkAuth();

  const isAuthenticated = computed(() => !!user.value);

  const register = async (formData) => {
    isLoading.value = true;
    errorMessage.value = "";
    await new Promise((r) => setTimeout(r, 1500));

    if (!formData.username || !formData.password) {
      errorMessage.value = "Vui lòng nhập đầy đủ thông tin!";
      isLoading.value = false;
      return;
    }

    const registeredUsers = getRegisteredUsers();
    if (registeredUsers.some((u) => u.username === formData.username)) {
      errorMessage.value = "Username đã tồn tại!";
    } else {
      registeredUsers.push(formData);
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/login");
    }

    isLoading.value = false;
  };

  const login = async (formData) => {
    isLoading.value = true;
    errorMessage.value = "";
    await new Promise((r) => setTimeout(r, 1500));

    const userFound = getRegisteredUsers().find(
      (u) => u.username === formData.username && u.password === formData.password
    );

    if (userFound) {
      user.value = userFound;
      localStorage.setItem("user", JSON.stringify(userFound));
      toast.success("Đăng nhập thành công!");
      router.push("/users");
    } else {
      errorMessage.value = "Sai username hoặc password!";
    }

    isLoading.value = false;
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("user");
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    checkAuth,
    isLoading,
    errorMessage,
  };
});
