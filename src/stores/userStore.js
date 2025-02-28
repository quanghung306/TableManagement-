import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { users as userData } from "../data/users";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
export const useUserStore = defineStore("user", () => {
  // State
  const users = ref([...userData]);
  const sortBy = ref("");
  const sortOrder = ref("asc");
  const searchQuery = ref("");

  // Getter
  const sortedUsers = computed(() => {
    let list = users.value;
    if (searchQuery.value) {
      list = list.filter((user) =>
        user.Name.toLowerCase().includes(searchQuery.value.toLowerCase())
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

  // Action
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

 const saveUser = (user) => {
    if (!user.Name || !user.Email || !user.Title) {
      toast.error("Vui lòng nhập đầy đủ thông tin!", {
        autoClose: 3000,
        transition: "zoom",
      });
      return false;
    }
    const index = users.value.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users.value[index] = { ...user, isEditing: false };
      toast.success("Cập nhật thông tin thành công!", {
        autoClose: 1000,
        transition: "zoom",
      });
    } else {
      users.value.push({ ...user, id: Date.now() });
      if (!user.Name || !user.Email || !user.Title) {
        toast.success("Thêm user thành công!", {
          autoClose: 1000,
          transition: "zoom",
        });

      }
    }
  };
  const deleteUser = (id) => {
    users.value = users.value.filter((u) => u.id !== id);
  };

  return {
    users,
    sortBy,
    sortOrder,
    searchQuery,
    sortedUsers,
    toggleSort,
    setSearchQuery,
    saveUser,
    deleteUser,
  };
});
