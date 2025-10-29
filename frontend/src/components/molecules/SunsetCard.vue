<template>
  <GlassCard :delay="400">
    <div class="flex flex-col items-center justify-center h-full text-center">
      <h3 class="font-bold text-zinc-100 mb-2">Sunset</h3>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-16 h-16 text-zinc-700"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
      </svg>
      <p class="text-4xl text-zinc-100 font-bold mt-2">{{ time }}</p>
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import GlassCard from '@/components/atoms/GlassCard.vue'

defineProps<{
  time: string
}>()
</script>
