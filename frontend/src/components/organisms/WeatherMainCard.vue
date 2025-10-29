<template>
  <GlassCard class="col-span-2 row-span-2 p-8" :delay="50">
    <div class="flex flex-col h-full">
      <div class="flex justify-between items-start mb-8">
        <Transition name="slide-fade" mode="out-in">
          <WeatherLocation
            v-if="!showSearch"
            key="display"
            :location="formattedLocation"
            :description="weatherDescription"
            @toggle-search="emit('toggle-search')"
          />
          <CitySearchInput
            v-else
            key="search"
            v-model="localCitySearch"
            :is-searching="isSearching"
            :error="searchError"
            @search="handleSearch"
            @use-location="emit('use-location')"
            @close="emit('toggle-search')"
          />
        </Transition>
      </div>
      <div class="flex-1 flex items-center justify-center -mt-8 mb-8">
        <WeatherDisplay
          :condition="weatherData.description"
          :temperature="weatherData.temperature"
        />
      </div>
      <div >
        <WeatherStats :weather-data="weatherData" />
      </div>
      <div>
        <AiWeatherButton
          :is-thinking="aiState.isThinking"
          :rate-limit-cooldown="aiState.rateLimitCooldown"
          @click="emit('get-advice')"
        />
      </div>
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import GlassCard from '@/components/atoms/GlassCard.vue'
import WeatherLocation from '@/components/molecules/WeatherLocation.vue'
import CitySearchInput from '@/components/molecules/CitySearchInput.vue'
import WeatherDisplay from '@/components/molecules/WeatherDisplay.vue'
import WeatherStats from '@/components/molecules/WeatherStats.vue'
import AiWeatherButton from '@/components/molecules/AIWeatherButton.vue'

interface WeatherData {
  location: string
  temperature: number
  feels_like: number
  humidity: number
  description: string
  wind_speed: number
  cloud_cover: number
}

const props = defineProps<{
  weatherData: WeatherData
  showSearch: boolean
  citySearch: string
  isSearching: boolean
  searchError: string
  aiState: {
    isThinking: boolean
    rateLimitCooldown: boolean
  }
}>()

const emit = defineEmits<{
  'toggle-search': []
  'search-city': [city: string]
  'use-location': []
  'get-advice': []
  'update:citySearch': [value: string]
}>()

const localCitySearch = ref(props.citySearch)

watch(() => props.citySearch, (val) => {
  localCitySearch.value = val
})

watch(localCitySearch, (val) => {
  emit('update:citySearch', val)
})

const formattedLocation = computed(() => {
  return props.weatherData.location
    .split(',')
    .map(p => p.trim())
    .filter((part, i, arr) => i !== 1 || part !== arr[0])
    .join(', ')
})

const weatherDescription = computed(() => props.weatherData.description)

const handleSearch = (city: string) => {
  emit('search-city', city)
}
</script>
