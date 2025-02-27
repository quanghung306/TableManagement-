<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <div class="absolute z-0 inset-0 flex bg-gray-900 opacity-50"></div>
    <div class="bg-white p-6 rounded shadow-lg w-96 absolute z-10">
      <h2 class="text-xl font-semibold mb-4">{{ modelValue.id ? "Edit User" : "Add User" }}</h2>
      <form @submit.prevent="handleSubmit">
        <div v-for="column in columns" :key="column.key" class="mb-4">
            <label class="block text-gray-700 capitalize">{{ column.key }}</label>
            <select
              v-if="column.key === 'Role'"
              v-model="editableUser[column.key]"
              class="border p-2 rounded w-full mt-1"
            >
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
            </select>
            <select
              v-else-if="column.key === 'Status'"
              v-model="editableUser[column.key]"
              class="border p-2 rounded w-full mt-1"
              
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
            <component
              v-else
              :is="column.inputType || 'input'"
              v-model="editableUser[column.key]"
              class="border p-2 rounded w-full mt-1"
              :placeholder="'Enter ' + column.key"
            />
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            @click="close"
            class="mr-2 px-4 py-2 rounded bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded bg-blue-500 text-white cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useColumnStore } from "../../stores/columnStore";
import { useUserStore } from "../../stores/userStore";
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["save", "close"]);

const columnStore = useColumnStore();
const userStore = useUserStore();

const columns = columnStore.columns;
const editableUser = ref({});

// Cập nhật editableUser khi modelValue thay đổi
watch(
  () => props.modelValue,
  (newVal) => {
    editableUser.value = newVal ? { ...newVal } : {};
  },
  { immediate: true }
);

function handleSubmit () {
  const result = userStore.saveUser({ ...editableUser.value });
  if (result !== false) {
    close();
  }
  console.log("🚀 ~ handleSave ~ result:", result);
}

function close() {
  emit("close");
}
</script>
