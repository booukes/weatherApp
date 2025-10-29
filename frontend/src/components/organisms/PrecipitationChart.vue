<template>
  <GlassCard class="md:col-span-2 p-4" :delay="100">
    <div class="flex flex-col h-full">
      <h2 class="text-2xl font-bold">Precipitation Trend</h2>
      <p class="text-md text-zinc-400">Next 24 hours</p>
      <div class="flex-grow relative">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, type ChartConfiguration, type ChartItem, registerables } from 'chart.js'
import GlassCard from '@/components/atoms/GlassCard.vue'

Chart.register(...registerables)

const props = defineProps<{
  rainProbability: { time: string; probability: number }[]
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const createChart = () => {
  if (!chartCanvas.value) return

  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (chart) chart.destroy()

  const labels = props.rainProbability.map((item) => item.time)
  const data = props.rainProbability.map((item) => item.probability)

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight)
  gradient.addColorStop(0, 'rgba(75, 192, 192, 0.6)')
  gradient.addColorStop(1, 'rgba(75, 192, 192, 0)')

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Rain Probability',
        data,
        backgroundColor: gradient,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: true,
      }],
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
          callbacks: {
            label: (context) => ` Probability: ${context.parsed.y}%`
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
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

  chart = new Chart(canvas as ChartItem, config)
}

onMounted(() => {
  createChart()
})

watch(() => props.rainProbability, () => {
  createChart()
}, { deep: true })
</script>
