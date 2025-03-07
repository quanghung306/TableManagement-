<template>
  <div class="flex items-center justify-center min-h-screen">
    <div
      class="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-md p-8 font-serif"
    >
      <h1 class="text-4xl font-bold mb-6 text-center text-blue-700">Welcome</h1>
      <FormKit
        @submit="handleLogin"
        type="form"
        :actions="false"
        :incomplete-message="false"
        class="space-y-6"
      >
        <FormKit
          type="text"
          label="Username"
          name="username"
          placeholder="Enter your username"
          validation="required"
          label-class="text-gray-700 font-serif"
          input-class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FormKit
          type="password"
          label="Password"
          name="password"
          placeholder="Enter your password"
          validation="required"
          label-class="text-gray-700"
          input-class=" px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          suffix-icon="eyeClosed"
          suffix-icon-class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer hover:text-blue-600"
          @suffix-icon-click="handleIconClick"
        />

        <div class="flex justify-between items-center text-sm">
          <FormKit
            type="checkbox"
            label="Remember Me"
            name="rememberMe"
            input-class="mr-2"
            label-class="text-gray-700"
          />
          <router-link
            to="/forgot-password"
            class="text-blue-600 hover:underline pb-3.5"
          >
            Forgot Password?
          </router-link>
        </div>
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
      <transition name="fade">
        <p v-if="authStore.errorMessage" class="text-red-500 text-center mt-2">
          {{ authStore.errorMessage }}
        </p>
      </transition>
      <p class="text-center text-gray-700 mt-4">
        Don't have an account?
        <router-link to="/register" class="text-blue-700 hover:underline">
          Register
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore";
import type { FormKitNode } from "@formkit/core";

const authStore = useAuthStore();
const { isLoading } = storeToRefs(authStore);

interface LoginForm {
  username: string;
  password: string;
  rememberMe?: boolean;
}

const handleLogin = (formData: LoginForm) => {
  authStore.login(formData);
};

const handleIconClick = (node: FormKitNode) => {
  const isPassword = node.props.type === "password";
  node.input({
    type: isPassword ? "text" : "password",
    suffixIcon: isPassword ? "eye" : "eyeClosed",
  });
};
</script>
