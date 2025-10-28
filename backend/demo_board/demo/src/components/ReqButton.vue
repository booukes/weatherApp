<script setup lang="ts">
    import { useDataStore, dataType, forecast_types, forecast_days } from '@/stores/dataStore';
    const props = defineProps<{
       reqType: dataType,
       lat: string,
       lon: string,
       forecast_type?: forecast_types,
       forecast_days?: forecast_days
    }>()
    const dataStore = useDataStore()
    let reqURL
    function sendRequest(){
        switch(props.reqType){
            case dataType.weather:
                if(props.forecast_type && props.forecast_days){
                    reqURL = `${props.reqType}?lat=${props.lat}&lon=${props.lon}&forecast_type=${props.forecast_type}&forecast_days=${props.forecast_days}`
                    dataStore.fetchData(reqURL)
                } else {
                    dataStore.$state.error = "Error: invalid query params"
                }
                break
            case dataType.aqi:
                reqURL = `${props.reqType}?lat=${props.lat}&lon=${props.lon}`
                dataStore.fetchData(reqURL)
                break
            default:
                return
        }
    }
    const btnClass = "flex align-center justify-center p-2 text-[#D6D6D6] bg-[#2D7A31] w-auto h-auto rounded-md hover:cursor-pointer hover:bg-[#409143]"
</script>

<template>
    <button @click="sendRequest" :class="btnClass">SEND</button>
</template>

<style scoped>
</style>