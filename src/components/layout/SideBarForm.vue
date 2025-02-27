<template>
  <div
    class="bg-gray-50 text-gray-800 h-screen transition-all duration-300 flex flex-col font-serif"
    :style="{ width: isOpen ? '16rem' : '4rem' }"
  >
    <!-- Toggle Button -->
    <div class="p-4 flex items-center bg-gray-100 border-b border-gray-300">
      <div class="flex items-center gap-3 flex-1">
        <i class="pi pi-microsoft"></i>
        <h1 v-if="isOpen" class="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
      </div>
      <button @click="toggleSidebar" class="focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
         class="w-6 h-6 text-gray-800 cursor-pointer transition-transform ml-2"
          :class="{ 'rotate-180': isOpen }"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 mt-4">
      <ul>
        <li v-for="item in menuItems" :key="item.name">
          <router-link
            :to="item.path"
            class="flex items-center px-4 py-3 space-x-3 hover:bg-gray-200 transition-colors duration-200 text-gray-700 group"
            :class="{
              'bg-gray-300 font-bold text-black': route.path === item.path,
            }"
          >
            <i
              v-if="item.name === 'Users Management'"
              class="pi pi-users transition-all duration-200"
              style="font-size: 1.5rem"
              :class="{
                'text-black scale-125':
                  route.path === item.path || route.path === item.path,
              }"
            />
            <span v-if="isOpen" class="text-lg transition-all duration-200">
              {{ item.name }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
// Sidebar state
const isOpen = ref(true);

const menuItems = [
  { name: "Users Management", icon: "dashboard", path: "/dashboard" },
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
  background-color: #f1f5f9;
  font-weight: bold;
  color: #334155;
}
</style>
