<script setup lang="ts">
const props = defineProps<{
  radius?: string
  delay?: number
}>()

const cardRadius = props.radius || 'rounded-lg'
</script>

<template>
  <div
    v-motion
    :initial="{ y: 100, opacity: 0 }"
    :enter="{
      y: 0,
      opacity: 1,
      transition: {
        delay: props.delay || 0,
        type: 'spring',
        stiffness: 550,
        damping: 20,
        mass: 2.5
      }
    }"
    class="card"
    :class="`${cardRadius} bg-[#1e1e1e30] mb-6 md:mb-6 border-white/30 border-[1px] text-zinc-300 p-4`"
  >
    <slot></slot>
  </div>
</template>

<style>
.card {
  backdrop-filter: blur(5px);
  transition: backdrop-filter 0.3s ease;
}

.card:hover {
  backdrop-filter: blur(20px);
}
</style>
