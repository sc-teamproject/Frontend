import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CommunityView from '../views/CommunityView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/community',
    name: 'Community',
    component: CommunityView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
