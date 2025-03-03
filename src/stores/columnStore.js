import { defineStore } from "pinia";
import TextInput from "../components/common/TextInput.vue";

export const useColumnStore = defineStore("column", {
  state: () => ({
    columns: [
      // { key: "Avatar" ,inputType: TextInput},
      { key: "Name",inputType: TextInput },
      { key: "Position",inputType: TextInput },
      { key: "Status"},
      { key: "Gender" },
      { key: "Email",inputType: TextInput },
    ],
  }),
});
