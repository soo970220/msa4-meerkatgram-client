import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePostWriteStore = defineStore('postWrite', ()=>{
  const post = ref({title:'',content:''});

  const writePost = async () => {
    try{
      const response = await axios.post('/api/posts',{
        title: post.value.title,
        content:post.value.content
      });
      alert('업로드 완료');
    }catch(error){
      alert('저장실패');
    }
  
};

return{post,writePost};
});
