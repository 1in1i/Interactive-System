import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import RotationGame from '@/components/RotationGame.vue'
import ReplicateNumber from '@/components/ReplicateNumber.vue'
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
    },
    {
      path: '/Replicate-Number',
      name: 'ReplicateNumber',
      component: ReplicateNumber,
    }
  ],
})

export default router
