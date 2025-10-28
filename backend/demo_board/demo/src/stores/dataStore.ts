import { defineStore } from 'pinia'
import axios from 'axios'

export enum dataType {
    weather = "/api/weatherData",
    aqi = "/api/airQualityData",
}

export const useDataStore = defineStore('data', {
  state: () => ({
    data: null as any,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchData(reqURL: string) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(reqURL)
        this.data = res.data
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
})
