import { defineStore } from "pinia";
import { computed, ref } from "vue";
import myAxios from "../../api/myAxios";
import { useMyErrorStore } from "../error/useMyErrorStore";

export const usePostIndexStore = defineStore('postIndex', () => {
  // 1.State (ref)
  const items = ref([]);
  const isLastPage = ref(false);
  const currentPage = ref(0);
  
  // 2. Getters (computed)1
  const getNextPageNumber = computed(() => currentPage.value + 1);

  // 3. Actions (function)
  const clearPostIndex = () => {
    items.value = [];
    isLastPage.value = false;
    currentPage.value = 0;
  }

  const getPostPagenation = async (page = 1 ) => {
    // 마지막 페이지가 아닐 경우만 실행

    if(!isLastPage.value) {
      try {
        const url = '/api/posts';
        const params = {
          page,
        };
        const res = await myAxios.get(url, {params});
        const data = res.data.data;
        isLastPage.value = data.lastPage;
        items.value.push(...data.posts);
  
        currentPage.value++;
        
      } catch(error) {
        console.error(error)
        
        throw error;
        // const myErrorStore = useMyErrorStore();
        // myErrorStore.setErrorInfo(error);
      }
    }
  }
    // if(!isLastPage.value) {
    //   try{
    //     const url = '/api/posts';
    //     const params = {
    //       page,
    //     };   
    //   const res = await myAxios.get(url, {params});
    //   const data = res.data.data;
    //   isLastPage.value = data.lastPage;
    //   items.value.push(...data.posts);

    //   currentPage.value++; 
    //     } catch(error) {
    //       throw error;  } 

  return {
    // state
    items,
    isLastPage,
    
    // getters
    getNextPageNumber,

    // actions

    clearPostIndex,
    getPostPagenation,
  }
});

