<script setup>
import { reactive } from 'vue';
import MyButton from '../../components/buttons/MyButton.vue';
import MyInput from '../../components/input/MyInput.vue';
import MyStrikeThroughBehindWord from '../../components/decoration/MyStrikeThroughBehindWord.vue';
import { useAuthStore } from '../../store/auth/useAuthStore.js';
import { useRouter } from 'vue-router';
import loginValidator from '../../api/util/validator/domain/auth/loginValidator.js';
import { email } from '../../api/util/validator/rule/userRule.js';
import { useMyErrorStore } from '../../store/error/useMyErrorStore.js';

const router = useRouter();
const authStore = useAuthStore();
const myErrorStore = useMyErrorStore();
const loginForm = reactive({
  email:'',
  password:'',
});

const handleSubmit = async ()=>{
  // 유효성 검사
  const resultValidationEmail = loginValidator.email(loginForm.email);
  const resultValidationPassword = loginValidator.password(loginForm.password);
  
  if(!resultValidationEmail && !resultValidationPassword){
    // 유효성 검사 통과 패턴
  try {
    await authStore.login(loginForm);
    router.replace('/posts');
    
  } catch (error) {
    if (error.response) {
      if (error.response.data.code === 'E01') {
      alert(error.response.data.data);
      }
    }
    myErrorStore.setErrorInfo(error);
    router.replace('/error');
  }
  } else {
    // 유효성 검사 실패 패턴
    alert(`${resultValidationEmail}\n${resultValidationPassword}`);
  }

}
</script>

<template>
<form @submit.prevent="handleSubmit">
  <MyInput
  :type="'email'"
  :placeholder="'Email'"
  :readonly="false"
  :required="true"
  v-model="loginForm.email">
</MyInput>

<MyInput
  :type="'password'"
  :placeholder="'Password'"
  :readonly="false"
  :required="true"
  v-model="loginForm.password">
</MyInput>

<MyButton
:btn-type="'submit'"
:color="'gray'"
:size="'middle'"
:content="'Log In'"
></MyButton>

<MyStrikeThroughBehindWord
  :content="'or'">
</MyStrikeThroughBehindWord>

<MyButton
:btn-type="'button'"
:color="'white'"
:size="'middle'"
:content="'Sign Up'"
></MyButton>


</form>
</template>

<style scoped>
form{
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
</style>
