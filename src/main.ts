import {createApp} from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "bootstrap";
import "@/assets/scss/custom.scss";
import {createLongPressDirective} from "@/util/LongPressDirective";
import mitt from "mitt";

const emitter = mitt();

const app = createApp(App);

app.config.globalProperties.$eventBus = emitter;

app
  .use(store)
  .use(router)
  .directive("long-press", createLongPressDirective())
  .mount("#app");
