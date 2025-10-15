<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { Chart, registerables, type ChartConfiguration, type ChartItem } from 'chart.js'
import GlassCard from '@/components/atoms/GlassCard.vue'
import { getGeolocation, getAQI } from '@/api';

Chart.register(...registerables)

interface AqiData {
  currentAqi: number
  dominantPollutant: 'pm2.5' | 'pm10' | 'co' | 'o3' | 'ch4' | 'so2' 
  pollutants: {
    'pm2.5': { value: number; unit: string }
    pm10: { value: number; unit: string }
    co: { value: number; unit: string }
    o3: { value: number; unit: string }
    ch4: { value: number; unit: string }
    so2: { value: number; unit:string }
  }
  eaqi: { time: string; index: number }[]
}

const mockAqiData: AqiData = {
  currentAqi: 20,
  dominantPollutant: 'ch4',
  pollutants: {
    'pm2.5': { value: 5, unit: 'µg/m³' },
    pm10: { value: 2.7, unit: 'µg/m³' },
    co: { value: 16, unit: 'ppm' },
    o3: { value: 18, unit: 'ppb' },
    ch4: { value: 76, unit: 'ppb' },
    so2: { value: 464, unit: 'ppb' }
  },
  eaqi: [
    { time: '01:00', index: 27 }, { time: '02:00', index: 31 }, { time: '03:00', index: 74 },
    { time: '04:00', index: 231 }, { time: '05:00', index: 128 }, { time: '06:00', index: 33 },
    { time: '07:00', index: 16 }, { time: '08:00', index: 12 }, { time: '09:00', index: 13 },
    { time: '10:00', index: 15 }, { time: '11:00', index: 13 }, { time: '12:00', index: 18 },
    { time: '13:00', index: 13 }, { time: '14:00', index: 23 }, { time: '15:00', index: 21 },
    { time: '16:00', index: 13 }, { time: '17:00', index: 10 }, { time: '18:00', index: 25 },
    { time: '19:00', index: 65 }, { time: '20:00', index: 95 }, { time: '21:00', index: 43 },
    { time: '22:00', index: 36 }, { time: '23:00', index: 32 }, { time: '24:00', index: 20 },
  ]
}

const eaqiChartCanvas = ref<HTMLCanvasElement | null>(null)
const aqiData = ref<AqiData | null>(null)
let eaqiChart: Chart | null = null;

const getAqiInfo = (aqi: number) => {
  if (aqi <= 50) return { status: 'Good', color: 'text-green-400', advice: 'It\'s a great day to be outside!' }
  if (aqi <= 100) return { status: 'Moderate', color: 'text-yellow-400', advice: 'Good for most, but sensitive people should reduce outdoor time.' }
  if (aqi <= 150) return { status: 'Unhealthy for Sensitive Groups', color: 'text-orange-400', advice: 'Sensitive groups should avoid prolonged exertion outdoors.' }
  if (aqi <= 200) return { status: 'Unhealthy', color: 'text-red-500', advice: 'Everyone should limit outdoor activities.' }
  if (aqi <= 300) return { status: 'Very Unhealthy', color: 'text-purple-500', advice: 'Avoid all outdoor exertion. Stay indoors.' }
  return { status: 'Hazardous', color: 'text-rose-700', advice: 'Remain indoors and keep activity levels low. This is serious.' }
}

const aqiInfo = computed(() => {
  if (!aqiData.value) return getAqiInfo(0)
  return getAqiInfo(aqiData.value.currentAqi)
})

const pollutantList = computed(() => {
  if (!aqiData.value) return []
  return [
    { name: 'PM₂.₅', ...aqiData.value.pollutants['pm2.5'] },
    { name: 'PM₁₀', ...aqiData.value.pollutants.pm10 },
    { name: 'CO', ...aqiData.value.pollutants.co },
    { name: 'O₃', ...aqiData.value.pollutants.o3 },
    { name: 'CH₄', ...aqiData.value.pollutants.ch4 },
    { name: 'SO₂', ...aqiData.value.pollutants.so2 },
  ]
})

const dominantPollutantInfo = computed(() => {
  if (!aqiData.value) return null
  const dominantKey = aqiData.value.dominantPollutant;
  const pollutantData = aqiData.value.pollutants[dominantKey];
  const nameMap = {
    'pm2.5': 'PM₂.₅',
    'pm10': 'PM₁₀',
    'co': 'CO',
    'o3': 'O₃',
    'ch4': 'CH₄',
    'so2': 'SO₂'
  }
  return {
    name: nameMap[dominantKey],
    ...pollutantData
  }
})

const createChart = () => {
  if (!eaqiChartCanvas.value || !aqiData.value) return
  const canvas = eaqiChartCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  if(eaqiChart) eaqiChart.destroy()

  const labels = aqiData.value.eaqi.map(item => item.time)
  const data = aqiData.value.eaqi.map(item => item.index)
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight)
  gradient.addColorStop(0, 'rgba(75, 192, 192, 0.6)')
  gradient.addColorStop(1, 'rgba(75, 192, 192, 0)')

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'EAQI Index', data: data, backgroundColor: gradient, borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2, pointBackgroundColor: 'rgb(75, 192, 192)', pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgb(75, 192, 192)',
        tension: 0.4, fill: true,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)', titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 12 }, padding: 10, cornerRadius: 8,
          callbacks: { label: (context) => ` AQI: ${context.parsed.y}` }
        }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: 'rgba(255, 255, 255, 0.7)' } },
        x: { grid: { display: false }, ticks: { color: 'rgba(255, 255, 255, 0.7)', maxRotation: 0, autoSkip: true, maxTicksLimit: 12 } }
      }
    }
  }
  eaqiChart = new Chart(canvas as ChartItem, config)
}

onMounted( async () => {
  const userCoords = await getGeolocation()
    .then(({ lat, lon }) => {
      return {ulat: lat, ulon: lon}
    })
    .catch((err) => {
      console.warn('Geo error:', err)
      return {ulat: 52.22, ulon: 21.01}
    })
  const apiData = await getAQI(String(userCoords.ulat), String(userCoords.ulon))
  if(apiData){
    aqiData.value = apiData
  } else {
    aqiData.value = mockAqiData
  }
})

watch([aqiData, eaqiChartCanvas], () => {
  createChart()
}, { immediate: true })
</script>

<template>
  <main class="m-4 grid grid-cols-2 md:grid-cols-4 gap-8 auto-rows-[16rem] justify-center">

    <GlassCard v-if="aqiData" class="col-span-2 row-span-2" radius="rounded-md" :delay="100">
      <div class="flex flex-col h-full">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold">Air Quality</h2>
            <p class="text-md text-zinc-400">Live Index</p>
          </div>
        </div>
        <div class="flex-grow flex flex-col items-center justify-center text-center my-4">
          <p class="text-7xl font-bold" :class="aqiInfo.color">{{ aqiData.currentAqi }}</p>
          <p class="text-xl font-semibold mt-2" :class="aqiInfo.color">{{ aqiInfo.status }}</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm">
          <div v-for="p in pollutantList" :key="p.name" class="flex justify-between items-baseline border-b border-white/10 py-1">
            <span class="text-zinc-300">{{ p.name }}</span>
            <span class="font-mono font-semibold">{{ p.value }} <span class="text-xs text-zinc-400">{{ p.unit }}</span></span>
          </div>
        </div>
      </div>
    </GlassCard>

    <GlassCard class="h-full col-span-2" radius="rounded-md" :delay="200">
      <div class="flex flex-col h-full">
        <div class="mb-4">
          <h2 class="text-2xl font-bold">EAQI Trend</h2>
          <p class="text-md text-zinc-400">Last 24 hours</p>
        </div>
        <div class="relative flex-grow">
          <canvas ref="eaqiChartCanvas"></canvas>
        </div>
      </div>
    </GlassCard>

    <GlassCard v-if="dominantPollutantInfo" class="col-span-1" radius="rounded-md" :delay="300">
      <div class="flex flex-col h-full justify-between">
        <div>
          <h3 class="font-bold text-zinc-300">Dominant Pollutant</h3>
        </div>
        <div class="text-center">
          <p class="text-4xl font-bold">{{ dominantPollutantInfo.name }}</p>
          <p class="font-mono text-lg text-zinc-200">{{ dominantPollutantInfo.value }} <span class="text-xs text-zinc-400">{{ dominantPollutantInfo.unit }}</span></p>
        </div>
        <div class="text-xs text-zinc-500">
          This is the main pollutant affecting the current AQI score.
        </div>
      </div>
    </GlassCard>

    <GlassCard v-if="aqiInfo" class="col-span-1" radius="rounded-md" :delay="400">
      <div class="flex flex-col h-full justify-between">
        <div>
          <h3 class="font-bold text-zinc-300">Health Advice</h3>
        </div>
        <div class="text-center my-4">
          <p class="text-lg leading-tight" :class="aqiInfo.color">{{ aqiInfo.advice }}</p>
        </div>
      </div>
    </GlassCard>
  </main>
</template>
