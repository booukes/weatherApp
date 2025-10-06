<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  radius?: string
  delay?: number
}>()

const cardRadius = props.radius || 'rounded-lg'

const animationDelay = computed(() => `${props.delay || 0}ms`)
</script>

<template>
  <div :class="`${cardRadius} bg-[#1e1e1e40] border-white/10 border-[1px] shadow-xl text-zinc-300 p-4`">
    <slot></slot>
  </div>
</template>

<style scoped>
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

div {
  opacity: 0;
  animation: slideUp 0.4s ease-out forwards;
  animation-delay: v-bind(animationDelay);
  transition: box-shadow 0.2s ease-out;
}

div:hover {
  box-shadow: 2.5px 2.5px #F042F010;
}
</style>
