<script setup>
import { useRouter } from 'vue-router';
import MyButton from '../../components/buttons/MyButton.vue';
import { useMyErrorStore } from '../../store/error/useMyErrorStore.js';

const router = useRouter();
const myErrorStore = useMyErrorStore();

const redirectMain = () => {
  myErrorStore.clearErrorInfo();
  // URL을 히스토리 스텍에 추가하지 않고 이동
  router.replace('/');

  }
</script>

<template>
<h1> 에러 발생 </h1>
<h2> 에러 코드 : {{ myErrorStore.errorCode }} </h2>
<h2>  {{ myErrorStore.errorMsg }}</h2>
<h2> 아래 버튼을 누르시면 메인 페이지로 이동합니다.</h2>

<MyButton
  :size="'middle'"
  :color="'gray'"
  :content="'Go to Main'"
  @click="redirectMain()"
  ></MyButton>

</template>

<style scoped>

</style>
