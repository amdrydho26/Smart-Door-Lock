<template>
  <div class="h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
    <!-- Header -->
    <header v-if="showShell" class="bg-white shadow-md fixed top-0 left-0 right-0 z-40 h-20 border-b border-gray-200">
      <div class="h-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 9V7a6 6 0 1 1 12 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm6-2a1 1 0 0 0-1 1v2h2V8a1 1 0 0 0-1-1z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 whitespace-nowrap">Smart Door Lock</h1>
            <p class="text-xs text-gray-500">Dashboard & Kontrol Pintar</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="hidden md:flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-lg flex-shrink-0">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-xs font-medium text-green-700 whitespace-nowrap">System Online</span>
          </div>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=dashboard" alt="Profile" class="w-10 h-10 rounded-full flex-shrink-0">
        </div>
      </div>
    </header>

    <!-- Main Container with Fixed Sidebar -->
    <div :class="['flex flex-1 overflow-hidden', showShell ? 'pt-20' : '']">
      <!-- Fixed Sidebar -->
      <aside v-if="showShell" class="fixed left-0 top-20 bottom-0 w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto z-30">
        <nav class="p-4 space-y-2 pb-24">
          <router-link v-for="tab in tabs" :key="tab.id" :to="tab.path" custom v-slot="{ navigate, isActive }">
            <button
              @click="navigate"
              :class="[
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100',
                'w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 flex-shrink-0" />
              <span>{{ tab.label }}</span>
            </button>
          </router-link>
        </nav>

        <!-- Footer Info in Sidebar -->
        <div class="fixed bottom-0 left-0 w-64 p-4 bg-gradient-to-t from-gray-50 to-transparent border-t border-gray-200">
            <div class="text-xs text-gray-600 space-y-2">
              <p class="font-semibold">Status Sistem</p>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
              <p class="text-gray-500 mt-2">v1.0.0</p>
            </div>
            <div class="mt-4">
              <button v-if="isLoggedIn" @click="handleLogout" class="w-full px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition">Logout</button>
            </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main :class="showShell ? 'flex-1 ml-64 overflow-y-auto flex flex-col' : 'flex-1 w-full'">
        <div class="flex-1 w-full px-6 py-8">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" class="animate-fadeIn" />
            </transition>
          </router-view>
        </div>

        <!-- Footer -->
        <footer v-if="showShell" class="bg-gray-800 text-gray-400 py-6 w-full flex-shrink-0">
          <div class="px-6 text-center text-sm">
            <p>&copy; 2025 Smart Door Lock System. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup>
import HomeIcon from './components/icons/HomeIcon.vue'
import UsersIcon from './components/icons/UsersIcon.vue'
import LogIcon from './components/icons/LogIcon.vue'
import ChartIcon from './components/icons/ChartIcon.vue'

const tabs = [
  { id: 'beranda', label: 'Beranda', path: '/', icon: HomeIcon },
  { id: 'users', label: 'Manajemen User', path: '/users', icon: UsersIcon },
  { id: 'logs', label: 'Log Akses Pintu', path: '/logs', icon: LogIcon },
  { id: 'analytics', label: 'Analitik', path: '/analytics', icon: ChartIcon },
]

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'

const route = useRoute()
const router = useRouter()
const { isLoggedIn, logout } = useAuth()
const showShell = computed(() => route.name !== 'login')

const handleLogout = () => {
  logout()
  router.push({ name: 'login' })
}

</script>

<style scoped>
:deep() {
  @apply transition-all duration-300;
}
</style>
