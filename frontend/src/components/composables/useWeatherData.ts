
import { ref, computed } from 'vue'
import { getWeather, getLocationName, forecast_types } from '@/api'
import { weatherCodeMap, WeatherCondition } from '@/stores/weatherStore'

export interface WeatherData {
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

export function useWeatherData() {
  const weatherData = ref<WeatherData | null>(null)
  const allHourlyData = ref<any[]>([])
  const allDailyData = ref<any[]>([])
  const currentHourIndex = ref(0)
  const currentLocationName = ref('Warsaw, Poland')

  const canGoPrevious = computed(() => currentHourIndex.value > 0)
  const canGoNext = computed(() => currentHourIndex.value < allHourlyData.value.length - 1)

  const currentDateTime = computed(() => {
    if (!allHourlyData.value.length || currentHourIndex.value < 0) {
      return { date: '', time: '' }
    }
    const current = allHourlyData.value[currentHourIndex.value]
    const dateObj = new Date(current.time)
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

  const findCurrentHourIndex = (hourlyData: any[]) => {
    const now = new Date()
    const currentTime = now.toISOString().slice(0, 13)
    const index = hourlyData.findIndex(item => item.time.startsWith(currentTime))
    return index >= 0 ? index : 0
  }

  const updateWeatherDisplay = () => {
    if (!allHourlyData.value.length || !allDailyData.value.length) return

    const currentData = allHourlyData.value[currentHourIndex.value]
    const currentDate = currentData.date

    const dailyData = allDailyData.value.find(d => d.time === currentDate)
    const rainProb = dailyData?.rain_probability || []
    const sunrise = dailyData?.sunrise || '06:15'
    const sunset = dailyData?.sunset || '19:45'

    weatherData.value = {
      location: currentLocationName.value,
      temperature: currentData.temperature,
      feels_like: currentData.feels_like,
      humidity: currentData.humidity,
      description: weatherCodeMap.get(currentData.description) as WeatherCondition || WeatherCondition.Sunny,
      wind_speed: currentData.wind_speed,
      pressure: currentData.pressure,
      cloud_cover: currentData.cloud_cover,
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
    }
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

  return {
    weatherData,
    currentDateTime,
    canGoPrevious,
    canGoNext,
    loadWeatherData,
    navigatePreviousHour,
    navigateNextHour,
    navigateToStart,
    navigateToEnd,
  }
}
