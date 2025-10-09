<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import FOG from 'vanta/dist/vanta.fog.min'
import AppHeader from '@/components/organisms/AppHeader.vue'

const vantaRef = ref<HTMLDivElement | null>(null)
interface VantaEffect {
  destroy: () => void;
}

let vantaEffect: VantaEffect | null = null;
onMounted(() => {
  if (vantaRef.value) {
    vantaEffect = FOG({
      el: vantaRef.value,
      THREE,
      minHeight: 200,
      minWidth: 200,
      highlightColor: 0x3072ca,
      midtoneColor: 0x9e9eb9,
      lowlightColor: 0xf0f0f0,
      baseColor: 0xffffff

    })

  }

})
onBeforeUnmount(() => {
  if (vantaEffect) vantaEffect.destroy()
})
</script>
<template>
  <div ref="vantaRef" style="position: fixed; top:0; left:0; width:100%; height:100%; z-index:-1;"></div>
  <AppHeader />
  <RouterView />
</template>

