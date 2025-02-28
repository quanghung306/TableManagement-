<template>
  <div class="flex justify-center items-center space-x-2 mt-2 mb-2 mr-1">
    <!-- Slot cho nút Prev -->
    <slot name="prev" :disabled="currentPage === 1" :goToPrevPage="goToPrevPage">
      <button
        @click="goToPrevPage"
        :disabled="currentPage === 1"
        class="px-2.5 py-1.5 rounded-md transition-all duration-300 ease-in-out 
              bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed scale-100 hover:scale-110"
      >
        <i class="pi pi-caret-left text-lg "></i>
      </button>
    </slot>

    <!-- Danh sách số trang  -->
    <div class="flex space-x-1">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="setPage(page)"
        class="w-9 h-9 flex items-center justify-center rounded-md transition-all duration-300 ease-in-out
               border border-gray-300 transform scale-100 hover:scale-110"
        :class="{
          'bg-blue-500 text-white font-bold border-blue-500 shadow-md': page === currentPage,
          'hover:bg-gray-200': page !== currentPage
        }"
      >
        {{ page }}
      </button>
    </div>

    <!-- Slot cho nút Next -->
    <slot name="next" :disabled="currentPage === totalPages" :goToNextPage="goToNextPage">
      <button
        @click="goToNextPage"
        :disabled="currentPage === totalPages"
        class="px-2.5 py-1.5 rounded-md transition-all duration-300 ease-in-out 
        bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed scale-100 hover:scale-110"
      >
        <i class="pi pi-caret-right text-lg"></i>
      </button>
    </slot>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { usePaginationStore } from "../../stores/paginationStore";

const paginationStore = usePaginationStore();
const { currentPage, totalPages } = storeToRefs(paginationStore);
const { setPage } = paginationStore;

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    setPage(currentPage.value - 1);
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    setPage(currentPage.value + 1);
  }
};
</script>
