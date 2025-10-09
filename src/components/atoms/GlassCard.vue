<script setup lang="ts">

const props = defineProps<{
  radius?: string
  delay?: number
}>()

const cardRadius = props.radius || 'rounded-lg'

</script>

<template>
  <div v-motion
       :initial="{
    y: 100,
    opacity: 0,
  }"
       :enter="{
    y: 0,
    opacity: 1,
    transition: {
      delay: props.delay || 0,
      type: 'spring',
      stiffness: 250,
      damping: 25,
      mass: 0.5,
    },
  }" :class="`${cardRadius} bg-[#1e1e1e40] border-white/10 border-[1px] shadow-xl text-zinc-300 p-4`">
    <slot></slot>
  </div>
</template>

<style scoped>

div {
  transition: box-shadow 0.2s ease-out;
}

div:hover {
  box-shadow: 2.5px 2.5px #F042F010;
}
</style>
