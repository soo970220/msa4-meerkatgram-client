<script setup>
import { usePostWriteStore } from '../../store/post/usePostWriteStore';

const postStore = usePostWriteStore();


</script>

<template>
<div class="write">
  <div class="write-header">
    <input 
    v-model="postStore.post.title"
    placeholder="제목을 입력하세요">
  </div>
  <div class="write-body">
    <textarea v-model="postStore.post.content" placeholder="내용을 입력하세요"></textarea>
  </div>
</div>
<button @click="postStore.writePost">저장</button>
</template>

<style scoped>
.write{
  padding: 20px;
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 20px;
  width: auto;
  height: 100%;
}
  

.write-header{
  width: auto;
  height: 50px;
}
.write-body{
  width: auto;
  height: 300px;
}


</style>
