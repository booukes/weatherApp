<template>
  <AppHeader />
  <main class="mx-4 md:grid md:grid-cols-4 gap-8 auto-rows-max justify-center ">
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

        <button
          @click="getWeatherAdvice"
          :disabled="aiState.isThinking || aiState.rateLimitCooldown"
          :class="[
            'mt-4 w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl',
            aiState.rateLimitCooldown
              ? 'bg-zinc-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-zinc-600 disabled:to-zinc-600 disabled:cursor-not-allowed'
          ]"
        >
          <span v-if="aiState.rateLimitCooldown">⏱️ Please wait...</span>
          <span v-else-if="!aiState.isThinking">🤖 Get AI Weather Advice</span>
          <span v-else class="flex items-center gap-2">
            <span class="inline-block animate-spin">⚙️</span>
            Thinking...
          </span>
        </button>
      </div>
    </GlassCard>

    <Transition name="modal-fade">
      <div
        v-if="aiState.showAssistant"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeAiAssistant"
      >
        <div class="max-w-2xl w-full">
          <GlassCard class="p-6 relative" :delay="0">
            <button
              @click="closeAiAssistant"
              class="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
              title="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div class="flex items-center gap-3 mb-6">
              <span class="text-4xl">🤖</span>
              <div>
                <h2 class="text-2xl font-bold">AI Weather Assistant</h2>
                <p class="text-sm text-zinc-400">Powered by Puter.js</p>
              </div>
            </div>

            <div v-if="aiState.isThinking && aiState.chatHistory.length === 0" class="flex items-center justify-center py-12">
              <div class="flex flex-col items-center gap-4">
                <div class="relative">
                  <div class="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
                  <div class="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-300 opacity-20"></div>
                </div>
                <p class="text-zinc-400 animate-pulse">Analyzing weather conditions...</p>
              </div>
            </div>

            <div v-else-if="aiState.error && aiState.chatHistory.length === 0" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div class="flex items-start gap-3">
                <span class="text-2xl">⚠️</span>
                <div class="flex-1">
                  <p class="text-red-300 font-semibold mb-1">Error</p>
                  <p class="text-red-200">{{ aiState.error }}</p>
                </div>
              </div>
            </div>

            <div v-else class="flex flex-col h-[70vh] max-h-[700px]">
              <div ref="chatContainer" class="flex-1 space-y-4 overflow-y-auto p-4 bg-white/5 rounded-lg scroll-smooth mb-4">
                <div v-for="(msg, index) in aiState.chatHistory" :key="index" :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
                  <div :class="msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/10'" class="p-3 rounded-xl max-w-lg shadow-md">
                    <p class="text-base whitespace-pre-wrap">{{ msg.content }}</p>
                  </div>
                </div>

                <div v-if="aiState.isThinking" class="flex justify-start">
                  <div class="bg-white/10 p-3 rounded-xl shadow-md">
                    <span class="inline-block animate-spin text-xl">⚙️</span>
                  </div>
                </div>
              </div>

              <div v-if="aiState.error" class="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <div class="flex items-start gap-3">
                  <span class="text-2xl">⚠️</span>
                  <div class="flex-1">
                    <p class="text-red-300 font-semibold mb-1">Error</p>
                    <p class="text-red-200">{{ aiState.error }}</p>
                  </div>
                </div>
              </div>

              <form @submit.prevent="sendFollowUpMessage" class="flex gap-3">
                <input
                  v-model="aiState.userMessage"
                  :disabled="aiState.isThinking"
                  type="text"
                  placeholder="Ask a follow-up question..."
                  @keypress.enter.prevent="sendFollowUpMessage"
                  class="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  :disabled="aiState.isThinking || !aiState.userMessage.trim()"
                  class="flex-shrink-0 px-5 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                  title="Send"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.941l18-9a.75.75 0 0 0 0-1.882l-18-9Z" /></svg>
                </button>
              </form>
            </div>

          </GlassCard>
        </div>
      </div>
    </Transition>

    <GlassCard v-if="weatherData" class="md:col-span-2 p-4" :delay="200">
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
import { ref, onMounted, watch, computed, nextTick, reactive } from 'vue'
import { Chart, type ChartConfiguration, type ChartItem, registerables } from 'chart.js'
import GlassCard from '@/components/atoms/GlassCard.vue'
import AppFooter from '@/components/organisms/AppFooter.vue'
import sunnyIcon from '@/components/icons/weather/sunny.svg'
import cloudyIcon from '@/components/icons/weather/cloudy.svg'
import partlyCloudyIcon from '@/components/icons/weather/partlycloudy.svg'
import snowIcon from '@/components/icons/weather/snow.svg'
import thunderstormIcon from '@/components/icons/weather/thunder.svg'
import rainIcon from '@/components/icons/weather/rain.svg'
import { WeatherCondition, current_weather_condition, weatherCodeMap } from '@/stores/weatherStore'
import { getGeolocation, getWeather, forecast_types, getCityCoordinates, getLocationName } from '@/api'
import { hasVisitedHome } from '@/router/index.ts'
import AppHeader from "@/components/organisms/AppHeader.vue"

Chart.register(...registerables)

declare global {
  interface Window {
    puter?: {
      ai: {
        chat: (prompt: string, options?: { model?: string }) => Promise<string>
      }
    }
  }
}

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

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

const weatherIcons = {
  [WeatherCondition.Sunny]: sunnyIcon,
  [WeatherCondition.Cloudy]: cloudyIcon,
  [WeatherCondition.PartlyCloudy]: partlyCloudyIcon,
  [WeatherCondition.Snow]: snowIcon,
  [WeatherCondition.Thunderstorm]: thunderstormIcon,
  [WeatherCondition.Rain]: rainIcon,
}

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

const weatherData = ref<WeatherData | null>(null)
let rainChart: Chart | null = null
const allHourlyData = ref<HourlyForecast[]>([])
const allDailyData = ref<DailyForecast[]>([])
const currentHourIndex = ref(0)
const userCoords = ref({ lat: 52.22, lon: 21.01 })
const currentLocationName = ref('Warsaw, Poland')
const citySearch = ref('')
const isSearching = ref(false)
const searchError = ref('')
const showSearchInput = ref(false)

const aiState = reactive({
  showAssistant: false,
  chatHistory: [] as ChatMessage[],
  userMessage: '',
  initialPrompt: '',
  isThinking: false,
  error: '',
  puterLoaded: false,
  requestCount: 0,
  lastRequestTime: 0,
  rateLimitCooldown: false,
})

const rainChartCanvas = ref<HTMLCanvasElement | null>(null)
const chatContainer = ref<HTMLDivElement | null>(null)

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

const updateWeatherDisplay = () => {
  if (!allHourlyData.value.length || !allDailyData.value.length) return

  const currentData = allHourlyData.value[currentHourIndex.value]
  const currentDate = currentData!.date

  const dailyData = allDailyData.value.find(d => d.time === currentDate)
  const rainProb = dailyData?.rain_probability || []
  const sunrise = dailyData?.sunrise || '06:15'
  const sunset = dailyData?.sunset || '19:45'

  weatherData.value = {
    location: currentLocationName.value,
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
  weatherData.value = null

  if (!locationName) {
    locationName = await getLocationName(lat, lon)
  }

  currentLocationName.value = locationName

  const apiData = await getWeather(
    String(lat),
    String(lon),
    forecast_types.hourly,
    14,
    locationName
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

const findCurrentHourIndex = (hourlyData: HourlyForecast[]) => {
  const now = new Date()
  const currentTime = now.toISOString().slice(0, 13)

  const index = hourlyData.findIndex(item => item.time.startsWith(currentTime))
  return index >= 0 ? index : 0
}

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
  if (event.key === 'Enter' && !isSearching.value) {
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
    await loadWeatherData(coords.lat, coords.lon)
    showSearchInput.value = false
  } catch (err) {
    console.warn('Geo error:', err)
    searchError.value = 'Could not get your location'
  } finally {
    isSearching.value = false
  }
}

const loadPuterScript = () => {
  return new Promise((resolve, reject) => {
    if (window.puter) {
      aiState.puterLoaded = true
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.puter.com/v2/'
    script.async = true
    script.onload = () => {
      aiState.puterLoaded = true
      resolve(true)
    }
    script.onerror = () => reject(new Error('Failed to load Puter.js'))
    document.head.appendChild(script)
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const getWeatherAdvice = async () => {
  if (!weatherData.value) return

  if (aiState.rateLimitCooldown) {
    aiState.showAssistant = true
    aiState.error = '⏱️ Please wait a moment before making another request.'
    return
  }

  aiState.isThinking = true
  aiState.error = ''
  aiState.chatHistory = []
  aiState.userMessage = ''
  aiState.showAssistant = true

  try {
    if (!aiState.puterLoaded) {
      await loadPuterScript()
    }

    if (!window.puter || !window.puter.ai) {
      throw new Error('AI service not available. Please refresh the page and try again.')
    }

    const prompt = `You are a helpful weather assistant. Based on this weather data, give brief, practical advice (1-2 sentences max, BUT if the query requires it, or it seems much better for a longer response, do it)
     In follow up questions, answer lightly but do not tread out of weather-related queries.:

Location: ${weatherData.value.location}
Temperature: ${weatherData.value.temperature}°C (feels like ${weatherData.value.feels_like}°C)
Condition: ${weatherData.value.description}
Humidity: ${weatherData.value.humidity}%
Wind: ${weatherData.value.wind_speed} km/h

Give friendly, actionable advice about what to wear or activities to consider. Be very concise and helpful.`

    aiState.initialPrompt = prompt

    const response = await window.puter.ai.chat(prompt, { model: 'gpt-4o-mini' })
    aiState.chatHistory.push({ role: 'ai', content: response })

    aiState.requestCount++
    aiState.lastRequestTime = Date.now()

    if (aiState.requestCount >= 10) {
      aiState.rateLimitCooldown = true
      setTimeout(() => {
        aiState.rateLimitCooldown = false
        aiState.requestCount = 0
      }, 60000)
    }

  } catch (error: any) {
    console.error('AI Error:', error)

    if (error.message && (
      error.message.includes('rate limit') ||
      error.message.includes('too many requests') ||
      error.message.includes('429') ||
      error.code === 429 ||
      error.status === 429
    )) {
      aiState.error = '⏱️ Rate limit reached. Please wait a moment and try again.'
      aiState.rateLimitCooldown = true
      setTimeout(() => {
        aiState.rateLimitCooldown = false
      }, 30000)
    } else if (error.message && error.message.includes('quota')) {
      aiState.error = '💳 Daily quota exceeded. The AI service has reached its daily limit. Please try again later.'
    } else if (error.message && error.message.includes('network')) {
      aiState.error = '🌐 Network error. Please check your internet connection.'
    } else {
      aiState.error = error.message || 'Could not get AI advice. Please try again.'
    }
  } finally {
    aiState.isThinking = false
    scrollToBottom()
  }
}

const sendFollowUpMessage = async () => {
  const message = aiState.userMessage.trim()
  if (!message || aiState.isThinking) return

  aiState.error = ''
  aiState.chatHistory.push({ role: 'user', content: message })
  aiState.userMessage = ''
  aiState.isThinking = true

  try {
    let fullPrompt = aiState.initialPrompt +
      '\n\nHere is our conversation so far (User is asking a follow-up question):\n'

    for (const msg of aiState.chatHistory) {
      fullPrompt += msg.role === 'user' ? `User: ${msg.content}\n` : `AI: ${msg.content}\n`
    }
    fullPrompt += 'AI: '

    const response = await window.puter.ai.chat(fullPrompt, { model: 'gpt-4o-mini' })
    aiState.chatHistory.push({ role: 'ai', content: response })

  } catch (error: any) {
    console.error('AI Follow-up Error:', error)

    const errCode = error?.error?.code || error?.code || ''
    const isModerationError =
      errCode === 'moderation_failed' ||
      error?.error?.message?.includes?.('moderation') ||
      error?.message?.includes?.('moderation')

    if (isModerationError) {
      console.error('Naughty boy')
    }

    aiState.error =
      error?.error?.code === 'moderation_failed'
        ? 'AI rejected the request due to moderation filters.'
        : error?.message || 'Could not get AI response. Please try again.'
  } finally {
    aiState.isThinking = false
  }
}

const closeAiAssistant = () => {
  aiState.showAssistant = false
  aiState.error = ''
  aiState.chatHistory = []
  aiState.userMessage = ''
  aiState.initialPrompt = ''
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
  loadPuterScript().catch(err => console.warn('Puter loading error:', err))

  const coords = await getGeolocation()
    .then(({ lat, lon }) => {
      return { ulat: lat, ulon: lon }
    })
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
    import('vue').then(({ nextTick }) => {
      nextTick(() => {
        createChart()
      })
    })
  }
})

watch(aiState.chatHistory, () => {
  scrollToBottom()
}, { deep: true })

</script>

<style scoped>
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

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .max-w-2xl,
.modal-fade-leave-active .max-w-2xl {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .max-w-2xl {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.modal-fade-leave-to .max-w-2xl {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
