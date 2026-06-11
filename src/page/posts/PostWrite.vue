<script setup>
import { reactive, ref } from 'vue';
import { usePostWriteStore } from '../../store/post/usePostWriteStore';
import { useFileStore } from '../../store/file/useFileStore';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { useRouter } from 'vue-router';
const postdata = reactive({
  content:'',
  image:''
})
const postPreview = ref('');
const fileStore = useFileStore();
const postWriteStore = usePostWriteStore();
const authStore = useAuthStore();
const router = useRouter();

const handleChangePostImage = async (e) => {
  const file = e.target.files[0];
  
  if(!file) {
    return;
  }
    const fileUri = await fileStore.uploadProfile(file);
    if(!fileUri){return;}
    
    postdata.image = fileUri;
    postPreview =  URL.createObjectURL(file);
    } 

const submit = async ()=>{
  try {
    await  postWriteStore.writePost(postdata);
  } catch (error) {
    console.error(error);
  }
}
  


</script>

<template>
  <div class="write-container">
    <div class="image-section">
      <input type="file" @change="handleChangePostImage" />
      <div class="preview-box" v-if="postPreview">
        <div class="preview" v-if="postPreview" :style="{ backgroundImage: `url(${postPreview})` }"></div>
        
      </div>
    </div>

    <div class="content-section">
      <textarea v-model="content" class="content-textarea" placeholder="내용을 입력하세요"></textarea>
    </div>

    <button class="save-btn" @click="submit">저장</button>
  </div>
</template>

<style scoped>
.write-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.image-section,
.content-section {
  width: 100%;
}

.preview-box {
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column-reverse;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 10px;
}


.content-textarea {
  width: 100%;
  height: 200px;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none;
}

.save-btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
