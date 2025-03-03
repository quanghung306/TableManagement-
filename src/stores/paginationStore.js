import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePaginationStore = defineStore("pagination", () => {
  const currentPage = ref(1);
  const pageSize = ref(5);
  const totalItems = ref(0);

  const totalPages = computed(() =>
    Math.ceil(totalItems.value / pageSize.value)
  );

  function setPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  function setTotalItems(count) {
    totalItems.value = count;
  }

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    setPage,
    setTotalItems,
  };
});
