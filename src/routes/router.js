
import { createRouter, createWebHistory } from "vue-router";
import MyError from "../page/error/MyError.vue";
import PostIndex from "../page/posts/PostIndex.vue";
import Login from "../page/auth/Login.vue";

const routes = [
  {
    path: '/',
    redirect: '/posts'
  },
  //인증관련
  {
    path: '/login',
    component: Login,
  },
  //게시글 관련
  {
    path: '/posts',
    component: PostIndex,
  },
  // //에러 관련
  // {
  //   path: '/errors',
  //   component: MyError,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

