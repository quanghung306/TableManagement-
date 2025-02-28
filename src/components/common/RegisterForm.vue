<template>
  <div
    class="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-md p-8 font-serif"
  >
    <h1 class="text-4xl font-bold mb-6 text-center text-blue-700">Register</h1>

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
        validation="required"
        validation-message="Vui lòng nhập username"
      />
      <FormKit
        type="password"
        name="password"
        label="Password "
        validation="required|length:6"
        validation-messages="{
              required: 'Vui lòng nhập mật khẩu',
              length: 'Mật khẩu ít nhất 6 ký tự'
            }"
      />

      <FormKit
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        validation="required|confirm"
        validation-messages="{
            required: 'Vui lòng nhập lại mật khẩu',
             confirm: 'Mật khẩu không khớp'
        }"
      />
      <FormKit
        type="submit"
        :disabled="isLoading"
        :label="isLoading ? 'Logging in...' : 'Login'"
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

    <p v-if="authStore.errorMessage" class="text-red-500 text-sm mt-2">
      {{ authStore.errorMessage }}
    </p>

    <p class="mt-4 text-sm text-center">
      Already have an account?
      <RouterLink to="/login" class="text-blue-500 hover:underline"
        >Login</RouterLink
      >
    </p>
  </div>
</template>
  
  <script setup>
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleRegister = (formData) => {
  authStore.register(formData);
};
</script>
  