import { defineStore } from "pinia";
import { ref, computed } from "vue";
import router from "../router"; 

interface User {
  username: string;
  password: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isLoading = ref<boolean>(false);
  const errorMessage = ref<string>("");

  const getRegisteredUsers = (): User[] =>
    JSON.parse(localStorage.getItem("registeredUsers") || "[]");

  const checkAuth = (): void => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) user.value = JSON.parse(savedUser);
  };
  checkAuth();

  const isAuthenticated = computed(() => !!user.value);

  const register = async (formData: User): Promise<void> => {
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
      router.push("/login"); 
    }

    isLoading.value = false;
  };

  const login = async (formData: User): Promise<void> => {
    isLoading.value = true;
    errorMessage.value = "";
    await new Promise((r) => setTimeout(r, 1500));

    const userFound = getRegisteredUsers().find(
      (u) => u.username === formData.username && u.password === formData.password
    );

    if (userFound) {
      user.value = userFound;
      localStorage.setItem("user", JSON.stringify(userFound));
      router.push("/users"); 
    } else {
      errorMessage.value = "Sai username hoặc password!";
    }

    isLoading.value = false;
  };

  const logout = (): void => {
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
