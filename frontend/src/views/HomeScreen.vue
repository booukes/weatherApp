<template>
  <AppHeader />
  <main class="mx-4 md:grid md:grid-cols-4 gap-8 auto-rows-[16rem] justify-center">
    <WeatherMainCard
      v-if="weatherData"
      :weather-data="weatherData"
      :show-search="showSearchInput"
      v-model:city-search="citySearch"
      :is-searching="isSearching"
      :search-error="searchError"
      :ai-state="aiAssistant.state"
      @toggle-search="toggleSearchInput"
      @search-city="searchCity"
      @use-location="useCurrentLocation"
      @get-advice="() => aiAssistant.getWeatherAdvice(weatherData)"
    />

    <PrecipitationChart
      v-if="weatherData"
      :rain-probability="weatherData.rain_probability"
    />

    <SunriseCard v-if="weatherData" :time="weatherData.sunrise" />
    <SunsetCard v-if="weatherData" :time="weatherData.sunset" />

    <AIAssistantModal
      :show="aiAssistant.state.showAssistant"
      :chat-history="aiAssistant.state.chatHistory"
      :is-thinking="aiAssistant.state.isThinking"
      :error="aiAssistant.state.error"
      v-model:user-message="aiAssistant.state.userMessage"
      @close="aiAssistant.closeAssistant"
      @send-message="aiAssistant.sendFollowUpMessage"
    />

    <AppFooter
      v-if="weatherData"
      :can-go-previous="canGoPrevious"
      :can-go-next="canGoNext"
      :current-date-time="currentDateTime"
      @to-start="navigateToStart"
      @previous-hour="navigatePreviousHour"
      @next-hour="navigateNextHour"
      @to-end="navigateToEnd"
      class="md:fixed flex flex-row items-center justify-center"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getGeolocation, getCityCoordinates } from '@/api'
import { hasVisitedHome } from '@/router/index.ts'
import { current_weather_condition } from '@/stores/weatherStore'
import AppHeader from '@/components/organisms/AppHeader.vue'
import AppFooter from '@/components/organisms/AppFooter.vue'
import WeatherMainCard from '@/components/organisms/WeatherMainCard.vue'
import PrecipitationChart from '@/components/organisms/PrecipitationChart.vue'
import SunriseCard from '@/components/molecules/SunriseCard.vue'
import SunsetCard from '@/components/molecules/SunsetCard.vue'
import AIAssistantModal from '@/components/organisms/AIAssistantModal.vue'
import { useWeatherData } from '@/components/composables/useWeatherData'
import { useAIAssistant } from '@/components/composables/useAIAssistant'

const {
  weatherData,
  currentDateTime,
  canGoPrevious,
  canGoNext,
  loadWeatherData,
  navigatePreviousHour,
  navigateNextHour,
  navigateToStart,
  navigateToEnd,
} = useWeatherData()

const aiAssistant = useAIAssistant()

const userCoords = ref({ lat: 52.22, lon: 21.01 })
const citySearch = ref('')
const isSearching = ref(false)
const searchError = ref('')
const showSearchInput = ref(false)

const searchCity = async (city: string) => {
  if (!city.trim()) return

  isSearching.value = true
  searchError.value = ''

  try {
    const cityData = await getCityCoordinates(city)
    userCoords.value = { lat: cityData.lat, lon: cityData.lon }
    await loadWeatherData(cityData.lat, cityData.lon, cityData.location)
    showSearchInput.value = false
    citySearch.value = ''
  } catch (error) {
    searchError.value = 'City not found. Please try again.'
    console.log(error)
  } finally {
    isSearching.value = false
  }
}

const toggleSearchInput = () => {
  showSearchInput.value = !showSearchInput.value
  searchError.value = ''
  if (!showSearchInput.value) {
    citySearch.value = ''
  }
}

const useCurrentLocation = async () => {
  isSearching.value = true
  searchError.value = ''

  try {
    const coords = await getGeolocation()
    userCoords.value = { lat: coords.lat, lon: coords.lon }
    await loadWeatherData(coords.lat, coords.lon)
    showSearchInput.value = false
  } catch (err) {
    console.warn('Geo error:', err)
    searchError.value = 'Could not get your location'
  } finally {
    isSearching.value = false
  }
}

onMounted(async () => {
  aiAssistant.loadPuterScript().catch(err => console.warn('Puter loading error:', err))

  const coords = await getGeolocation()
    .then(({ lat, lon }) => ({ ulat: lat, ulon: lon }))
    .catch((err) => {
      console.warn('Geo error:', err)
      return { ulat: 52.22, ulon: 21.01 }
    })

  userCoords.value = { lat: coords.ulat, lon: coords.ulon }
  await loadWeatherData(coords.ulat, coords.ulon)
  hasVisitedHome.value = true
})

watch(weatherData, (newData) => {
  if (newData) {
    current_weather_condition.value = newData.description
  }
})
</script>
