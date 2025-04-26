import { defineStore } from "pinia";
import { ref, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { useI18n } from "vue-i18n";

interface Item {
  id?: string;
  Name?: string;
  ProductName?: string;
  [key: string]: any;
}

export const useDataStore = defineStore("data", () => {
  const items = ref<Item[]>([]);
  const sortBy = ref<string>("");
  const sortOrder = ref<"asc" | "desc">("asc");
  const searchQuery = ref<string>("");
  const apiURL = ref<string>("");

  const { t } = useI18n(); // dùng i18n nè

  const SetApi = (url: string) => {
    apiURL.value = url;
  };

  const fetchData = async () => {
    if (!apiURL.value) return;
    try {
      Swal.fire({
        title: t("loading"),
        text: t("loadingDataPleaseWait"),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await axios.get<Item[]>(apiURL.value);
      items.value = response.data || [];
      Swal.close();
    } catch (error) {
      Swal.fire(t("errorLoadingData"), "", "error");
    }
  };

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
          title: t("oops"),
          text: t("pleaseEnterCompleteInfo"),
        });
        return false;
      }

      if (newItem.id) {
        await axios.put(`${apiURL.value}/${newItem.id}`, newItem);
        items.value = items.value.map((item) =>
          item.id === newItem.id ? newItem : item
        );
        Swal.fire(t("updateSuccessfully"), "", "success");
      } else {
        const response = await axios.post<Item>(apiURL.value, newItem);
        items.value.push(response.data);
        Swal.fire(t("addedSuccessfully"), "", "success");
      }
      return true;
    } catch (error) {
      Swal.fire({ icon: "error", title: t("oops"), text: t("cantSaveItem") });
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
      Swal.fire(t("failedToDelete"), "", "error");
    }
  };

  const deleteMultipleItems = async (selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      Swal.fire(t("noItemsSelected"), "", "info");
      return;
    }
    const result = await Swal.fire({
      title: t("areYouSure"),
      text: t("deleteItemsConfirm", { count: selectedIds.length }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("delete"),
      cancelButtonText: t("cancel"),
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });
    if (!result.isConfirmed) return;
    Swal.fire({
      title: t("deleting"),
      text: t("pleaseWaitWhileDeleting"),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      for (const id of selectedIds) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await axios.delete(`${apiURL.value}/${id}`);
        items.value = items.value.filter((item) => item.id !== id);
      }
      await fetchData();
      Swal.fire(t("deletedSuccessfully"), "", "success");
    } catch (error) {
      Swal.fire(t("failedToDelete"), t("somethingWentWrong"), "error");
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
