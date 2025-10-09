<template>
  <ul class="flex items-center gap-6 text-2xl list-none nav-links">
    <li>
      <RouterLink to="/home">Home</RouterLink>
    </li>
    <div class="w-px h-5 bg-zinc-600"/>
    <li>
      <RouterLink to="/dashboard">Dashboard</RouterLink>
    </li>
    <div class="w-px h-5 bg-zinc-600"/>
    <li>
      <RouterLink to="/settings">Settings</RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.nav-links a {
  position: relative;
  text-decoration: none;
  padding-bottom: 8px;
  color: #a1a1aa; /* text-zinc-400 */
  transition: color 0.2s ease-in-out;
}

.nav-links a:hover {
  color: #fafafa; /* text-zinc-50 */
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #F042F0CC;
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
