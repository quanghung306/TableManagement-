<template>
  <div class="flex h-screen">
    <SideBar v-if="authStore.user" />
    <div class="flex-1 flex flex-col">
      <Navbar v-if="authStore.user" />
      <div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "./components/layout/Navbar.vue";
import SideBar from "./components/layout/SideBar.vue";
import { useAuthStore } from "./stores/authStore";
const authStore = useAuthStore();
</script>
