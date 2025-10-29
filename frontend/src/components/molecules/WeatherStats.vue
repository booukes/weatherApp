<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center min-h-20">
    <WeatherStatCard label="Feels like" :value="weatherData.feels_like" unit="°C" />
    <WeatherStatCard label="Wind" :value="weatherData.wind_speed" unit=" km/h" />
    <WeatherStatCard label="Humidity" :value="weatherData.humidity" unit="%" />
    <WeatherStatCard label="Cloud cover" :value="weatherData.cloud_cover" unit="%" />
  </div>
</template>

<script setup lang="ts">
import WeatherStatCard from '@/components/molecules/WeatherStatCard.vue'

defineProps<{
  weatherData: {
    feels_like: number
    wind_speed: number
    humidity: number
    cloud_cover: number
  }
}>()
</script>
