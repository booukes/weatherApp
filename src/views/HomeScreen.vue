<script setup lang="ts">
import GlassCard from '@/components/atoms/GlassCard.vue'

// Let's make this data-driven. It's way cleaner.
const cards = [
  {
    content: 'This is the main weather card for the favourite city',
    class: 'col-span-2 row-span-2'
  },
  {
    content: 'This is the rain predictions chart for the favourite city',
    class: 'md:col-span-2'
  },
  {
    content: 'This is the sunrise time card for the favourite city',
    class: ''
  },
  {
    content: 'This is the sunset time card for the favourite city',
    class: ''
  }
]
</script>

<template>
  <main class="m-4 flex flex-col md:grid md:grid-cols-4 gap-8 auto-rows-[16rem] justify-center">
    <GlassCard
      v-for="(card, index) in cards"
      :key="card.content"
      :class="card.class"
      radius="rounded-md"
      :delay="(index + 1) * 150"
    > {{ card.content }}
    </GlassCard>
  </main>
</template>

<style scoped>
</style>
