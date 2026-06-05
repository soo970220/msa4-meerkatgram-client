<script setup>
import Header from './components/Header.vue';
import UserInfo from './components/UserInfo.vue';
import PostIndex from './page/posts/PostIndex.vue';



</script>

<template>
  <Header />
  <userInfo/>
  <router-view></router-view>
</template>
