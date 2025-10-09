import { createRouter, createWebHistory } from 'vue-router'
import AqiScreen from '../views/AQIScreen.vue'
import AppSettings from '../views/AppSettings.vue'
import HomeScreen from '../views/HomeScreen.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/aqi',
      name: 'aqi',
      component: AqiScreen,
    },
    {
      path: '/settings',
      name: 'settings',
      component: AppSettings,
    },
    {
      path: '/',
      name: 'home',
      component: HomeScreen,
    },
  ],
})

export default router
