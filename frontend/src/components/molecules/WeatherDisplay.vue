<template>
  <div class="flex items-center justify-center">
    <div class="text-8xl">
      <WeatherIcon :condition="condition" class="mr-12" size="large" />
    </div>
    <div class="flex items-baseline">
      <p class="text-8xl font-bold tracking-tighter">{{ temperature }}</p>
      <span class="text-4xl font-light text-zinc-300/70 ml-1">°C</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import WeatherIcon from '@/components/atoms/WeatherIcon.vue'
import { WeatherCondition } from '@/stores/weatherStore'

defineProps<{
  condition: WeatherCondition
  temperature: number
}>()
</script>
