<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppHeader from './components/organisms/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <RouterView />
</template>

<style>
@keyframes moveGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

body {
  background-color: #000000;
  color: #e2e8f0;
  background-image:
    radial-gradient(at 20% 25%, hsla(260, 80%, 35%, 0.4) 0px, transparent 55%),
    radial-gradient(at 78% 30%, hsla(300, 85%, 45%, 0.3) 0px, transparent 55%),
    radial-gradient(at 50% 80%, hsla(240, 70%, 50%, 0.3) 0px, transparent 55%),
    radial-gradient(at 15% 90%, hsla(280, 80%, 40%, 0.3) 0px, transparent 55%),
    radial-gradient(at 85% 95%, hsla(320, 75%, 45%, 0.4) 0px, transparent 55%);
  background-size: 200% 200%;
  animation: moveGradient 20s ease infinite;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}
</style>
