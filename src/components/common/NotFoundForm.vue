<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-6xl font-bold text-blue-600 mb-4">404</h1>
    <p class="text-xl text-gray-700 mb-6">
      Oops! page is currently not displayed, please come back later.
    </p>
    <router-link
      to="/"
      class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
    >
      Go Home
    </router-link>
  </div>
</template>
  
  <style scoped>
.fade-in {
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
  