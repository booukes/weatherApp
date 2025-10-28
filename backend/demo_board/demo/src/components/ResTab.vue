<script setup lang="ts">
    import Card from "./Card.vue"
    import { useDataStore } from '@/stores/dataStore';
    import { storeToRefs } from "pinia";
    
    const dataStore = useDataStore()
    const {data, loading, error} = storeToRefs(dataStore)
</script>
    
<template>
    <div class="max-h-50 md:max-h-80 lg:max-h-110">
        <Card v-if="!loading && data">
            <p v-if="data" class="max-h-96 text-sm md:max-h-150 md:text-lg overflow-auto">{{data}}</p>
        </Card>
        <Card v-if="error">
            <p>{{error}}</p>
        </Card>
    </div>
</template>

<style scoped>
</style>