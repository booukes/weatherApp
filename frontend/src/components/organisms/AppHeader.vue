<script setup lang="ts">
import LogoText from '@/components/atoms/LogoText.vue'
import NavLinks from '@/components/molecules/NavLinks.vue'
import IconLogo from '@/components/icons/IconLogo.vue'
</script>

<template>
  <div class="header-wrapper">
    <header class="sticky z-50 rounded-2xl drop-shadow-2xl">
      <nav class="nav-container">
        <div class="nav-left">
          <LogoText />
        </div>
        <div class="nav-center">
          <NavLinks />
        </div>
        <div class="nav-right">
          <IconLogo
            class="w-10 h-10 transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </div>
      </nav>
    </header>
  </div>
</template>

<style scoped>
.header-wrapper {
  padding: 1rem;
}

.nav-container {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 1rem;
  border-radius: 16px;
  background: rgba(30, 30, 30, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.1);
}
.nav-left,
.nav-right {
  flex: 1 1 0;
}

.nav-left,
.nav-center {
  display: flex;
  justify-content: flex-start;
}

.nav-right {
  display: flex;
  justify-content: flex-end;
}
@media (max-width: 860px) {
  .nav-left,
  .nav-right {
    display: none;
  }
  .nav-container {
    justify-content: center;
  }
}
</style>
