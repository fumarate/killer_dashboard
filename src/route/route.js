import { createWebHistory, createRouter } from "vue-router";
import HomePage from "../components/HomePage.vue";
import JobAdmin from "../components/JobAdmin.vue";
import UserAdmin from "../components/UserAdmin.vue";
import JobAdd from "../components/JobAdd.vue";
import UserAdd from "../components/UserAdd.vue";
import SettingsAdmin from "../components/SettingsAdmin.vue";

const routes = [
  {
    path: "/",
    name: "主页",
    component: HomePage,
    meta:{title:"主页"},
  },
  {
    path: "/job",
    name: "Job",
    component: JobAdmin,
    meta:{title:"任务"},
  },
  {
    path: "/user",
    name: "User",
    component: UserAdmin,
    meta:{title:"用户"},
  },
  {
    path: "/settings",
    name: "Settings",
    component: SettingsAdmin,
    meta:{title:"设置"},
  },
  {
    path: "/job/add",
    name: "JobAdd",
    component: JobAdd,
    meta:{title:"添加任务"},
  },
  {
    path: "/user/add",
    name: "userAdd",
    component: UserAdd,
    meta:{title:"添加用户"},
  },
];

const route = createRouter({
  history: createWebHistory(),
  routes,
});


route.beforeEach((to,from,next)=>{
  if(to.meta.title){
      document.title = to.meta.title
  }
  next()
})

export default route;
