import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const router = useRouter();
  const isLoading = ref(false);
  const errorMessage = ref("");

  const checkAuth = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) user.value = JSON.parse(savedUser);
  };
  checkAuth();

  const isAuthenticated = computed(() => !!user.value);

  const login = (formData) => {
    isLoading.value = true;
    setTimeout(() => {
      if (formData.username === "admin" && formData.password === "123456") {
        user.value = formData;
        localStorage.setItem("user", JSON.stringify(formData));
        errorMessage.value = "";
        router.push("/dashboard");
      } else {
        errorMessage.value = "Sai username hoặc password!";
      }
      isLoading.value = false;
    }, 1500);
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
    checkAuth,
    isLoading,
    errorMessage,
  };
});
