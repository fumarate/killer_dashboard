import { createWebHistory, createRouter } from "vue-router";
import JobAdmin from "../components/JobAdmin.vue";
import UserAdmin from "../components/UserAdmin.vue";
import JobAdd from "../components/JobAdd.vue";
import UserAdd from "../components/UserAdd.vue";
import SettingsAdmin from "../components/SettingsAdmin.vue";

const routes = [
  {
    path: "/job",
    name: "Job",
    component: JobAdmin,
  },
  {
    path: "/user",
    name: "User",
    component: UserAdmin,
  },
  {
    path: "/settings",
    name: "Settings",
    component: SettingsAdmin,
  },
  {
    path: "/job/add",
    name: "JobAdd",
    component: JobAdd,
  },
  {
    path: "/user/add",
    name: "userAdd",
    component: UserAdd,
  },
];

const route = createRouter({
  history: createWebHistory(),
  routes,
});

export default route;
