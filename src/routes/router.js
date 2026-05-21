
import PostIndex from "../page/posts/PostIndex.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    component: PostIndex,
  },
  {
    path: '/posts',
    component: PostIndex,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

