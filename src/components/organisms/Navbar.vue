<template>
  <nav class="nav">
    <ul class="nav-links">
      <li>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
      </li>
      <span class="divider"></span>
      <li>
        <RouterLink to="/test">Test</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  background-color: #111;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-size: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.divider {
  width: 1px;
  height: 1.5rem;
  background-color: #ccc;
}

.nav-links li {
  position: relative;
}

.nav-links a {
  color: #ccc;
  text-decoration: none;
  display: block;
  padding: 0.5rem 0;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: #ccc;
  transition: width 0.3s ease;
}

.nav-links a:hover::after,
.nav-links a.router-link-exact-active::after {
  width: 100%;
}
</style>
