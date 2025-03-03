import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import axios from "axios";

const API_URL = "https://660bb670ccda4cbc75dd7d2f.mockapi.io/users";

export const useUserStore = defineStore("user", () => {
  // State
  const user = ref([]);
  const sortBy = ref("");
  const sortOrder = ref("asc");
  const searchQuery = ref("");


  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      user.value = response.data || [];
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu nhà sản xuất!");
    }
  };

  onMounted(fetchUsers);

  // Getter
  const sortedUsers = computed(() => {
    let list = user.value;
    if (searchQuery.value) {
      list = list.filter((manufacturer) =>
        manufacturer.Name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
    if (!sortBy.value) return list;
    return [...list].sort((a, b) => {
      const valA = a[sortBy.value] ? a[sortBy.value].toString() : "";
      const valB = b[sortBy.value] ? b[sortBy.value].toString() : "";
      const result = valA.localeCompare(valB);
      return sortOrder.value === "asc" ? result : -result;
    });
  });

  // Actions
  const toggleSort = (columnKey) => {
    if (sortBy.value === columnKey) {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
      sortBy.value = columnKey;
      sortOrder.value = "asc";
    }
  };

  const setSearchQuery = (query) => {
    searchQuery.value = query;
  };

  const saveUser = async (newUser) => {
    try {
      if (!newUser.Name || !newUser.Position) {
        toast.error("Vui lòng nhập đầy đủ thông tin!");
        return false;
      }
  
      if (newUser.id) {
        await axios.put(`${API_URL}/${newUser.id}`, newUser);
        user.value = user.value.map((m) =>
          m.id === newUser.id ? newUser : m
        );
        toast.success("Update User Successfully!");
        return true;
      } else {
        const response = await axios.post(API_URL, newUser);
        user.value.push(response.data);
        toast.success("Add New User Successfully!");
      }
    } catch (error) {
      toast.error("Cant save user!");
      return false;
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      user.value = user.value.filter((m) => m.id !== id);
      toast.success("Delete Users Successfully!");
    } catch (error) {
      toast.error("Error!");
    }
  };

  return {
    user,
    sortBy,
    sortOrder,
    searchQuery,
    sortedUsers,
    toggleSort,
    setSearchQuery,
    saveUser,
    deleteUser,
    fetchUsers,
  };
});

