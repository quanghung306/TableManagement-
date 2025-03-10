<template>
  <div class="bg-white rounded-lg m-2">
    <div class="flex justify-between items-center mb-6 ml-2">
      <div class="flex space-x-2">
        <SearchInput />
      </div>
      <div class="flex space-x-2 mr-4 mt-2">
        <button
          v-if="selectedItems.length >= 1"
          @click="deleteSelectedItems"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition duration-150 ease-in-out cursor-pointer"
        >
          Delete Selected
        </button>
        <button
          @click="openAddDialog"
          class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md shadow-md transition duration-150 ease-in-out cursor-pointer"
        >
          <i class="pi pi-user-plus" style="font-size: 1rem"></i>
        </button>
      </div>
    </div>
    <div class="overflow-auto">
      <table class="w-full bg-white table-auto border-gray-300 border-2">
        <thead>
          <tr>
            <th class="bg-blue-500 pl-3 pt-2 text-left w-12">
              <input
                type="checkbox"
                @change="toggleSelectAll"
                :checked="isAllSelected"
                class="cursor-pointer w-4 h-4"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              class="bg-blue-500 p-1.5 text-lg text-white group cursor-pointer w-[180px]"
              @click="handleColumnSort(column.key)"
            >
              <div class="flex items-center">
                {{ column.key }}
                <i
                  class="pi pi-arrow-down"
                  :class="{
                    'rotate-0': sortBy === column.key && sortOrder === 'asc',
                    'rotate-180': sortBy === column.key && sortOrder === 'desc',
                    'opacity-100 visible': sortBy === column.key,
                    'opacity-0 group-hover:opacity-100 group-hover:visible':
                      sortBy !== column.key,
                  }"
                  style="font-size: 0.8rem"
                ></i>
              </div>
            </th>
            <th class="bg-blue-500 text-lg text-white text-center w-20">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in paginatedItems"
            :key="item.id"
            class="border-b border-gray-300 bg-white hover:bg-gray-100 transition duration-150 ease-in-out"
          >
            <td class="pl-3 pt-1.5 items-center">
              <input
                type="checkbox"
                :value="item.id"
                v-model="selectedItems"
                class="cursor-pointer w-4 h-4"
              />
            </td>

            <!-- Duyệt qua từng cột -->
            <td v-for="column in columns" :key="column.key" class="py-4 px-2">
              <template v-if="editingRow === item.id">
                <component
                 :is="column.inputType || 'input'"
                  v-model="editedItem[column.key]"
                  class="border border-gray-600 p-1 rounded"
                />
              </template>
              <template v-else>
                {{ item[column.key] }}
              </template>
            </td>
            <td class="text-right">
              <button
                v-if="editingRow === item.id"
                @click="saveEdit(item.id)"
                class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md shadow-md transition duration-150 ease-in-out mr-5 cursor-pointer"
              >
                <i class="pi pi-save" style="font-size: 1rem"></i>
              </button>
              <button
                v-else
                @click="startEdit(item)"
                class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md shadow-md transition duration-150 ease-in-out cursor-pointer m-5"
              >
                <i class="pi pi-pencil" style="font-size: 1rem"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-end">
      <Pagination />
    </div>
  </div>
  <EditProduct
    v-if="isDialogOpen"
    :modelValue="selectedItems"
    :isOpen="isDialogOpen"
    @save="handleSave"
    @close="closeDialog"
  />
</template>
    
    <script setup>
import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import SearchInput from "../common/SearchInpt.vue";
import { useDataStore } from "../../stores/dataStore";
import Swal from "sweetalert2";
import Pagination from "../common/Pagination.vue";
import { usePaginationStore } from "../../stores/paginationStore";
import EditProduct from "./EditProduct.vue";
import NumberInput from "../common/NumberInput.vue";
import TextInput from "../common/TextInput.vue";

const productStore = useDataStore();
const paginationStore = usePaginationStore();
const { currentPage, pageSize } = storeToRefs(paginationStore);
const { sortedItems, sortBy, sortOrder, toggleSort } =
  storeToRefs(productStore);
const editingRow = ref(null);
const editedItem = ref({});
const selectedItems = ref([]);
const isDialogOpen = ref(false);
const columns = ref([
  { key: "ProductName", inputType: TextInput },
  { key: "Category", inputType: TextInput },
  { key: "Price" , inputType: NumberInput},
  { key: "Stock", inputType: NumberInput },
]);

const isAllSelected = computed(
  () => selectedItems.value.length === sortedItems.value.length
);
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return sortedItems.value.slice(start, start + pageSize.value);
});

onMounted(() => {
  productStore.SetApi("https://660bb670ccda4cbc75dd7d2f.mockapi.io/products");
  productStore.fetchData();
});

watch(
  sortedItems,
  () => {
    paginationStore.setTotalItems(sortedItems.value.length);
  },
  { immediate: true }
);

function toggleSelectAll(event) {
  selectedItems.value = event.target.checked
    ? sortedItems.value.map((item) => item.id)
    : [];
}

const deleteSelectedItems = async () => {
  if (selectedItems.value.length === 0) {
    Swal.fire("No items have been selected!", "", "info");
    return;
  }
  Swal.fire({
    title: "Are you sure you want to delete these items?",
    text: `Delete ${selectedItems.value.length} items. This action cannot be undone!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  }).then(async (result) => {
    if (result.isConfirmed) {
      selectedItems.value.forEach((productId) => {
        productStore.deleteItems(productId);
      });
      selectedItems.value = [];
      Swal.fire("Deleted!", "", "success");
    }
  });
};

function handleColumnSort(columnKey) {
  productStore.toggleSort(columnKey);
}

const startEdit = (item) => {
  editingRow.value = item.id;
  editedItem.value = { ...item };
};

const saveEdit = async (itemId) => {
  try {
    console.log("Updating item:", itemId, editedItem.value);
    await productStore.updateItem(itemId, editedItem.value); // Gọi API cập nhật
    const index = productStore.items.findIndex((item) => item.id === itemId); // Cập nhật lại danh sách hiển thị
    if (index !== -1) {
      productStore.items[index] = { ...editedItem.value };
    }
    editingRow.value = null;
    Swal.fire("Save Info User Successfully!", "", "success");
  } catch (error) {
    console.error("Update error:", error);
    Swal.fire("error!", "", "error");
  }
};

const openAddDialog = () => {
  selectedItems.value = [];
  isDialogOpen.value = true;
};
const closeDialog = () => {
  isDialogOpen.value = false;
};

const handleSave = async (updatedUser) => {
  await productStore.updateItem(updatedUser.id, updatedUser);
  selectedItems.value = [];
  closeDialog();
};
watch(
  () => sortedItems.value,
  () => {
    selectedItems.value = []; // Reset lại khi danh sách sản phẩm thay đổis
  }
);
</script>
    