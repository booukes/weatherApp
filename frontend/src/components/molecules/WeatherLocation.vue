<template>
  <div class="flex-1 min-w-0 pr-2">
    <h2 class="text-2xl sm:text-3xl font-bold break-words">
      {{ location }}
    </h2>
    <p class="text-base sm:text-lg text-zinc-400">{{ description }}</p>
  </div>
  <button
    @click="emit('toggle-search')"
    class="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
    title="Search for a city"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5 sm:w-6 sm:h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  location: string
  description: string
}>()

const emit = defineEmits<{
  'toggle-search': []
}>()
</script>
