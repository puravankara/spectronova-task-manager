import { createRouter, createWebHistory } from 'vue-router'
import TaskManagerPage from '@/pages/taskManager/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: TaskManagerPage,
    },
  ],
})

export default router
