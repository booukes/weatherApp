import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Settings from '../views/Settings.vue'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
  ],
})

export default router
