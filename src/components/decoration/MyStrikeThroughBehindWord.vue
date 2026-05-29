<script setup>
const props = defineProps({
  'content':String,
});
</script>

<template>
<span>{{ props.content }}</span>
</template>

<style scoped>
span {
  min-width: 320px;
  display: flex;
  align-items: center;
  color: var(--personal-color-pink);
  font-size: 30px;
}
span::before, span::after{
  content: "";
  flex: 1;
  height: 1px;
  background-color: var(--personal-color-gray);
}

</style>
