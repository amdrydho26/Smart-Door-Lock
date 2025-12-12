<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8">
    <div class="w-full max-w-md px-8 py-10 bg-white rounded-xl shadow-lg">
      <div class="flex flex-col items-center mb-6">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 9V7a6 6 0 1 1 12 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm6-2a1 1 0 0 0-1 1v2h2V8a1 1 0 0 0-1-1z" />
          </svg>
        </div>
        <h1 class="text-lg font-semibold text-gray-900">Smart Door Lock</h1>
        <p class="text-xs text-gray-500">Dashboard & Kontrol Pintar</p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="text-sm text-gray-700">Username</label>
          <input v-model="username" type="text" placeholder="Username" class="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="text-sm text-gray-700">Password</label>
          <input v-model="password" type="password" placeholder="Password" class="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <button type="submit" class="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">Masuk</button>
        </div>
      </form>

      <p v-if="error" class="text-sm text-red-600 text-center mt-3">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const { login } = useAuth()

const onSubmit = () => {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Harap masukkan username dan password.'
    return
  }
  // For demo purposes, set logged-in flag and navigate to beranda.
  login()
  router.push('/')
}
</script>

<style scoped>
</style>
