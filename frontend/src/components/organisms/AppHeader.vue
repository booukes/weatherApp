<script setup lang="ts">
import LogoText from '@/components/atoms/LogoText.vue'
import NavLinks from '@/components/molecules/NavLinks.vue'
import IconLogo from '@/components/icons/IconLogo.vue'
</script>

<template>
  <div class="p-4">
    <header
      class="backdrop-blur-xs hover:backdrop-blur-xl transition-all duration-200 ease-in-out sticky z-50 rounded-2xl drop-shadow-2xl blur-target"
    >
      <nav class="p-6 md:p-4 flex items-center w-full rounded-2xl bg-[rgba(30,30,30,0.25)] border border-white/20 nav-container">
        <div class="hidden md:flex justify-start nav-left">
          <LogoText />
        </div>
        <div class="absolute left-1/2 transform -translate-x-1/2 nav-center">
          <NavLinks />
        </div>
        <div class="hidden md:flex justify-end nav-right">
          <IconLogo
            class="w-10 h-10 transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </div>
      </nav>
    </header>
  </div>
</template>

<style scoped>


.nav-left,
.nav-right {
  flex: 1 1 0;
}
</style>
