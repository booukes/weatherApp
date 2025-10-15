<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import GlassCard from '@/components/atoms/GlassCard.vue'
import { Chart, type ChartConfiguration, type ChartItem, registerables } from 'chart.js'
import SkySpinner from '@/components/atoms/SkySpinner.vue'
import { WeatherCondition, current_weather_condition } from '@/stores/weatherStore'
import sunnyIcon from '@/components/icons/weather/sunny.svg'
import cloudyIcon from '@/components/icons/weather/cloudy.svg'
import partlyCloudyIcon from '@/components/icons/weather/partlycloudy.svg'
import snowIcon from '@/components/icons/weather/snow.svg'
import thunderstormIcon from '@/components/icons/weather/thunder.svg'
import rainIcon from '@/components/icons/weather/rain.svg'
import { getGeolocation, getWeather, getAQI } from '@/api';
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
const mockWeatherData: WeatherData = {
  location: 'Warsaw',
  temperature: 18,
  feels_like: 17,
  humidity: 65,
  description: WeatherCondition.Thunderstorm,
  wind_speed: 15, // km/h
  pressure: 1012, // hPa
  cloud_cover: 75, // %
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
          tension: 0.4,
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
  getGeolocation()
    .then(({ lat, lon }) => {
      console.log(lat, lon)
    })
    .catch((err) => {
      console.warn('Geo error:', err)
    })
  weatherData.value = mockWeatherData
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
  <main class="m-4 md:grid md:grid-cols-4 gap-8 auto-rows-[16rem] justify-center">
    <GlassCard
      v-if="weatherData"
      class="col-span-2 row-span-2 p-6"
      radius="rounded-md"
      :delay="100"
    >
      <div class="flex flex-col h-full justify-between">
        <div>
          <h2 class="text-3xl font-bold">{{ weatherData.location }}</h2>
          <p class="text-lg text-zinc-400">{{ weatherDescriptionText }}</p>
        </div>

        <div class="flex items-center justify-center my-4">
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

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p class="text-sm text-zinc-400 mb-1">Feels like</p>
            <p class="font-bold text-xl flex items-center justify-center gap-2">
              <span>🌡️</span>
              <span>{{ weatherData.feels_like }}°C</span>
            </p>
          </div>
          <div>
            <p class="text-sm text-zinc-400 mb-1">Wind</p>
            <p class="font-bold text-xl flex items-center justify-center gap-2">
              <span>🌬️</span>
              <span>{{ weatherData.wind_speed }} km/h</span>
            </p>
          </div>
          <div>
            <p class="text-sm text-zinc-400 mb-1">Humidity</p>
            <p class="font-bold text-xl flex items-center justify-center gap-2">
              <span>💧</span>
              <span>{{ weatherData.humidity }}%</span>
            </p>
          </div>
          <div>
            <p class="text-sm text-zinc-400 mb-1">Cloud cover</p>
            <p class="font-bold text-xl flex items-center justify-center gap-2">
              <span>☁️</span>
              <span>{{ weatherData.cloud_cover }}%</span>
            </p>
          </div>
        </div>
      </div>
    </GlassCard>

    <GlassCard v-if="weatherData" class="md:col-span-2 p-4" radius="rounded-md" :delay="200">
      <div class="flex flex-col h-full">
        <h2 class="text-2xl font-bold">Precipitation Trend</h2>
        <p class="text-md text-zinc-400">Last 24 hours</p>
        <div class="flex-grow relative">
          <canvas ref="rainChartCanvas"></canvas>
        </div>
      </div>
    </GlassCard>

    <GlassCard v-if="weatherData" radius="rounded-md" :delay="300">
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

    <GlassCard v-if="weatherData" radius="rounded-md" :delay="400">
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

    <template v-if="!weatherData">
      <div class="col-span-full row-span-full flex justify-center items-center mb-6min-h-[70vh]">
        <SkySpinner />
      </div>
    </template>
  </main>
</template>
