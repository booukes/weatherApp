<template>
  <div class="sky-spinner"></div>
</template>

<script lang="ts">
export default {
  name: 'SkySpinner'
}
</script>

<style scoped>
.sky-spinner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 5px solid rgba(200, 200, 210, 0.4);
  border-top-color: #ffffff;
  box-shadow: 0 0 15px #36363633;
  animation: spin .8s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
