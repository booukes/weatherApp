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
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

body {
  background-color: #0d1117;
  color: #e2e8f0;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;

  background-image:
    radial-gradient(at 15% 90%, hsla(320, 75%, 60%, 0.25) 0px, transparent 50%),
    radial-gradient(at 20% 25%, hsla(260, 80%, 55%, 0.25) 0px, transparent 50%),
    radial-gradient(at 78% 30%, hsla(300, 85%, 60%, 0.2) 0px, transparent 50%),
    radial-gradient(at 50% 80%, hsla(240, 70%, 65%, 0.2) 0px, transparent 50%),
    radial-gradient(at 80% 95%, hsla(280, 80%, 55%, 0.2) 0px, transparent 50%);
  background-size: 250% 250%;

  animation: moveGradient 20s ease-out infinite;
}
</style>
