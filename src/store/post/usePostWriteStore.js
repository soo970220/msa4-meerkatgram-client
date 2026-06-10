import { defineStore } from "pinia";
import myAxios from "../../api/myAxios";

export const usePostWriteStore = defineStore("post", () => {


  const uploadProfile = async (file) => {
    try {
      const url = "/api/files/posts";

      const data = new FormData();
      data.append("file", file);

      const config = {
        headers:{
          'Content-Type':'Multipart/form-data'
        }
      }
      const res = await myAxios.post(url, data, config);

      return res.data.data.fileUri;
    } catch (error) {
      console.error("uploadProfile error:", error);
      return null;
    }
  };

  const writePost = async (formData) => {
    try {
      const url = "/api/post/create";

      const res = await myAxios.post(url, formData);

      return res.data;
    } catch (error) {
      console.error("writePost error:", error);
      return null;
    }
  };

  return {
    uploadProfile,
    writePost,
  };
});
