import { defineStore } from "pinia";
import { ref } from "vue";
import myAxios from "../../api/myAxios";
import { useMyErrorStore } from "../error/useMyErrorStore";

export const useAuthStore = defineStore('authStore', () => {
  // 1. State
  const isLoggedIn = ref(false);
  const accessToken = ref('');
  const userInfo = ref(null);

  // 2.Getters

  // 3.Actions
  const clearAuthStore = () => {
    isLoggedIn.value = false;
    accessToken.value = '';
    userInfo.value = null;
  }

  const login = async (loginForm) => {
    try {
      const url = '/api/login';

      const res = await myAxios.post(url, loginForm);
      console.log('로그인 응답:', res.data);
      const data = res.data.data;
      accessToken.value = data.accessToken;
      userInfo.value = data.user;
      isLoggedIn.value = true;
      console.log('로그인 상태:', isLoggedIn.value)
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.data.code === 'E01') {
          alert(error.response.data.data);
          return;
        }
      }
      useMyErrorStore().setErrorInfo(error);
    }
  }
  const reissue = async () => {
    try {
      const url = '/api/reissue-token';

      const res = await myAxios.post(url);
      const data = res.data.data;
      accessToken.value = data.accessToken;
      userInfo.value = data.user;
      isLoggedIn.value = true;

      return true;
    } catch (error) {

      console.log(error);
      clearAuthStore();
      // useMyErrorStore().setErrorInfo(error);    
    }
  }

  const logout = async () => {
    try {
      const url = 'api/logout';
      await myAxios.post(url);
    }
    catch (error) {
      console.error(error);

    }
    finally {
      clearAuthStore();
    }
  }
 


  return {
  // State
  isLoggedIn,
  accessToken,
  userInfo,

  //Getters

  //Actions
  login,
  reissue,
  logout
}

});
