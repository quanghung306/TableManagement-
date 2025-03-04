<template>
  <div class="bg-white rounded-lg m-2">
    <div class="flex justify-between items-center mb-6 ml-2">
      <div class="flex space-x-2">
        <SearchInput />
      </div>
      <div class="flex space-x-2 mr-4 mt-2">
        <button
          v-if="isAllSelected"
          @click="deleteSelectedUsers"
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
            v-for="user in paginatedUsers"
            :key="user.id"
            class="border-b border-gray-300 bg-white hover:bg-gray-100 transition duration-150 ease-in-out"
          >
            <td class="pl-3 pt-1.5 items-center">
              <input
                type="checkbox"
                :value="user.id"
                v-model="selectedUsers"
                class="cursor-pointer w-4 h-4"
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              class="py-4 px-2 items-center"
            >
              <div v-if="column.key === 'Name'" class="flex items-center">
                <img
                  :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`"
                  alt="User Avatar"
                  class="h-10 w-10 rounded-full mr-2"
                />
                <!-- :src="user.Avatar || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`"  -->
                <span>{{ user.Name }}</span>
              </div>
              <span
                v-else-if="column.key === 'Status'"
                :class="getStatusClass(user.Status)"
                class="px-2 py-1 inline-flex leading-5 font-bold rounded-full"
              >
                {{ user.Status }}
              </span>
              <span v-else>
                {{ user[column.key] }}
              </span>
            </td>
            <td class="text-right">
              <!-- <button
                @click="userStore.deleteUser(user.id)"
                class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md shadow-md transition duration-150 ease-in-out ml-2 cursor-pointer  "
                >
                <i class="pi pi-trash" style="font-size: 1rem"></i>
              </button> -->
              <button
                @click="openEditDialog(user)"
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
  <EditUser
    v-if="isDialogOpen"
    :modelValue="selectedUser"
    :isOpen="isDialogOpen"
    @save="handleSave"
    @close="closeDialog"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted,} from "vue";
import { storeToRefs } from "pinia";
import SearchInput from "../common/SearchInput.vue";
import EditUser from "./EditUser.vue";
import { useDataStore } from "../../stores/dataStore";
import Swal from "sweetalert2";
import Pagination from "../common/Pagination.vue";
import { usePaginationStore } from "../../stores/paginationStore";

const userStore = useDataStore();

const paginationStore = usePaginationStore();
const { currentPage, pageSize } = storeToRefs(paginationStore);

const { sortedItems, sortBy, sortOrder, toggleSort } = storeToRefs(userStore);

const isDialogOpen = ref(false);
const selectedUser = ref({});
const selectedUsers = ref([]);

const columns = ref([
  { key: "Name" },
  { key: "Position" },
  { key: "Status" },
  { key: "Gender" },
  { key: "Email" },
]);

const isAllSelected = computed(
  () => selectedUsers.value.length === sortedItems.value.length
);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return sortedItems.value.slice(start, start + pageSize.value);
});
//gọi API
onMounted(() => {
  userStore.SetApi("https://660bb670ccda4cbc75dd7d2f.mockapi.io/users");
  userStore.fetchData();
});
watch(
  sortedItems,
  () => {
    paginationStore.setTotalItems(sortedItems.value.length);
  },
  { immediate: true }
);
function toggleSelectAll(event) {
  if (event.target.checked) {
    selectedUsers.value = sortedItems.value.map((user) => user.id);
  } else {
    selectedUsers.value = [];
  }
}

const deleteSelectedUsers = () => {
  if (selectedUsers.value.length === 0) {
    Swal.fire("No users have been selected!", "", "info");
    return;
  }
  Swal.fire({
    title: "Are you sure you want to delete these users?",
    text: `Delete ${selectedUsers.value.length} user. This action cannot be undone!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  }).then((result) => {
    if (result.isConfirmed) {
      selectedUsers.value.forEach((userId) => {
        userStore.deleteUser(userId);
      });
      selectedUsers.value = [];
      Swal.fire("Deleted!", "", "success");
    }
  });
};
function openEditDialog(user) {
  selectedUser.value = { ...user };
  isDialogOpen.value = true;
}

function openAddDialog() {
  selectedUser.value = {};
  isDialogOpen.value = true;
}

function closeDialog() {
  isDialogOpen.value = false;
}

function handleSave(updatedUser) {
  userStore.updateUser(updatedUser);
  closeDialog();
}

function handleColumnSort(columnKey) {
  userStore.toggleSort(columnKey);
}

const getStatusClass = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Inactive":
      return "bg-gray-100 text-gray-800";
    case "Pending":
      return "bg-red-100 text-red-900";
    default:
      return "bg-gray-200 text-gray-700";
  }
};
</script>

