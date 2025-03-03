<template>
  <div class="flex items-center justify-center min-h-screen">
    <div
      class="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-md p-8 font-serif"
    >
      <h1 class="text-4xl font-bold mb-6 text-center text-blue-700">
        Register
      </h1>

      <FormKit
        type="form"
        @submit="handleRegister"
        :actions="false"
        :incomplete-message="false"
      >
        <FormKit
          type="text"
          name="username"
          label="Username"
          placeholder="Your username"
          validation="required"
        />
        <FormKit
          type="password"
          name="password"
          label="Password"
          validation="required|length:6|matches:/[^a-zA-Z]/"
          :validation-messages="{
            matches: 'Please include at least one symbol',
          }"
          placeholder="Your password"
        />
        <FormKit
          type="password"
          name="password_confirm"
          label="Confirm password"
          placeholder="Confirm password"
          validation="required|confirm"
        />
        <FormKit
          type="submit"
          :disabled="isLoading"
          :label="isLoading ? 'Register in...' : 'Register'"
          :sections-schema="{
            outer: { $el: 'div', attrs: { class: 'w-full' } },
            input: {
              $el: 'button',
              attrs: {
                class:
                  'w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 text-white cursor-pointer disabled:bg-gray-400',
              },
            },
          }"
        />
      </FormKit>

      <p
        v-if="authStore.errorMessage"
        class="text-red-500 text-sm mt-2 text-center"
      >
        {{ authStore.errorMessage }}
      </p>

      <p class="text-center text-gray-700 mt-4">
        Already have an account?
        <RouterLink to="/login" class="text-blue-700 hover:underline"
          >Login</RouterLink
        >
      </p>
    </div>
  </div>
</template>
  <script setup>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
const authStore = useAuthStore();
const router = useRouter();
const { isLoading } = storeToRefs(authStore);
const handleRegister = (formData) => {
  authStore.register(formData);
};
</script>
  