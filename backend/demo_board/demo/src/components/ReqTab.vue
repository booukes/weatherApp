<script setup lang="ts">
  import Card from "./Card.vue"
  import ReqButton from "./ReqButton.vue";
  import { dataType } from "../stores/dataStore";
  const ulat = '52.22'
  const ulon = '21.01'
</script>

<template>
    <Card :content="ReqButton" :content-props="{reqType: dataType.weather, lat: ulat, lon: ulon}">
        <p>Query: /api/weatherData?lat={{ulat}}&lon={{ulon}}</p>
    </Card>
    <Card :content="ReqButton" :content-props="{reqType: dataType.aqi, lat: ulat, lon: ulon}">
        <p>Query: /api/airQualityData?lat={{ulat}}&lon={{ulon}}</p>
    </Card>
</template>

<style scoped></style>