import { createRouter, createWebHistory } from 'vue-router'
import APlayer from '@/components/APlayer.vue'
import HomePage from '@/components/HomePage.vue'
const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/music',
    component: APlayer,
    },
  {
    path: '/home',
    component: HomePage,
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
