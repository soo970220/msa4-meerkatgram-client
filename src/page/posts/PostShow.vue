<script setup>
import { onBeforeMount } from 'vue';
import { NavigationFailureType, useRoute, useRouter} from'vue-router' ;
import { usePostShowStore } from '../../store/post/usePostShowStore';

const route = useRoute();
const router = useRouter();
const postShowStore = usePostShowStore();

onBeforeMount(async () => {
  try{
    await postShowStore.getPost(route.params.id);
  } catch(error){
   const msg = error?.response?.data.data ? error?.response?.data.data :"포스트획득실패";
   alert(msg);
   router.replace('/');
  }  
})


</script>

<template>
 <div class="container">
  <div class="image" :style="{backgroundImage:`url(${postShowStore.post?.image})`}"></div>
    <div class="option-box">
    <div class="delete-icon"></div>
    <div class="like-box">
      <span>1919</span>
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
