<script setup>
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { NavigationFailureType, useRoute, useRouter} from'vue-router' ;
import { usePostShowStore } from '../../store/post/usePostShowStore';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { useMyErrorStore } from '../../store/error/useMyErrorStore';

const route = useRoute();
const router = useRouter();
const postShowStore = usePostShowStore();
const authStore = useAuthStore();
const myErrorStore = useMyErrorStore();


onBeforeMount(async () => {
  try{
    await postShowStore.getPost(route.params.id);
  } catch(error){
   myErrorStore.setErrorInfo(error);
   router.replace('/error');
  }  
})
onBeforeUnmount(postShowStore.clearPostShow);
</script>

<template>
 <div class="container" v-if="postShowStore.post">
  <div class="image" :style="{backgroundImage:`url(${postShowStore.post?.image})`}"></div>
    <div class="option-box">
    <div class="delete-icon"v-if="postShowStore.post.userId === authStore.userInfo.id"
    ></div>
    <div v-else></div> 
    <!-- v-else로 자식을 만들어도되고  div로 delete-icon을 감싸줘도 된다  -->
    <div class="like-box">
      <span> 1004 </span>
      <div class="like-icon"></div>
    </div>
  </div>
  <p class="content">{{ postShowStore.post?.content }}</p>
  
  </div>
</template>

<style scoped>

.container {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.image{
padding-top:100%;
background-repeat: no-repeat;
background-position: center;
background-size: cover;

}

.option-box{
  display: flex;
  justify-content: space-between;
}

.like-box {
display: flex;
font-size: 20px;
gap: 30px;
}

.delete-icon {
width: 40px;
height: 50px;
background-image: url('/icon/trash-can.png');
background-repeat: no-repeat;
background-position: center;
background-size: cover;

}

.like-icon{
width: 55px;
height: 50px;
background-image: url('/icon/like_1 2.png');
background-repeat: no-repeat;
background-position: center;
background-size: cover;
}

.content{
  white-space: pre-wrap;
}

</style>
