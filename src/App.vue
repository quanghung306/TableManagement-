<template>
  <div class="flex h-screen">
    <SideBarForm v-if="authStore.user"/>
    <div class="flex-1 flex flex-col">
      <NavbarForm v-if="authStore.user"/>
      <div>
        <router-view />
      </div>
    </div>
  </div>
 
</template>

<script setup>
import NavbarForm from "./components/layout/Navbar.vue";
import SideBarForm from "./components/layout/SideBar.vue";
import { useAuthStore } from "./stores/authStore";
const authStore = useAuthStore();
</script>
