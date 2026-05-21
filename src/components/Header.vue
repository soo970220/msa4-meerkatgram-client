<script setup>
import { ref } from 'vue';
import MyButton from './buttons/MyButton.vue';

// TODO 로그인 추가시 변경필요 START
const isLoggedIn = ref(true);
// TODO 로그인 추가시 변경필요 END
</script>

<template>
  <div class="header">
    <div class="title-box">
      <h1 class="title">meerkatgram</h1>
    </div>
    <div class="btn-box">
      <MyButton
       :content="'Sign In'"
       :color="'gray'"
       :size="'small'"
       />
       <MyButton
       :content="'Sign In'"
       :color="'white'"
       :size="'small'"
       />
       <MyButton
       v-if = "!isLoggedIn"
       :content="'Logout'"
       :color="'pink'"
       :size="'small'"
       />
    </div>
  </div>
</template>

<style scoped>
.header{
  padding: 10px;
  display: flex;
  justify-content: space-between;

}

.title-box {
  display: flex;
  align-items: center;
}

.title{
  font-size: 20px;
}

.btn-box{
  display: flex;
  gap: 10px;
}

</style>

