<template>
  <img
    :src="icon"
    :alt="`${condition} weather icon`"
    :class="['weather-icon', sizeClass]"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { WeatherCondition } from '@/stores/weatherStore'
import sunnyIcon from '@/components/icons/weather/sunny.svg'
import cloudyIcon from '@/components/icons/weather/cloudy.svg'
import partlyCloudyIcon from '@/components/icons/weather/partlycloudy.svg'
import snowIcon from '@/components/icons/weather/snow.svg'
import thunderstormIcon from '@/components/icons/weather/thunder.svg'
import rainIcon from '@/components/icons/weather/rain.svg'

const props = defineProps<{
  condition: WeatherCondition
  size?: 'small' | 'medium' | 'large'
}>()

const weatherIcons = {
  [WeatherCondition.Sunny]: sunnyIcon,
  [WeatherCondition.Cloudy]: cloudyIcon,
  [WeatherCondition.PartlyCloudy]: partlyCloudyIcon,
  [WeatherCondition.Snow]: snowIcon,
  [WeatherCondition.Thunderstorm]: thunderstormIcon,
  [WeatherCondition.Rain]: rainIcon,
}

const icon = computed(() => weatherIcons[props.condition])

const sizeClass = computed(() => {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16 scale-200 md:scale-300'
  }
  return sizes[props.size || 'medium']
})
</script>

<style scoped>
</style>
