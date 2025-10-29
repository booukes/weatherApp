<template>
  <div class="flex items-start gap-3">
    <span class="text-2xl">⚠️</span>
    <div class="flex-1">
      <p class="text-red-300 font-semibold mb-1">Error</p>
      <p class="text-red-200">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>
