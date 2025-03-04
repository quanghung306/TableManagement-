import { defineStore } from "pinia";
import { ref, computed } from "vue";

import Swal from "sweetalert2";
import axios from "axios";

// const API_URL = "https://660bb670ccda4cbc75dd7d2f.mockapi.io/users";

export const useDataStore = defineStore("data", () => {
  // State
  const items = ref([]);
  const sortBy = ref("");
  const sortOrder = ref("asc");
  const searchQuery = ref("");
  const apiURL = ref("");

  const SetApi = (url) => {
    apiURL.value = url;
  };

  const fetchData = async () => {
    if (!apiURL.value) return;
    try {
      Swal.fire({
        title: "Loading...",
        text: "Loading data, please wait!",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await axios.get(apiURL.value);
      items.value = response.data || [];
      Swal.close();
    } catch (error) {
      Swal.fire("Error loading data!!", "", "error");
    }
  };

  // Getter
  const sortedItems = computed(() => {
    let list = items.value;
    if (searchQuery.value) {
      list = list.filter((items) =>
        items.Name?.toLowerCase().includes(searchQuery.value.toLowerCase())
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

  const saveItem = async (newItem) => {
    if (!apiURL.value) return;
    try {
      if (!newItem.Name) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please enter complete information!",
        });
        return false;
      }

      if (newItem.id) {
        await axios.put(`${apiURL.value}/${newItem.id}`, newItem);
        items.value = items.value.map((item) =>
          item.id === newItem.id ? newItem : item
        );
        Swal.fire("Update Successfully!", "", "success");
      } else {
        const response = await axios.post(apiURL.value, newItem);
        items.value.push(response.data);
        Swal.fire("Added Successfully!", "", "success");
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Can't save item!" });
      return false;
    }
  };
  const deleteItems = async (productId) => {
    if (!apiURL.value) return;
    try {
      const url = `${apiURL.value}/${String(productId)}`;
      console.log("API URL:", apiURL.value);
      console.log("Deleting:", url);

      // Kiểm tra item có tồn tại trong danh sách không
      const foundItem = items.value.find(
        (item) => item.id === String(productId)
      );
      console.log("Item found:", foundItem);

      if (!foundItem) {
        console.error("Delete Error: Item not found in local state");
        return;
      }
      await axios.delete(url);
      items.value = items.value.filter((item) => item.id !== String(productId));
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message);
      Swal.fire("Failed to delete!", "", "error");
    }
  };
  const updateItem = async (id, updatedData) => {
    try {
      const response = await axios.put(`${apiURL.value}/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  };

  return {
    SetApi,
    items,
    sortBy,
    sortOrder,
    searchQuery,
    sortedItems,
    toggleSort,
    setSearchQuery,
    saveItem,
    deleteItems,
    fetchData,
    updateItem,
  };
});
