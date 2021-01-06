import {createRouter, createWebHistory, RouteRecordRaw, RouterOptions} from "vue-router";
import Engine from "../views/Engine.vue";

const routes: Array<RouteRecordRaw> = [{
  path: "/",
  name: "Engine",
  component: Engine,
} as RouteRecordRaw,
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
} as RouterOptions);

export default router;
