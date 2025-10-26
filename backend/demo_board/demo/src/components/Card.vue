<script setup lang="ts">
import type { Component } from 'vue';
    const props = defineProps<{
       content?: Component
       contentProps?: Record<string, any>
    }>()
</script>
    
<template>
    <div class="flex flex-col justify-center items-center gap-3 text-[#7a7a7a] bg-[#28303A] p-4 w-auto h-auto rounded-md">
        <slot></slot>
        <component :is="props.content" v-bind="props.contentProps" />
    </div>
</template>

<style scoped>
</style>