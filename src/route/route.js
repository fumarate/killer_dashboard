import { createWebHistory, createRouter } from "vue-router";
import HomePage from "../components/HomePage.vue";
import JobAdd from "../components/JobAdd.vue";
import SettingsAdmin from "../components/SettingsAdmin.vue";

const routes = [
  {
    path: "/",
    name: "主页",
    component: HomePage,
    meta: { title: "主页" },
  },

  {
    path: "/settings",
    name: "Settings",
    component: SettingsAdmin,
    meta: { title: "设置" },
  },
  {
    path: "/job",
    name: "Job",
    component: JobAdd,
    meta: { title: "添加任务" },
  },
];

const route = createRouter({
  history: createWebHistory(),
  routes,
});

route.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default route;
