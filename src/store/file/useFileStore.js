import { defineStore } from "pinia";
import myAxios from "../../api/myAxios";

export const useFileStore = defineStore('fileStore',() => {
  //State

  //Getter

  //Actions

  const uploadProfile = async (file) => {
    try {
      const url ='/api/files/profiles';

      // Form Data 생성
      const data = new FormData();
      data.append('file', file);

       //myAxios의 Content-Type 변경 
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      const res = await myAxios.post(url, data, config);
      return res.data.data.fileUri;

    } catch (error) {
      console.error(error);
      return null;

    }

  }
  const uploadPostImage = async (image) => {
    try {
      const url ='/api/post/create';

      const data = new FormData();
      data.append('file', image);
     
      const res = await myAxios.post(url, data);
      return res.data;

    } catch (error) {
      console.error(error);
      return null;
    }
  }
   return {
   uploadProfile,
   uploadPostImage

  }
});


