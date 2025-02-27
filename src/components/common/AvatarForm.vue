<template>
    <Menu as="div" class="relative inline-block text-left">
        <div>
          <MenuButton class="flex items-center space-x-2 focus:outline-none">
            <img
              :src="'https://res.cloudinary.com/quanghung/image/upload/v1739957900/350512317_2248145465395698_4189543060711641401_n_xcokha.jpg'"
              alt="Avatar"
              class="w-10 h-10 rounded-full border cursor-pointer"
            />
          </MenuButton>
        </div>
  
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems class="absolute right-0 mt-2 w-48 origin-top-right bg-white border rounded-md shadow-lg focus:outline-none">
            <div class="py-1">
              <MenuItems v-slot="{ active }">
                <button
                  @click="logout"
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block w-full px-4 py-2 text-left text-sm',
                  ]"
                >
                  Đăng xuất
                </button>
              </MenuItems>
            </div>
          </MenuItems>
        </transition>
      </Menu>
  </template>
  
  <script setup>
  import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
  import { useAuthStore } from "../../stores/authStore";
  import { useRouter } from "vue-router";
  const authStore = useAuthStore();
  const router = useRouter();
  
  const logout = () => {
    authStore.logout();
    router.push("/login");
  };

  </script>
  