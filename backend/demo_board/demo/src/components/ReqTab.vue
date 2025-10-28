<script setup lang="ts">
  import { ref } from 'vue'
  import Card from "./Card.vue"
  import ReqButton from "./ReqButton.vue";
  import { dataType, forecast_days, forecast_types } from "../stores/dataStore";
  const ulat = '52.22'
  const ulon = '21.01'
  const fct = ref<forecast_types>()
  const fcd = ref<forecast_days>(forecast_days.one)
</script>

<template>
    <Card :content="ReqButton" :content-props="{reqType: dataType.weather, lat: ulat, lon: ulon, forecast_type: fct, forecast_days: fcd}">
        <p>Query: /api/weatherData?lat={{ulat}}&lon={{ulon}}&forecast_type=
            <select id="gw" v-model="fct" class="focus:bg-[#28303A] hover:cursor-pointer border-1 border-[#D6D6D6] p-1 rounded-sm">
                <option disabled value="">Select forecast type</option>
                <option>{{forecast_types.current}}</option>
                <option>{{forecast_types.hourly}}</option>
            </select>
            &forecast_days=<span v-if="fct==forecast_types.current">1</span>
            <select v-else v-model="fcd" class="focus:bg-[#28303A] hover:cursor-pointer border-1 border-[#D6D6D6] p-1 rounded-sm">
                <option disabled value="">Select forecast days</option>
                <option v-for="(label, val) in forecast_days" :key="val" :value="label">{{ label }}</option>
            </select>
        </p>
    </Card>
    <Card :content="ReqButton" :content-props="{reqType: dataType.aqi, lat: ulat, lon: ulon}">
        <p>Query: /api/airQualityData?lat={{ulat}}&lon={{ulon}}</p>
    </Card>
</template>

<style scoped>
</style>