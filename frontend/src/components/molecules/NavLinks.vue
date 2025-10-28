<template>
  <ul class="flex items-center gap-6 text-lg md:text-2xl list-none nav-links">
    <li>
      <RouterLink class="text-zinc-400 relative pb-2 hover:text-zinc-100 transition-colors duration-200 ease-in-out" to="/">Weather</RouterLink>
    </li>
    <div class="w-px h-5 bg-zinc-200/50"/>
    <li>
      <RouterLink class="text-zinc-400 relative pb-2 hover:text-zinc-100 transition-colors duration-200 ease-in-out" to="/aqi">AQI</RouterLink>
    </li>
    <!--<div class="w-px h-5 bg-zinc-600"/>
    <li>
      <RouterLink class="text-zinc-400 relative pb-2 hover:text-zinc-100 transition-colors duration-200 ease-in-out" to="/settings">Settings</RouterLink>
    </li>-->
  </ul>
</template>

<style scoped>
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: oklch(96.7% 0.001 286.375);
  transition: width 0.2s ease-in-out;
}

.nav-links a:hover::after,
.nav-links a.router-link-exact-active::after {
  width: 100%;
}

.nav-links a.router-link-exact-active {
  color: #fafafa; /* text-zinc-50 */
}
</style>
