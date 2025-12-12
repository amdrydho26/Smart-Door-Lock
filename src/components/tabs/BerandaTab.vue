<template>
  <div class="space-y-8">
    <!-- Statistik Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total User -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Total User</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ totalUsersAnimated }}</p>
            <p class="text-xs text-green-600 mt-2">↑ 2 user baru minggu ini</p>
          </div>
          <div class="bg-blue-100 p-4 rounded-lg">
            <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 16a3 3 0 11-6 0 3 3 0 016 0zM16.7 5.3a3 3 0 11-4.24-4.24 3 3 0 014.24 4.24zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Akses Sukses -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Akses Sukses</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ successAccessAnimated }}</p>
            <p class="text-xs text-green-600 mt-2">{{ successPercentageAnimated }}% dari total</p>
          </div>
          <div class="bg-green-100 p-4 rounded-lg">
            <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Akses Gagal -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Akses Gagal</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ failedAccessAnimated }}</p>
            <p class="text-xs text-red-600 mt-2">{{ stats.failedPercentage }}% dari total</p>
          </div>
          <div class="bg-red-100 p-4 rounded-lg">
            <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Akses Hari Ini -->
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Akses Hari Ini</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ todayAccessAnimated }}</p>
            <p class="text-xs text-amber-600 mt-2">{{ stats.averageDaily }} rata-rata/hari</p>
          </div>
          <div class="bg-amber-100 p-4 rounded-lg">
            <svg class="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Sukses vs Gagal Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Status Summary -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Ringkasan Status Akses</h2>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-gray-600">Sukses</span>
              <span class="text-sm font-bold text-green-600">{{ successPercentageAnimated }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div class="bg-green-500 h-3 rounded-full" :style="{ width: mounted ? stats.successPercentage + '%' : '0%', transition: 'width 900ms cubic-bezier(.22,1,.36,1)' }"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-gray-600">Gagal</span>
              <span class="text-sm font-bold text-red-600">{{ failedPercentageAnimated }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div class="bg-red-500 h-3 rounded-full" :style="{ width: mounted ? stats.failedPercentage + '%' : '0%', transition: 'width 900ms cubic-bezier(.22,1,.36,1)' }"></div>
            </div>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="mt-8 grid grid-cols-2 gap-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <p class="text-gray-600 text-sm">Total Sukses</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ stats.successAccess }}</p>
          </div>
          <div class="bg-red-50 p-4 rounded-lg">
            <p class="text-gray-600 text-sm">Total Gagal</p>
            <p class="text-2xl font-bold text-red-600 mt-1">{{ stats.failedAccess }}</p>
          </div>
        </div>
      </div>

      <!-- Access Rate Chart -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Grafik Sukses vs Gagal</h2>
        <div class="space-y-6">
          <!-- Pie Chart Visualization -->
          <div class="flex justify-center items-center">
            <div class="relative w-40 h-40">
              <svg class="transform -rotate-90 w-40 h-40" viewBox="0 0 100 100" aria-hidden="true">
                <!-- Background ring -->
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EEF2F7" stroke-width="15" />
                <!-- Sukses slice -->
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" stroke-width="15" stroke-linecap="round"
                  :stroke-dasharray="displaySuccessDash" stroke-dashoffset="0" :style="{ transition: 'stroke-dasharray 900ms cubic-bezier(.22,1,.36,1)' }" />
                <!-- Gagal slice (offset by success length) -->
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" stroke-width="15" stroke-linecap="round"
                  :stroke-dasharray="displayFailDash" :stroke-dashoffset="displayFailOffset" :style="{ transition: 'stroke-dasharray 900ms cubic-bezier(.22,1,.36,1), stroke-dashoffset 900ms cubic-bezier(.22,1,.36,1)' }" />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <p class="text-sm text-gray-600">Tingkat Sukses</p>
                  <p class="text-2xl font-bold text-gray-900">{{ successPercentageAnimated }}%</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center space-x-8">
            <div class="text-center">
              <div class="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p class="text-sm text-gray-600">Sukses</p>
              <p class="font-bold text-green-600">{{ stats.successAccess }}</p>
            </div>
            <div class="text-center">
              <div class="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
              <p class="text-sm text-gray-600">Gagal</p>
              <p class="font-bold text-red-600">{{ stats.failedAccess }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Terbaru -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-6">Log Akses Terbaru</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-medium text-gray-700">Waktu</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700">User</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700">Pesan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(log, index) in recentLogs" :key="index" class="border-b border-gray-100 hover:bg-gray-50 transition">
              <td class="py-3 px-4 text-sm text-gray-600">{{ log.time }}</td>
              <td class="py-3 px-4">
                <div class="flex items-center space-x-2">
                  <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.uid}`" :alt="log.uid" class="w-8 h-8 rounded-full">
                  <span class="font-medium text-gray-900">{{ log.user }}</span>
                </div>
              </td>
              <td class="py-3 px-4">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  log.status === 'sukses' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ log.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-sm text-gray-600">{{ log.message }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4 text-center">
        <button @click="goToLogs" class="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium text-sm">
          Lihat Semua Log →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCountUp } from '../../composables/useCountUp'

const stats = ref({
  totalUsers: 24,
  successAccess: 342,
  failedAccess: 23,
  successPercentage: 94,
  failedPercentage: 6,
  todayAccess: 18,
  averageDaily: 12,
})

const recentLogs = ref([
  { time: '12/11/2025 14:35:22', uid: 'user001', user: 'Budi Santoso', status: 'sukses', message: 'Pintu dibuka dengan PIN' },
  { time: '12/11/2025 14:28:15', uid: 'user002', user: 'Siti Nurhaliza', status: 'sukses', message: 'Pintu dibuka dengan RFID' },
  { time: '12/11/2025 14:15:47', uid: 'user003', user: 'Rinto Harahap', status: 'gagal', message: 'PIN salah (Percobaan 3)' },
  { time: '12/11/2025 14:05:33', uid: 'user001', user: 'Budi Santoso', status: 'sukses', message: 'Pintu dibuka dengan PIN' },
  { time: '12/11/2025 13:52:09', uid: 'user004', user: 'Dewi Lestari', status: 'sukses', message: 'Pintu dibuka dengan RFID' },
])

const router = useRouter()

const goToLogs = () => {
  router.push('/logs')
}


// Pie chart calculations
const pieRadius = 40
const pieCircumference = 2 * Math.PI * pieRadius
const successStroke = computed(() => (pieCircumference * (stats.value.successPercentage || 0)) / 100)
const failStroke = computed(() => (pieCircumference * (stats.value.failedPercentage || 0)) / 100)
const successDash = computed(() => `${successStroke.value} ${Math.max(0, pieCircumference - successStroke.value)}`)
const failDash = computed(() => `${failStroke.value} ${Math.max(0, pieCircumference - failStroke.value)}`)
const failOffset = computed(() => `-${successStroke.value}`)
// mounted flag for transitions
const mounted = ref(false)
onMounted(() => {
  setTimeout(() => { mounted.value = true }, 60)
})

// animated values
const totalUsersAnimated = useCountUp(computed(() => stats.value.totalUsers), { duration: 900 })
const successAccessAnimated = useCountUp(computed(() => stats.value.successAccess), { duration: 900 })
const failedAccessAnimated = useCountUp(computed(() => stats.value.failedAccess), { duration: 900 })
const successPercentageAnimated = useCountUp(computed(() => stats.value.successPercentage), { duration: 900 })
const failedPercentageAnimated = useCountUp(computed(() => stats.value.failedPercentage), { duration: 900 })
const todayAccessAnimated = useCountUp(computed(() => stats.value.todayAccess), { duration: 900 })

const displaySuccessDash = computed(() => (mounted.value ? successDash.value : `0 ${pieCircumference}`))
const displayFailDash = computed(() => (mounted.value ? failDash.value : `0 ${pieCircumference}`))
const displayFailOffset = computed(() => (mounted.value ? failOffset.value : `0`))
</script>

<style scoped>
</style>
