<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as THREE from 'three'
import FOG from 'vanta/dist/vanta.fog.min'
import AppHeader from '@/components/organisms/AppHeader.vue'

import { current_weather_condition, weatherColorPalettes } from '@/stores/weatherStore'


const vantaRef = ref<HTMLDivElement | null>(null)

interface VantaEffect {
  destroy: () => void;
  setOptions: (options: Record<string, any>) => void;
}

let vantaEffect: VantaEffect | null = null;

onMounted(() => {
  if (vantaRef.value) {
    const initialColors = weatherColorPalettes[current_weather_condition.value];

    vantaEffect = FOG({
      el: vantaRef.value,
      THREE,
      minHeight: 200,
      minWidth: 200,
      ...initialColors
    })
  }
})

onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy()
})

watch(current_weather_condition, (newCondition) => {
  if (vantaEffect) {
    const newColors = weatherColorPalettes[newCondition];
    vantaEffect.setOptions(newColors);
  }
});
</script>

<template>
  <div ref="vantaRef" style="position: fixed; top:0; left:0; width:100%; height:100%; z-index:-1;"></div>
  <AppHeader />
  <RouterView />
</template>

<style>
*{
  text-shadow: 1px 2px 3px rgba(0, 0, 0, .7);
}
</style>
