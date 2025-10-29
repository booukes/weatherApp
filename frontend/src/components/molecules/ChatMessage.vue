<template>
  <div :class="isUser ? 'flex justify-end' : 'flex justify-start'">
    <div
      :class="[
        'p-3 rounded-xl max-w-lg shadow-md',
        isUser ? 'bg-blue-600 text-white' : 'bg-white/10'
      ]"
    >
      <p class="text-base whitespace-pre-wrap">{{ content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  content: string
  isUser: boolean
}>()
</script>
