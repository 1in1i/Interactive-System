import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import RotationGame from '@/components/RotationGame.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
    {
      path: '/Rotation-Game',
      name: 'RotationGame',
      component: RotationGame
    }
  ],
})

export default router
