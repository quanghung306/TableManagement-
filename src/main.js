import { createApp } from "vue";
import { createPinia } from "pinia";
import { plugin as FormKit, defaultConfig } from "@formkit/vue";
import "@formkit/themes/genesis";
import PrimeVue from "primevue/config";
import Button from "primevue/button"
import router from "./router";
import "./style.css";

import App from "./App.vue";

const pinia = createPinia();

createApp(App)
  .use(PrimeVue, { ripple: true })
  .use(router)
  .use(FormKit, defaultConfig)
  .use(pinia)
  .component("Button", Button)
  .mount("#app");
