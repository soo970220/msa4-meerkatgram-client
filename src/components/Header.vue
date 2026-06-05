<script setup>
import { ref } from 'vue';
import MyButton from './buttons/MyButton.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth/useAuthStore.js';


const router = useRouter();
const authStore = useAuthStore();

const redirectMain = () => {
  router.push('/')
}

const redirectLogin = () => {
  router.push('/login')
}

const redirectRegistration = () => {
  router.push('/registration')
}

const logout = async () => {
  await authStore.logout();
  router.replace('/');
  
}

</script>

<template>
  <div class="header">
    <div class="title-box">
      <h1 class="title" @click="redirectMain()"> Meerkatgram</h1>
    </div>

    <div class="btn-box">
      <MyButton
       @click="redirectLogin()"    
        v-if="!authStore.isLoggedIn"
       :content="'Sign In'"
       :color="'gray'"
       :size="'small'"
       />
      <MyButton
       v-if="!authStore.isLoggedIn"
       :content="'Sign Up'"
       :color="'yellow'"
       :size="'small'"
       @click="redirectRegistration" />


        <MyButton
       v-if ="authStore.isLoggedIn"
       :content="'Logout'"
       :color="'pink'"
       :size="'small'"
       @click="logout"/>
       
    </div>
  </div>
  <hr>
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

