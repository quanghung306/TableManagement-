<template>
    <div class="relative w-64">
      <input
        v-model="localQuery"
        type="text"
        placeholder="Search Here..."
        class="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <svg
        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-4.35-4.35M15 10a5 5 0 11-10 0 5 5 0 0110 0z"
        ></path>
      </svg>
      <button
        v-if="localQuery"
        @click="clearSearch"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-600 cursor-pointer"
      >
        ✕
      </button>
      <button
        type="submit"
        @click="handleSearch"
        class="absolute end-2.1  bg-blue-700 rounded-lg text-sm text-white px-2 py-2.5 ml-2 mt-0.4 hover:bg-blue-800 cursor-pointer"
      >
      <i class=" pi pi-search" ></i>
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useUserStore } from "../../stores/userStore";
  
  const userStore = useUserStore();
  const localQuery = ref(userStore.searchQuery);
  
  const handleSearch = () => {
      userStore.setSearchQuery(localQuery.value);
    };
  
  const clearSearch = () => {
    localQuery.value = "";
    userStore.setSearchQuery("");
  };
  </script>