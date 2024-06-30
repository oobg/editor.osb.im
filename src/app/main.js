import { createApp } from "vue";
import App from "@/app/App.vue";
import plugins from "@/app/plugins";

import "@/app/assets/main.css";

const app = createApp(App);
plugins.register(app);
app.mount("#app");
