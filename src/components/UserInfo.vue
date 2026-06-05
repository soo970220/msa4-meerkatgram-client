<script setup>
import { useAuthStore } from '../store/auth/useAuthStore';

const authStore = useAuthStore();
</script>



<template>
<div
  class="container"
    v-if ="authStore.isLoggedIn && authStore.userInfo"
>
<div class="profile-box" >
  <div class="bg-image-circle profile"
   :style="{backgroundImage:`url(${authStore.userInfo.profile})`}">
  </div>
</div>
<div class="info-box">
  <div class="nick">{{ authStore.userInfo.nick }}</div>

  <div class="write-count"> POST {{authStore.userInfo.countPosts}} </div>

  <div class="redirect-box">
    <div class="bg-image-square redirect-icon-posts-index"
        style="background-image: url(/public/icon/free-icon-gallery-833281.png);"
    ></div>

    <div class="bg-image-square redirect-icon-posts-create"
      style="background-image: url(/public/icon/plus-sign.png);"
    ></div>

    <div class="bg-image-square redirect-icon-users-info"
    style="background-image: url(/public/icon/free-icon-person-2815428tt.png);"
    ></div>
    
  </div>
  </div>
</div>
<hr>
</template>

<style scoped>
.container{
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.info-box{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.redirect-box{
padding-top: 10px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
gap: 5px;
}
.nick {
padding-left: 50px;
font-size: 30px;
font-weight: 900;

}

.write-count{ 
  padding-left: 50px;
  font-size: 30px;

}


</style>
