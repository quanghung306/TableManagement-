<template>
  <Dialog :isOpen="isOpen">
    <template #context>
      <h2 class="text-xl font-semibold mb-4">
        {{ modelValue.id ? "Edit User" : "Add User" }}
      </h2>
      <form @submit.prevent="handleSubmit">
        <div v-for="column in columns" :key="column.key" class="mb-4">
          <label class="block text-gray-700 capitalize">{{ column.key }}</label>
          <component
            :is="column.inputType || 'input'"
            v-model="editableUser[column.key]"
            class="border p-2 rounded w-full mt-1"
            :placeholder="`Enter ${column.key}`"
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
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useDataStore } from "../../stores/dataStore";
import Dialog from "../common/Dialog.vue";
import * as TextInput from "../common/TextInput.vue";

interface User {
  id?: string;
  ProductName: string;
  Category: string;
  Price: number;
  Stock: number;
}

interface Column {
  key: keyof User;
  inputType?: any;
}

// Props & Emit
const props = defineProps<{ modelValue: User; isOpen: boolean }>();
const emit = defineEmits<{
  save: [user: User];
  close: [];
}>();

const userStore = useDataStore();

// Trạng thái user có thể chỉnh sửa
const editableUser = ref<User>({
  ProductName: "",
  Category: "",
  Price: 0,
  Stock: 0,
});

const columns: Column[] = [
  { key: "ProductName", inputType: TextInput },
  { key: "Category", inputType: TextInput },
  { key: "Price", inputType: TextInput },
  { key: "Stock", inputType: TextInput },
];

// Đồng bộ `editableUser` khi `modelValue` thay đổi
watch(
  () => props.modelValue,
  (newVal) => {
    editableUser.value = newVal
      ? { ...newVal }
      : { ProductName: "", Category: "", Price: 0, Stock: 0 };
  },
  { immediate: true }
);

// Xử lý submit
const handleSubmit = async () => {
  const result = await userStore.saveItem({ ...editableUser.value });
  if (result !== false) close();
};

// Đóng Dialog
const close = () => emit("close");
</script>
