<script setup lang="ts">
  import ReqTab from './components/ReqTab.vue';
  import ResTab from './components/ResTab.vue';
</script>

<template>
  <div class="w-screen h-screen flex flex-row bg-[#1E1E2E]">
      <div class="w-1/2 h-1/2 flex flex-col justify-center align-center p-4 gap-4">
        <ReqTab />
      </div>
      <div class="w-1/2 h-1/2 flex flex-col justify-center align-center p-4 gap-4">
        <ResTab />
      </div>
  </div>
</template>

<style scoped></style>
