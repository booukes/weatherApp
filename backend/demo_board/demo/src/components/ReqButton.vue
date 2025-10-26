<script setup lang="ts">
    import { useDataStore, dataType } from '@/stores/dataStore';
    const props = defineProps<{
       reqType: dataType,
       lat: string,
       lon: string
    }>()
    const dataStore = useDataStore()
    function sendRequest(){
        const reqURL = `${props.reqType}?lat=${props.lat}&lon=${props.lon}`
        dataStore.fetchData(reqURL)
    }
    const btnClass = "flex align-center justify-center p-2 text-[#D6D6D6] bg-[#2D7A31] w-auto h-auto rounded-md hover:cursor-pointer hover:bg-[#409143]"
</script>

<template>
    <button @click="sendRequest" :class="btnClass">SEND</button>
</template>

<style scoped>
</style>