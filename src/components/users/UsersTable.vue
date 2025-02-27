<template>
  <div class="bg-gray-50 font-serif">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <div class="flex justify-between items-center mb-6">
        <div class="flex space-x-2">
          <SearchInput />
        </div>
        <div class="flex space-x-2">
          <button
            v-if="isAllSelected"
            @click="deleteSelectedUsers"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition duration-150 ease-in-out cursor-pointer"
          >
            Delete Selected
          </button>
          <button
            @click="openAddDialog"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition duration-150 ease-in-out cursor-pointer"
          >
            <i class="pi pi-user-plus" style="font-size: 1rem"></i>
          </button>
        </div>
      </div>
      <div class="overflow-auto">
        <table class="w-full bg-white">
          <thead>
            <tr>
              <th class="bg-blue-500 pl-3 pt-2 text-left">
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
                class="bg-blue-500 text-left text-xl text-white group cursor-pointer"
                @click="handleColumnSort(column.key)"
              >
                {{ column.key }}
                <span class="inline-flex items-center text-black-800">
                  <svg
                    class="w-4 h-4 transition-all"
                    :class="{
                      'rotate-0': sortBy === column.key && sortOrder === 'asc',
                      'rotate-180':
                        sortBy === column.key && sortOrder === 'desc',
                      'opacity-100 visible': sortBy === column.key,
                      'opacity-0 invisible group-hover:opacity-100 group-hover:visible':
                        sortBy !== column.key,
                    }"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </th>

              <th class="bg-blue-500" />
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
                class="py-4 items-center"
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
                  class="px-2 py-1 inline-flex text-1xl leading-5 font-bold rounded-full"
                >
                  {{ user.Status }}
                </span>
                <span v-else>
                  {{ user[column.key] }}
                </span>
              </td>
              <td class="text-right">
                <button
                  @click="openEditDialog(user)"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md shadow-md transition duration-150 ease-in-out cursor-pointer"
                >
                  <i class="pi pi-pencil" style="font-size: 1rem"></i>
                </button>
                <button
                  @click="userStore.deleteUser(user.id)"
                  class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md shadow-md transition duration-150 ease-in-out ml-2 cursor-pointer"
                >
                  <i class="pi pi-trash" style="font-size: 1rem"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <!-- <tbody>
      <tr v-for="user in paginatedUsers" :key="user.id" class="border-b border-gray-300 bg-white hover:bg-gray-100 transition duration-150 ease-in-out">
        <td class="pl-3 pt-1.5 items-center">
          <input type="checkbox" :value="user.id" v-model="selectedUsers" class="cursor-pointer w-4 h-4" />
        </td>
        <td v-for="column in columns" :key="column.key" class="py-4 items-center">
          <div v-if="column.key === 'Name'" class="flex items-center">
            <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`" alt="User Avatar" class="h-10 w-10 rounded-full mr-2" />
            <span>{{ user.Name }}</span>
          </div>
          <span v-else-if="column.key === 'Status'" :class="getStatusClass(user.Status)" class="px-2 py-1 inline-flex text-1xl leading-5 font-bold rounded-full">
            {{ user.Status }}
          </span>
          <span v-else>{{ user[column.key] }}</span>
        </td>
        <td class="text-right">
          <button @click="openEditDialog(user)" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md shadow-md transition duration-150 ease-in-out cursor-pointer">
            <i class="pi pi-pencil" style="font-size: 1rem"></i>
          </button>
          <button @click="userStore.deleteUser(user.id)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md shadow-md transition duration-150 ease-in-out ml-2 cursor-pointer">
            <i class="pi pi-trash" style="font-size: 1rem"></i>
          </button>
        </td>
      </tr>
    </tbody> -->
        </table>
      </div>
      <div class="flex justify-center mt-4">
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import SearchInput from "../common/SearchInput.vue";
import EditUser from "./EditUser.vue";
import { useColumnStore } from "../../stores/columnStore";
import { useUserStore } from "../../stores/userStore";

import Pagination from "../common/Pagination.vue";
import { usePaginationStore } from "../../stores/paginationStore";

const userStore = useUserStore();
const columnStore = useColumnStore();

const paginationStore = usePaginationStore();
const { currentPage, pageSize } = storeToRefs(paginationStore);

const { sortedUsers, sortBy, sortOrder, toggleSort } = storeToRefs(userStore);
const { columns } = storeToRefs(columnStore);

const isDialogOpen = ref(false);
const selectedUser = ref({});
const selectedUsers = ref([]);

const isAllSelected = computed(
  () => selectedUsers.value.length === sortedUsers.value.length
);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return sortedUsers.value.slice(start, start + pageSize.value);
});
watch(
  sortedUsers,
  () => {
    paginationStore.setTotalItems(sortedUsers.value.length);
  },
  { immediate: true }
);

function toggleSelectAll(event) {
  if (event.target.checked) {
    selectedUsers.value = sortedUsers.value.map((user) => user.id);
  } else {
    selectedUsers.value = [];
  }
}

function deleteSelectedUsers() {
  selectedUsers.value.forEach((userId) => {
    userStore.deleteUser(userId);
  });
  selectedUsers.value = [];
}

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
