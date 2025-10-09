<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import GlassCard from '@/components/atoms/GlassCard.vue'
import { Chart, registerables } from 'chart.js'
import SkySpinner from '@/components/atoms/SkySpinner.vue'
import { WeatherCondition, current_weather_condition } from '@/stores/weatherStore'
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
    { time: '20:00', probability: 95 },
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

  const ctx = rainChartCanvas.value.getContext('2d')
  if (!ctx) return

  if (rainChart) {
    rainChart.destroy()
  }

  const labels = weatherData.value.rain_probability.map((p) => p.time)
  const data = weatherData.value.rain_probability.map((p) => p.probability)

  const gradient = ctx.createLinearGradient(0, 0, 0, 200)
  gradient.addColorStop(0, 'rgba(74, 144, 226, .7)')
  gradient.addColorStop(1, 'rgba(74, 144, 226, 0)')

  rainChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Rain Probability (%)',
          data: data,
          borderColor: '#63a4ff',
          pointBackgroundColor: '#fff',
          pointBorderColor: '#63a4ff',
          pointHoverRadius: 10,
          pointHoverBackgroundColor: '#63a4ff',
          pointRadius: 5,
          borderWidth: 2,
          fill: true,
          backgroundColor: gradient,
          tension: 0.5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#a0aec0',
            callback: function (value) {
              return value + '%'
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#a0aec0',
          },
        },
      },
    },
  })
}

onMounted(() => {
  setTimeout(() => {
    weatherData.value = mockWeatherData
  }, 500) // Simulate network delay
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
    <GlassCard v-if="weatherData" class="col-span-2 row-span-2 p-6" radius="rounded-md" :delay="100">
      <div class="flex flex-col h-full">
        <div>
          <h2 class="text-3xl font-bold">{{ weatherData.location }}</h2>
          <p class="text-lg text-zinc-400">{{ weatherDescriptionText }}</p>
        </div>
        <div class="flex-grow flex items-center justify-center">
          <p class="text-sm text-zinc-100">Current temperature</p>
          <p class="text-8xl font-bold tracking-tighter">{{ weatherData.temperature }}°C</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p class="text-sm text-zinc-100">Feels like</p>
            <p class="font-bold text-lg">{{ weatherData.feels_like }}°C</p>
          </div>
          <div>
            <p class="text-sm text-zinc-100">Wind</p>
            <p class="font-bold text-lg">{{ weatherData.wind_speed }} km/h</p>
          </div>
          <div>
            <p class="text-sm text-zinc-100">Humidity</p>
            <p class="font-bold text-lg">{{ weatherData.humidity }}%</p>
          </div>
          <div>
            <p class="text-sm text-zinc-100">Cloud cover</p>
            <p class="font-bold text-lg">{{ weatherData.cloud_cover }}%</p>
          </div>
        </div>
      </div>
    </GlassCard>

    <GlassCard v-if="weatherData" class="md:col-span-2 p-4" radius="rounded-md" :delay="200">
      <div class="flex flex-col h-full">
        <h3 class="font-bold mb-2 px-2">Rain Probability</h3>
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
