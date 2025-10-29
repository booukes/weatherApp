import { ref } from 'vue'
import { getCityCoordinates, getGeolocation } from '@/api'

export function useLocationSearch() {
  const citySearch = ref('')
  const isSearching = ref(false)
  const searchError = ref('')
  const showSearchInput = ref(false)

  const searchCity = async (city: string, onSuccess: (lat: number, lon: number, location: string) => void) => {
    if (!city.trim()) return

    isSearching.value = true
    searchError.value = ''

    try {
      const cityData = await getCityCoordinates(city)
      onSuccess(cityData.lat, cityData.lon, cityData.location)
      showSearchInput.value = false
      citySearch.value = ''
    } catch (error) {
      searchError.value = 'City not found. Please try again.'
      console.log(error)
    } finally {
      isSearching.value = false
    }
  }

  const useCurrentLocation = async (onSuccess: (lat: number, lon: number) => void) => {
    isSearching.value = true
    searchError.value = ''

    try {
      const coords = await getGeolocation()
      onSuccess(coords.lat, coords.lon)
      showSearchInput.value = false
    } catch (err) {
      console.warn('Geo error:', err)
      searchError.value = 'Could not get your location'
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

  return {
    citySearch,
    isSearching,
    searchError,
    showSearchInput,
    searchCity,
    useCurrentLocation,
    toggleSearchInput,
  }
}
