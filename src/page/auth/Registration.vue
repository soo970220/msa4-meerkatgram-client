<script setup>
import MyButton from '../../components/buttons/MyButton.vue';
import MyInput from '../../components/input/MyInput.vue';



const handleSubmit = async( )=>{}
</script>

<template>
<form @submit.prevent="handleSubmit">
  <MyInput
  :type="'email'"
  :placeholder="'Email'"
  :readonly="false"
  :required="true">
  
</MyInput>

<MyInput
  :type="'password'"
  :placeholder="'Password'"
  :readonly="false"
  :required="true">
 </MyInput>

<MyInput
  :type="'password'"
  :placeholder="'PasswordChk'"
  :readonly="false"
  :required="true">
 </MyInput>

<MyInput
  :type="'nick'"
  :placeholder="'Nick'"
  :readonly="false"
  :required="true">
 </MyInput>
 <input type="file" accept="image/*">

<MyButton 
:btn-type="'submit'"
:color="'pink'"
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
