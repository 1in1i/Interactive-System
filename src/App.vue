<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>
<style>
html, body{
  height: 100%;
  margin: 0;
  padding: 0;
  background: linear-gradient(to bottom, #fdfbfb, #ebedee);

}
#app{
  height: 100% ;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* overflow: auto; */
  position: relative;
  background: linear-gradient(to bottom, #fdfbfb, #ebedee);

}
</style>
