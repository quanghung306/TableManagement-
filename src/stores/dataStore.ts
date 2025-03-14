import { defineStore } from "pinia";
import { ref, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";

interface Item {
  id?: string;
  Name?: string;
  ProductName?: string;
  [key: string]: any;
}

export const useDataStore = defineStore("data", () => {
  // State
  const items = ref<Item[]>([]);
  const sortBy = ref<string>("");
  const sortOrder = ref<"asc" | "desc">("asc");
  const searchQuery = ref<string>("");
  const apiURL = ref<string>("");

  // Set the API URL
  const SetApi = (url: string) => {
    apiURL.value = url;
  };

  // Fetch data from the API
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
      const response = await axios.get<Item[]>(apiURL.value);
      items.value = response.data || [];
      Swal.close();
    } catch (error) {
      Swal.fire("Error loading data!!", "", "error");
    }
  };

  // Getter to sort and Search items
  const sortedItems = computed<Item[]>(() => {
    let list = items.value;
    if (searchQuery.value) {
      list = list.filter((item) =>
        item.Name?.toLowerCase().includes(searchQuery.value.toLowerCase())
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

 //Actions
  const toggleSort = (columnKey: string) => {
    if (sortBy.value === columnKey) {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
      sortBy.value = columnKey;
      sortOrder.value = "asc";
    }
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };
  const saveItem = async (newItem: Item): Promise<boolean> => {
    if (!apiURL.value) return false;
    try {
      if (!newItem.Name && !newItem.ProductName) {
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
        const response = await axios.post<Item>(apiURL.value, newItem);
        items.value.push(response.data);
        Swal.fire("Added Successfully!", "", "success");
      }
      return true;
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Can't save item!" });
      return false;
    }
  };

  const deleteItems = async (itemId: string) => {
    if (!apiURL.value) return;
    try {
      const url = `${apiURL.value}/${itemId}`;
      await axios.delete(url);
      items.value = items.value.filter((item) => item.id !== itemId);
    } catch (error) {
      Swal.fire("Failed to delete!", "", "error");
    }
  };
  const deleteMultipleItems = async (selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      Swal.fire("No items selected!", "", "info");
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete ${selectedIds.length} items? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });
    if (!result.isConfirmed) return; 
    Swal.fire({
      title: "Deleting...",
      text: "Please wait while deleting items!",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      for (const id of selectedIds) {
        await new Promise((resolve) => setTimeout(resolve, 300)); // 🔥 Delay nhẹ
        await axios.delete(`${apiURL.value}/${id}`);
        items.value = items.value.filter((item) => item.id !== id);
      }
      await fetchData(); // 🔄 Fetch lại danh sách
      Swal.fire("Deleted!", "", "success");
    } catch (error) {
      Swal.fire("Failed to delete!", "Something went wrong", "error");
    }
  };

  const updateItem = async (id: string, updatedData: Partial<Item>) => {
    try {
      const response = await axios.put<Item>(
        `${apiURL.value}/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  };

  return {
    items,
    sortBy,
    sortOrder,
    searchQuery,
    SetApi,
    sortedItems,
    toggleSort,
    setSearchQuery,
    saveItem,
    deleteItems,
    deleteMultipleItems,
    fetchData,
    updateItem,
  };
});
