<template>
  <Dialog :isOpen="isOpen">
    <template #context>
      <h2 class="text-xl font-semibold mb-4">
        {{ modelValue.id ? "Edit User" : "Add User" }}
      </h2>
      <form @submit.prevent="handleSubmit">
        <div v-for="column in columns" :key="column.key" class="mb-4">
          <label class="block text-gray-700 capitalize">{{ column.key }}</label>

          <select
            v-if="column.key === 'Gender'"
            v-model="editableUser[column.key]"
            class="border p-2 rounded w-full mt-1"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
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
            @blur="validateField(column.key)"
          />

          <!-- Hiển thị lỗi nếu có -->
          <p v-if="errors[column.key]" class="text-red-500 text-sm mt-1">
            {{ errors[column.key] }}
          </p>
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
            :disabled="Object.keys(errors).length > 0"
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
import TextInput from "../common/TextInput.vue";
import Dialog from "../common/Dialog.vue";

interface User {
  id?: string;
  Name: string;
  Position: string;
  Status: "Active" | "Inactive" | "Pending";
  Gender: "Male" | "Female";
  Email: string;
  Avatar: string;
}
interface Column {
  key: keyof User;
  inputType?: any;
}
const props = defineProps<{
  modelValue: User |any ;
  isOpen: boolean;
}>();
const emit = defineEmits<{
  (e: "save", user: User): void;
  (e: "close"): void;
}>();

const userStore = useDataStore();

const editableUser = ref<Partial<User>>({});
const errors = ref<Partial<Record<keyof User, string>>>({}); // Lưu lỗi validation

const columns = ref<Column[]>([
  { key: "Name", inputType: TextInput },
  { key: "Position", inputType: TextInput },
  { key: "Status" },
  { key: "Gender" },
  { key: "Email", inputType: TextInput },
]);

// Cập nhật editableUser khi modelValue thay đổi
watch(
  () => props.modelValue,
  (newVal) => {
    editableUser.value = newVal ? { ...newVal } : {};
    errors.value = {}; // Reset lỗi khi mở form
  },
  { immediate: true }
);

// ✅ Hàm kiểm tra email hợp lệ
function validateField(field: keyof User) {
  // if (field === "Name") {
  //   if (!editableUser.value.Name) {
  //     errors.value.Name = "Name không được để trống";
  //   } else {
  //     delete errors.value.Name;
  //   }
  // }
  if (field === "Email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editableUser.value.Email) {
      errors.value.Email = "Email không được để trống";
    } else if (!emailRegex.test(editableUser.value.Email)) {
      errors.value.Email = "Email không hợp lệ";
    } else {
      delete errors.value.Email;
    }
  }
}

// ✅ Kiểm tra toàn bộ form trước khi submit
const handleSubmit = async () => {
  validateField("Email"); // Check lỗi trước khi submit

  if (Object.keys(errors.value).length > 0) {
    return; // Không submit nếu có lỗi
  }

  const result = await userStore.saveItem({ ...editableUser.value });

  if (result !== false) {
    close();
  }
};

const close = () => {
  emit("close");
};
</script>
