import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePaginationStore = defineStore("pagination", () => {
  const currentPage = ref<number>(1);
  const pageSize = ref<number>(5);
  const totalItems = ref<number>(0);

  const totalPages = computed(() => {
    const pages = Math.ceil(totalItems.value / pageSize.value);
    return isNaN(pages) || pages < 1 ? 1 : pages; 
  });
  
  
  function setPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  function setTotalItems(count: number) {
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
