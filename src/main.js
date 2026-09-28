import { createApp } from "vue";
import "./assets/style.css";
import App from "./App.vue";
import VueSmoothScroll from "vue3-smooth-scroll";
import router from "./router";
import Button from "./components/Button.vue";
import LinkButton from "./components/LinkButton.vue";

const app = createApp(App);

app.use(router);

app.use(VueSmoothScroll);

app.component("Button", Button);

app.component("LinkButton", LinkButton);

app.mount("#app");