<template>
  <div
    class="bg-gray-50 text-gray-800 h-screen transition-all duration-300 flex flex-col font-serif"
    :class="isOpen ? 'w-64' : 'w-16'"
  >
    <!-- Toggle Button -->
    <div
      class="p-4 flex items-center bg-gray-100 border-b border-gray-300 h-16"
    >
      <div class="flex items-center gap-3 flex-1">
        <i class="pi pi-microsoft"></i>
        <h1 v-if="isOpen" class="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
      </div>
      <button @click="toggleSidebar" class="focus:outline-none relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-7 h-7 text-gray-800 cursor-pointer transition duration-300 absolute -translate-y-1/2 left-1"
          :class="isOpen ? 'rotate-180' : ''"
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
    <nav class="flex-1 shadow-xl shadow-gray-200">
      <ul>
        <li v-for="item in menuItems" :key="item.name">
          <router-link
            :to="item.path"
            class="flex items-center px-4 py-3 space-x-3 hover:bg-gray-300 transition-colors duration-200"
          >
            <i
              :class="[
                'pi',
                item.icon,
                'transition-all duration-200',
                { 'text-black scale-100': route.path === item.path },
              ]"
              style="font-size: 1.5rem"
            />
            <p
              v-show="isOpen"
              class="text-lg transition-all duration-200 whitespace-nowrap"
            >
              {{ item.name }}
            </p>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

interface MenuItem {
  name: string;
  path: string;
  icon: string;
}

const route = useRoute();
const isOpen = ref<boolean>(true);

const menuItems: MenuItem[] = [
  { name: "Custormers Management", path: "/users", icon: "pi-users" },
  { name: "Product Management", path: "/product", icon: "pi-box" },
];

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.router-link-active {
  background-color: #c6c7c96b;
  font-weight: bold;
  color: #334155;
}
</style>
