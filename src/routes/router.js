
import { createRouter, createWebHistory } from "vue-router";
import MyError from "../page/error/MyError.vue";
import PostIndex from "../page/posts/PostIndex.vue";
import Login from "../page/auth/Login.vue";
import { useAuthStore } from "../store/auth/useAuthStore.js";
import PostShow from "../page/posts/PostShow.vue";
import Registration from "../page/auth/Registration.vue";
import PostWrite from "../page/posts/PostWrite.vue";

const setMeta = (isAuthenticated, isGuestOnly) => {
  return{
    isAuthenticated,
    isGuestOnly,
  }
}

const routes = [
  {
    path: '/',
    redirect: '/posts',
    meta: setMeta(false,false),
  },
  
  //인증관련
  {
    path: '/login',
    component: Login,
    meta: setMeta(false,true),
  },

  {
    path:'/registration',
    component:Registration,
    meta:setMeta(false,true)
  },

  //게시글 관련
  {
    path: '/posts',
    component: PostIndex,
    meta: setMeta(false,false),
  },


  {
    path:'/posts/:id',
    component:PostShow,
    meta: setMeta(true,false),

  },

  {
    path:'/posts/write',
    component:PostWrite,
    meta: setMeta(true,false), 
  },

  //에러 관련
  {
    path: '/error',
    component: MyError,
    meta: setMeta(false,false),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes, 
});

// 네비게이션 가드
router.beforeEach(async (to, form,next)=>{
 // authStore
  const authStore = useAuthStore();
  // accessToken 엑세스토큰(인증)이 없을 때, 토큰 재발급 시도
  if(!authStore.isLoggedIn) {
    try{
      await authStore.reissue();
    } catch (error){
      // alert('로그인 기간이 만료되었습니다.\n다시 로그인 해 주십시오.');
      // return next('/login');
    }
  } 
  // 인증이 필요한 페이지인데 로그인이 안된 경우 로그인페이지로 이동
  if(to.meta.isAuthenticated && !authStore.isLoggedIn) {
    return next('/login');
  }

  // 게스트만 접근 가능한 페이지인데, 로그인 중인 경우 메인페이지로 이동
  if(to.meta.isGuestOnly && authStore.isLoggedIn){
    return next('/');
  }

  // 나머지는 통과 
  next();
});

export default router;

