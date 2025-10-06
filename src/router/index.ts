import { createRouter, createWebHistory } from 'vue-router'
import AppDashboard from '../views/AppDashboard.vue'
import AppSettings from '../views/AppSettings.vue'
import HomeScreen from '../views/HomeScreen.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: AppDashboard,
    },
    {
      path: '/settings',
      name: 'settings',
      component: AppSettings,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeScreen,
    },
  ],
})

export default router
