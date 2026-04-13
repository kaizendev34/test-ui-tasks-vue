import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Tasks from '../views/Tasks.vue'
import Add from '../views/Add.vue'
import Update from '../views/Update.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    { path: '/tasks', name: 'tasks', component: Tasks },
    { path: '/add', name: 'add', component: Add },
    { path: '/update/:id', name: 'update', component: Update, props: true }
  ]
})

export default router
