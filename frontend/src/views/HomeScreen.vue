<!-- Modified original component (e.g., Home.vue) -->

<script setup lang="ts">
//external
import { ref, onMounted, watch, computed } from 'vue'
import { Chart, type ChartConfiguration, type ChartItem, registerables } from 'chart.js'

//components & assets
import GlassCard from '@/components/atoms/GlassCard.vue'
import AppFooter  from '@/components/organisms/AppFooter.vue' // Add this import
import sunnyIcon from '@/components/icons/weather/sunny.svg'
import cloudyIcon from '@/components/icons/weather/cloudy.svg'
import partlyCloudyIcon from '@/components/icons/weather/partlycloudy.svg'
import snowIcon from '@/components/icons/weather/snow.svg'
import thunderstormIcon from '@/components/icons/weather/thunder.svg'
import rainIcon from '@/components/icons/weather/rain.svg'

//store
import { WeatherCondition, current_weather_condition, weatherCodeMap } from '@/stores/weatherStore'

//api & router
import { getGeolocation, getWeather, forecast_types, getCityCoordinates, getLocationName } from '@/api'
import { hasVisitedHome } from '@/router/index.ts'
import AppHeader from "@/components/organisms/AppHeader.vue";

Chart.register(...registerables)

interface WeatherData {
  location: string
  temperature: number
  feels_like: number
  humidity: number
  description: WeatherCondition
  wind_speed: number
  pressure: number
  cloud_cover: number
  sunrise: string
  sunset: string
  rain_probability: { time: string; probability: number }[]
}

interface HourlyForecast {
  date: string
  time: string
  location: string
  temperature: number
  feels_like: number
  humidity: number
  description: number
  wind_speed: number
  pressure: number
  cloud_cover: number
}

interface DailyForecast {
  time: string
  sunrise: string
  sunset: string
  rain_probability: { time: string; probability: number }[]
}

const weatherIcons = {
  [WeatherCondition.Sunny]: sunnyIcon,
  [WeatherCondition.Cloudy]: cloudyIcon,
  [WeatherCondition.PartlyCloudy]: partlyCloudyIcon,
  [WeatherCondition.Snow]: snowIcon,
  [WeatherCondition.Thunderstorm]: thunderstormIcon,
  [WeatherCondition.Rain]: rainIcon,
}

const weatherData = ref<WeatherData | null>(null)
const rainChartCanvas = ref<HTMLCanvasElement | null>(null)
let rainChart: Chart | null = null

// Navigation state
const allHourlyData = ref<HourlyForecast[]>([])
const allDailyData = ref<DailyForecast[]>([])
const currentHourIndex = ref(0)
const userCoords = ref({ lat: 52.22, lon: 21.01 })
const currentLocationName = ref('Warsaw, Poland') // Store current location name

// City search state
const citySearch = ref('')
const isSearching = ref(false)
const searchError = ref('')
const showSearchInput = ref(false)

const mockWeatherData: WeatherData = {
  location: 'Warsaw',
  temperature: 18,
  feels_like: 17,
  humidity: 65,
  description: WeatherCondition.Thunderstorm,
  wind_speed: 15,
  pressure: 1012,
  cloud_cover: 75,
  sunrise: '06:15',
  sunset: '19:45',
  rain_probability: [
    { time: '01:00', probability: 0 },
    { time: '02:00', probability: 0 },
    { time: '03:00', probability: 0 },
    { time: '04:00', probability: 0 },
    { time: '05:00', probability: 0 },
    { time: '06:00', probability: 0 },
    { time: '07:00', probability: 0 },
    { time: '08:00', probability: 0 },
    { time: '09:00', probability: 0 },
    { time: '10:00', probability: 0 },
    { time: '11:00', probability: 0 },
    { time: '12:00', probability: 0 },
    { time: '13:00', probability: 0 },
    { time: '14:00', probability: 0 },
    { time: '15:00', probability: 0 },
    { time: '16:00', probability: 10 },
    { time: '17:00', probability: 10 },
    { time: '18:00', probability: 25 },
    { time: '19:00', probability: 65 },
    { time: '20:00', probability: 65 },
    { time: '21:00', probability: 45 },
    { time: '22:00', probability: 70 },
    { time: '23:00', probability: 50 },
    { time: '24:00', probability: 20 },
  ],
}

const weatherDescriptionText = computed(() => {
  if (!weatherData.value) return ''
  return weatherData.value.description
})

const currentDateTime = computed(() => {
  if (!allHourlyData.value.length || currentHourIndex.value < 0) {
    return { date: '', time: '' }
  }
  const current = allHourlyData.value[currentHourIndex.value]
  const dateObj = new Date(current!.time)
  const date = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  const time = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  return { date, time }
})

const canGoPrevious = computed(() => currentHourIndex.value > 0)
const canGoNext = computed(() => currentHourIndex.value < allHourlyData.value.length - 1)

const navigatePreviousHour = () => {
  if (canGoPrevious.value) {
    currentHourIndex.value--
    updateWeatherDisplay()
  }
}

const navigateNextHour = () => {
  if (canGoNext.value) {
    currentHourIndex.value++
    updateWeatherDisplay()
  }
}

const navigateToStart = () => {
  currentHourIndex.value = 0
  updateWeatherDisplay()
}

const navigateToEnd = () => {
  currentHourIndex.value += 24
  updateWeatherDisplay()
}

const findCurrentHourIndex = (hourlyData: HourlyForecast[]) => {
  const now = new Date()
  const currentTime = now.toISOString().slice(0, 13) // YYYY-MM-DDTHH

  const index = hourlyData.findIndex(item => item.time.startsWith(currentTime))
  return index >= 0 ? index : 0
}

const updateWeatherDisplay = () => {
  if (!allHourlyData.value.length || !allDailyData.value.length) return

  const currentData = allHourlyData.value[currentHourIndex.value]
  const currentDate = currentData!.date

  // Find daily data for current date
  const dailyData = allDailyData.value.find(d => d.time === currentDate)

  // Get rain probability from daily data, or use empty array as fallback
  const rainProb = dailyData?.rain_probability || []

  // Get sunrise/sunset from daily data
  const sunrise = dailyData?.sunrise || '06:15'
  const sunset = dailyData?.sunset || '19:45'

  weatherData.value = {
    location: currentLocationName.value, // Use stored location name
    temperature: currentData!.temperature,
    feels_like: currentData!.feels_like,
    humidity: currentData!.humidity,
    description: weatherCodeMap.get(currentData!.description) as WeatherCondition || WeatherCondition.Sunny,
    wind_speed: currentData!.wind_speed,
    pressure: currentData!.pressure,
    cloud_cover: currentData!.cloud_cover,
    sunrise,
    sunset,
    rain_probability: rainProb,
  }
}

const loadWeatherData = async (lat: number, lon: number, locationName?: string) => {
  weatherData.value = null // Show loading spinner

  // If location name not provided, fetch it
  if (!locationName) {
    locationName = await getLocationName(lat, lon)
  }

  currentLocationName.value = locationName

  const apiData = await getWeather(
    String(lat),
    String(lon),
    forecast_types.hourly,
    14,
    locationName // Pass location name to API
  )

  if (apiData && apiData.hourly && apiData.daily) {
    allHourlyData.value = apiData.hourly
    allDailyData.value = apiData.daily
    currentHourIndex.value = findCurrentHourIndex(apiData.hourly)
    updateWeatherDisplay()
  } else {
    weatherData.value = mockWeatherData
  }
}

const searchCity = async () => {
  if (!citySearch.value.trim()) return

  isSearching.value = true
  searchError.value = ''

  try {
    const cityData = await getCityCoordinates(citySearch.value)
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

const handleSearchKeypress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    searchCity()
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
    await loadWeatherData(coords.lat, coords.lon) // Will fetch location name automatically
    showSearchInput.value = false
  } catch (err) {
    console.warn('Geo error:', err)
    searchError.value = 'Could not get your location'
  } finally {
    isSearching.value = false
  }
}



const createChart = () => {
  if (!rainChartCanvas.value || !weatherData.value) return
  const canvas = rainChartCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  if (rainChart) rainChart.destroy()

  const labels = weatherData.value.rain_probability.map((item) => item.time)
  const data = weatherData.value.rain_probability.map((item) => item.probability)

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight)
  gradient.addColorStop(0, 'rgba(75, 192, 192, 0.6)')
  gradient.addColorStop(1, 'rgba(75, 192, 192, 0)')

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'rain Index',
          data: data,
          backgroundColor: gradient,
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: { label: (context) => ` Probability: ${context.parsed.y}` },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          min:0,
          max:100,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12,
          },
        },
      },
    },
  }
  rainChart = new Chart(canvas as ChartItem, config)
}

onMounted(async () => {
  const coords = await getGeolocation()
    .then(({ lat, lon }) => {
      return { ulat: lat, ulon: lon }
    })
    .catch((err) => {
      console.warn('Geo error:', err)
      return { ulat: 52.22, ulon: 21.01 }
    })

  userCoords.value = { lat: coords.ulat, lon: coords.ulon }
  await loadWeatherData(coords.ulat, coords.ulon) // Will fetch location name automatically
  hasVisitedHome.value = true
})

watch(weatherData, (newData) => {
  if (newData) {
    current_weather_condition.value = newData.description
    import('vue').then(({ nextTick }) => {
      nextTick(() => {
        createChart()
      })
    })
  }
})
</script>

<template>
  <AppHeader />
  <main class="mx-4 md:grid md:grid-cols-4 gap-8 auto-rows-max justify-center pb-24">
    <GlassCard
      v-if="weatherData"
      class="col-span-2 row-span-2 p-6"
      :delay="100"
    >
      <div class="flex flex-col h-full justify-between">
        <div class="flex justify-between items-start min-h-20">
          <Transition name="slide-fade" mode="out-in">
            <div v-if="!showSearchInput" key="display" class="flex-1 min-w-0 pr-2">
              <h2 class="text-2xl sm:text-3xl font-bold break-words">
                {{
                  weatherData.location
                    ? weatherData.location
                      .split(',')
                      .map(p => p.trim())
                      .filter((part, i, arr) => i !== 1 || part !== arr[0])
                      .join(', ')
                    : ''
                }}
              </h2>
              <p class="text-base sm:text-lg text-zinc-400">{{ weatherDescriptionText }}</p>
            </div>
            <div v-else key="search" class="flex flex-col gap-3 w-full">
              <div class="flex flex-col sm:flex-row gap-2">
                <input
                  v-model="citySearch"
                  @keypress="handleSearchKeypress"
                  type="text"
                  placeholder="Enter city name"
                  class="flex-1 px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  :disabled="isSearching"
                />
                <div class="flex gap-2">
                  <button
                    @click="searchCity"
                    :disabled="isSearching || !citySearch.trim()"
                    class="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors text-sm sm:text-base"
                  >
                    {{ isSearching ? 'Searching...' : 'Search' }}
                  </button>
                  <button
                    @click="useCurrentLocation"
                    :disabled="isSearching"
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-zinc-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                    title="Use current location"
                  >
                    📍
                  </button>
                  <button
                    @click="toggleSearchInput"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <p v-if="searchError" class="text-red-400 text-sm">{{ searchError }}</p>
            </div>
          </Transition>
          <button
            v-if="!showSearchInput"
            @click="toggleSearchInput"
            class="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            title="Search for a city"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>

        <div class="flex items-center justify-center">
          <div class="text-8xl">
            <span
            ><img
              :src="weatherIcons[current_weather_condition]"
              alt="weather icon"
              class="w-16 h-16 mr-8 scale-200 md:scale-300"
            /></span>
          </div>
          <div class="flex items-baseline">
            <p class="text-8xl font-bold tracking-tighter">{{ weatherData.temperature }}</p>
            <span class="text-4xl font-light text-zinc-300/70 ml-1">°C</span>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center min-h-20">
          <div>
            <p class="text-sm text-zinc-400 mb-1">Feels like</p>
            <p class="font-bold text-xl flex items-center justify-center gap-2">
              <span>{{ weatherData.feels_like }}°C</span>
            </p>
          </div>
          <div>
            <p class="text-sm text-zinc-400 mb-1">Wind</p>
            <p class="font-bold text-xl flex items-center justify-center gap-2">
              <span>{{ weatherData.wind_speed }} km/h</span>
            </p>
          </div>
          <div>
            <p class="text-sm text-zinc-400 mb-1">Humidity</p>
            <p class="font-bold text-xl flex items-center justify-center gap-2">
              <span>{{ weatherData.humidity }}%</span>
            </p>
          </div>
          <div>
            <p class="text-sm text-zinc-400 mb-1">Cloud cover</p>
            <p class="font-bold text-xl flex items-center justify-center gap-2">
              <span>{{ weatherData.cloud_cover }}%</span>
            </p>
          </div>
        </div>
      </div>
    </GlassCard>

    <GlassCard v-if="weatherData" class="md:col-span-2 p-4"  :delay="200">
      <div class="flex flex-col h-full">
        <h2 class="text-2xl font-bold">Precipitation Trend</h2>
        <p class="text-md text-zinc-400">Next 24 hours</p>
        <div class="flex-grow relative">
          <canvas ref="rainChartCanvas"></canvas>
        </div>
      </div>
    </GlassCard>

    <GlassCard v-if="weatherData" :delay="300">
      <div class="flex flex-col items-center justify-center h-full text-center">
        <h3 class="font-bold text-zinc-100 mb-2">Sunrise</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-16 h-16 text-yellow-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <p class="text-4xl font-bold mt-2">{{ weatherData.sunrise }}</p>
      </div>
    </GlassCard>

    <GlassCard v-if="weatherData" :delay="400">
      <div class="flex flex-col items-center justify-center h-full text-center">
        <h3 class="font-bold text-zinc-100 mb-2">Sunset</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-16 h-16 text-zinc-700"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
        <p class="text-4xl text-zinc-100 font-bold mt-2">{{ weatherData.sunset }}</p>
      </div>
    </GlassCard>

    <!--<template v-if="!weatherData">
      <div class="col-span-full row-span-full flex justify-center items-center mb-6 min-h-[70vh]">
        <SkySpinner />
      </div>
    </template>-->

    <!-- Footer Navigation moved to component -->
    <AppFooter
      v-if="weatherData"
      :can-go-previous="canGoPrevious"
      :can-go-next="canGoNext"
      :current-date-time="currentDateTime"
      @to-start="navigateToStart"
      @previous-hour="navigatePreviousHour"
      @next-hour="navigateNextHour"
      @to-end="navigateToEnd"
      class="fixed md:flex md:flex-row md:items-center md:justify-center"
    />
  </main>
</template>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
