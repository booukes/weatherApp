<template>
  <button
    @click="emit('click')"
    :disabled="isThinking || rateLimitCooldown"
    :class="[
      'w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl',
      rateLimitCooldown
        ? 'bg-zinc-700 cursor-not-allowed'
        : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-zinc-600 disabled:to-zinc-600 disabled:cursor-not-allowed'
    ]"
  >
    <span v-if="rateLimitCooldown">⏱️ Please wait...</span>
    <span v-else-if="!isThinking">🤖 Get AI Weather Advice</span>
    <span v-else class="flex items-center gap-2">
      <span class="inline-block animate-spin">⚙️</span>
      Thinking...
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  isThinking: boolean
  rateLimitCooldown: boolean
}>()

const emit = defineEmits<{
  'click': []
}>()
</script>
