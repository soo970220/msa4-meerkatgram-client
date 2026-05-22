
import { createRouter, createWebHistory } from "vue-router";
import MyError from "../page/error/MyError.vue";
import PostIndex from "../page/posts/PostIndex.vue";

const routes = [
  {
    path: '/',
    redirect: '/posts'
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

