<template >
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
<script setup>
import { ref, watch } from "vue";
import { useDataStore } from "../../stores/dataStore";
import TextInput from "../common/TextInput.vue";
import Dialog from "../common/Dialog.vue";
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["save", "close"]);

const userStore = useDataStore();

const editableUser = ref({});
const columns = ref([
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
  },
  { immediate: true }
);

async function handleSubmit() {
  const result = await userStore.saveItem({ ...editableUser.value });

  console.log("🚀 ~ handleSubmit ~ result:", result);
  if (result !== false) {
    close();
  }
}

function close() {
  emit("close");
}
</script>
