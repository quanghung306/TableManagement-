<template>
  <div class="bg-gray-100 text-gray-800 h-screen transition-all duration-300 flex flex-col font-serif "
    :class="[isOpen ? 'w-64' : 'w-12']">
    
    <!-- Nút Toggle -->
    <div class="p-4 flex items-center justify-between bg-gray-200">
      <h1 v-if="isOpen" class="text-lg font-bold text-gray-800">My Dashboard</h1>
      <button @click="toggleSidebar" class="focus:outline-none">
        <svg class="w-6 h-6 text-gray-800 cursor-pointer transition-transform"
          :class="{ 'rotate-180': isOpen }" xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
  
    <!-- Menu Items -->
    <nav class="flex-1 mt-4">
      <ul>
        <li v-for="item in menuItems" :key="item.name">
          <router-link :to="item.path"
            class="flex items-center px-4 py-3 space-x-3 hover:bg-gray-200 transition-colors duration-200 text-gray-700">
            <FormKitIcon :icon="item.icon" class="w-6 h-6" />
            <span v-if="isOpen" class="text-lg">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { FormKitIcon } from "@formkit/vue";

// Sidebar state
const isOpen = ref(true);

const menuItems = [
  { name: "User Management", icon: "dashboard", path: "/dashboard" },
  { name: "Product Management", icon: "Product", path: "/Product" },
];

// Toggle sidebar
const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
button svg {
  transition: transform 0.3s ease;
}

.router-link-active {
  background-color: #e2e8f0; 
  font-weight: bold;
  color: #2d3748; 
}
</style>