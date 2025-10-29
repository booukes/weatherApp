<template>
  <div>
    <p class="text-sm text-zinc-400 mb-1">{{ label }}</p>
    <p class="font-bold text-xl flex items-center justify-center gap-2">
      <span>{{ value }}{{ unit }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: number | string
  unit?: string
}>()
</script>
