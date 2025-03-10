<template>
  <Dialog :isOpen="isOpen">
    <template #context>
      <h2 class="text-xl font-semibold mb-4">
        {{ modelValue.id ? "Edit Product" : "Add Product" }}
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

<script setup lang="ts">
import { ref, watch } from "vue";
import { useDataStore } from "../../stores/dataStore";
import TextInput from "../common/TextInput.vue";
import Dialog from "../common/Dialog.vue";
import NumberInput from "../common/NumberInput.vue";
import Swal from "sweetalert2";

interface Product {
  id: string;
  ProductName: string;
  Category: string;
  Price: number;
  Stock: number;
}

interface Column {
  key: keyof Product;
  inputType?: any;
}

const props = defineProps<{
  modelValue: Product;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "save", product: Product): void;
  (e: "close"): void;
}>();

const productStore = useDataStore();
const editableProduct = ref<Partial<Product>>({});
const columns = ref<Column[]>([
  { key: "ProductName", inputType: TextInput },
  { key: "Category", inputType: TextInput },
  { key: "Price", inputType: NumberInput },
  { key: "Stock", inputType: NumberInput },
]);

watch(
  () => props.modelValue,
  (newVal) => {
    editableProduct.value = newVal ? { ...newVal } : {};
  },
  { immediate: true }
);

const isValidNumber = (value: any): boolean => !isNaN(value) && value !== "";

const validateForm = (): boolean => {
  if (
    !isValidNumber(editableProduct.value.Price) ||
    !isValidNumber(editableProduct.value.Stock)
  ) {
    Swal.fire("Error", "Price và Stock phải là số!", "error");
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  const result = await productStore.saveItem(editableProduct.value as Product);
  if (result !== false) {
    Swal.fire("Success", "Item saved successfully!", "success");
    close();
  }
};

const close = () => {
  emit("close");
};
</script>
