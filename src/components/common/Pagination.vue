<template>
    <div class="flex justify-center items-center space-x-2 mt-4">
      <!-- Slot cho nút Prev -->
      <slot name="prev" :disabled="currentPage === 1" :goToPrevPage="goToPrevPage">
        <button
          @click="goToPrevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-md transition-all duration-200 ease-in-out 
                bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Prev
        </button>
      </slot>
  
      <!-- Danh sách số trang -->
      <div class="flex space-x-1">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="setPage(page)"
          class="w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 ease-in-out
                 border border-gray-300"
          :class="{
            'bg-blue-500 text-white font-bold border-blue-500': page === currentPage,
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
          class="px-3 py-1 rounded-md transition-all duration-200 ease-in-out 
                bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </slot>
    </div>
  </template>
  
  <script setup>
  import { storeToRefs } from 'pinia';
  import { usePaginationStore } from '../../stores/paginationStore';
  
  const paginationStore = usePaginationStore();
  const { currentPage, totalPages } = storeToRefs(paginationStore);
  const { setPage } = paginationStore;
  
  const goToPrevPage = () => setPage(currentPage.value - 1);
  const goToNextPage = () => setPage(currentPage.value + 1);
  </script>