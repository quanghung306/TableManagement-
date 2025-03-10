<template >
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
            v-model="editableProduct[column.key]"
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
import NumberInput from "../common/NumberInput.vue";
import Swal from "sweetalert2";

const props = defineProps({
  modelValue: Object,
  isOpen: Boolean,
});
const emit = defineEmits(["save", "close"]);

const productStore = useDataStore();
const editableProduct  = ref({});
const columns = ref([
  { key: "ProductName", inputType: TextInput },
  { key: "Category", inputType: TextInput },
  { key: "Price", inputType: NumberInput },
  { key: "Stock", inputType: NumberInput },
]);

watch(
  () => props.modelValue,
  (newVal) => {
    editableProduct.value = Object.assign({}, newVal || {});
  },
  { immediate: true }
);

const isValidNumber = (value) => !isNaN(value) && value !== "";

function validateForm() {
  if (
    !isValidNumber(editableProduct.value.Price) ||
    !isValidNumber(editableProduct.value.Stock)
  ) {
    Swal.fire("Error", "Price và Stock phải là số!", "error");
    return false;
  }
  return true;
}

async function handleSubmit() {
  if (!validateForm()) return ;

  const result = await productStore.saveItem(editableProduct.value);
  if (result !== false) {
    Swal.fire("Success", "Item saved successfully!", "success");
    close();
  }
}

// async function handleSubmit() {
//   const result = await productStore.saveItem({ ...editableProduct.value });

//   console.log("🚀 ~ handleSubmit ~ result:", result);
//   if (result !== false) {
//     close();
//   }
// }
function close() {
  emit("close");
}
</script>
