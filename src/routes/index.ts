import type { App } from "vue";
import {
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory,
} from "vue-router";

import { PAGE_ENUMS } from "./enums";

const routes: RouteRecordRaw[] = [
  {
    path: PAGE_ENUMS.ROOT_PATH,
    redirect: PAGE_ENUMS.HOME_PATH,
  },
  {
    name: PAGE_ENUMS.HOME,
    path: PAGE_ENUMS.HOME_PATH,
    component: () => import("@/views/home/index.vue"),
  },
  {
    name: PAGE_ENUMS.DEMO,
    path: PAGE_ENUMS.DEMO_PATH,
    component: () => import("@/views/demo/index.vue"),
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export function setupRouter(app: App) {
  app.use(router);
}
