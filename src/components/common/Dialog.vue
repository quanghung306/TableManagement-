<template >
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div class="absolute z-0 inset-0 flex bg-gray-900 opacity-50"></div>
      <div class="bg-white p-6 rounded shadow-lg w-96 absolute z-10">
       <slot name="context"></slot>
      </div>
    </div>
  </template>
  <script setup>
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
  });
  
  </script>
  