<template>
  <ul class="flex items-center gap-4 text-2xl list-none nav-links">
    <li class="relative no-underline text-neutral-300 block pt-0.5">
      <RouterLink to="/dashboard">Dashboard</RouterLink>
    </li>
    <span class="w-0.25 h-6 bg-neutral-300"></span>
    <li class="relative no-underline text-neutral-300 block pt-0.5">
      <RouterLink to="/test">Test</RouterLink>
    </li>
  </ul>
</template>
<style scoped>
a::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 1px;
  background-color: #ccc;
  transition: width 0.2s ease;
}

a:hover::after,
a.router-link-exact-active::after {
  width: 100%;
}
</style>
