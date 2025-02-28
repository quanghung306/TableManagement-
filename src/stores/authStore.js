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

  const checkAuth = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) user.value = JSON.parse(savedUser);
  };
  checkAuth();

  const isAuthenticated = computed(() => !!user.value);
  const register = async (formData) => {
    isLoading.value = true;
    errorMessage.value = "";
    await new Promise((resolve) => setTimeout(resolve, 1500));
  
    if (formData.username || formData.password) {
     
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
      const isUserExist = registeredUsers.some(user => 
        user.username === formData.username 
      );
      if (isUserExist) {
        errorMessage.value = "Username đã tồn tại!";
      } else {
       
        registeredUsers.push(formData);
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  
        alert("Register Account Success! Please login.");
        router.push("/login");
      }
    } else {
      errorMessage.value = "Vui lòng nhập đầy đủ thông tin!";
    }
    isLoading.value = false;
  };
  
  
  const login = async (formData) => {
    isLoading.value = true;
    errorMessage.value = "";
    await new Promise((resolve) => setTimeout(resolve, 1500));
  
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
  
    const userFound = registeredUsers.find(user => 
      user.username === formData.username && user.password === formData.password
    );
  
    if (userFound) {
      user.value = userFound;
      localStorage.setItem("user", JSON.stringify(userFound)); 
      alert("Login Success! ");
      router.push("/dashboard");
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
