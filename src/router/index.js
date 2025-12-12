import { createRouter, createWebHistory } from 'vue-router'
import BerandaTab from '../components/tabs/BerandaTab.vue'
import UsersTab from '../components/tabs/UsersTab.vue'
import LogsTab from '../components/tabs/LogsTab.vue'
import AnalyticsTab from '../components/tabs/AnalyticsTab.vue'
import LoginPage from '../components/Login.vue'

const routes = [
  { path: '/', name: 'beranda', component: BerandaTab },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/users', name: 'users', component: UsersTab },
  { path: '/logs', name: 'logs', component: LogsTab },
  { path: '/analytics', name: 'analytics', component: AnalyticsTab },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Simple auth-check using localStorage isLoggedIn flag
const isAuth = () => !!localStorage.getItem('isLoggedIn')

router.beforeEach((to, from) => {
  if (to.name !== 'login' && !isAuth()) {
    return { name: 'login' }
  }
  if (to.name === 'login' && isAuth()) {
    return { name: 'beranda' }
  }
  return true
})

export default router
