import {createRouter, createWebHistory, RouteRecordRaw, RouterOptions} from "vue-router";
import Home from "../views/Home.vue";
import Engine from "../views/Engine.vue";

const routes: Array<RouteRecordRaw> = [{
  path: "/",
  name: "Home",
  component: Home,
} as RouteRecordRaw,
  {
    path: "/edit",
    name: "Edit",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/Edit.vue"),
  } as RouteRecordRaw, {
    path: "/engine",
    name: "Engine",
    component: Engine,
  } as RouteRecordRaw,
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
} as RouterOptions);

export default router;
