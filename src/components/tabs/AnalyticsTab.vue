<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Analitik & Statistik</h2>
        <p class="text-gray-500 text-sm mt-1">Laporan penggunaan dan analisis pintu pintar</p>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Periode</label>
          <select v-model="dateRange" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="today">Hari Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
            <option value="year">Tahun Ini</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div v-if="dateRange === 'custom'" class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Tanggal</label>
          <div class="flex gap-2">
            <input type="date" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span class="flex items-center">-</span>
            <input type="date" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
        <div class="flex gap-2 md:self-end">
          <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            Perbarui
          </button>
        </div>
      </div>
    </div>

    <!-- Top Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <p class="text-blue-600 text-sm font-medium">Total Akses</p>
        <p class="text-3xl font-bold text-blue-900 mt-2">{{ analyticsData.totalAccess }}</p>
        <p class="text-xs text-blue-600 mt-2">↑ 12% dari minggu lalu</p>
      </div>
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <p class="text-green-600 text-sm font-medium">Akses Sukses</p>
        <p class="text-3xl font-bold text-green-900 mt-2">{{ analyticsData.successCount }}</p>
        <p class="text-xs text-green-600 mt-2">{{ analyticsData.successPercentage }}% tingkat sukses</p>
      </div>
      <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <p class="text-red-600 text-sm font-medium">Akses Gagal</p>
        <p class="text-3xl font-bold text-red-900 mt-2">{{ analyticsData.failedCount }}</p>
        <p class="text-xs text-red-600 mt-2">{{ analyticsData.failedPercentage }}% tingkat kegagalan</p>
      </div>
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <p class="text-purple-600 text-sm font-medium">User Aktif</p>
        <p class="text-3xl font-bold text-purple-900 mt-2">{{ analyticsData.activeUsers }}</p>
        <p class="text-xs text-purple-600 mt-2">Minggu ini</p>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Grafik Penggunaan Pintu Harian -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Penggunaan Pintu (Per Hari)</h3>
        <div class="h-80 flex items-end justify-end gap-3 pb-8">
          <div v-for="(day, index) in dailyUsage" :key="index" class="flex-1 flex flex-col items-center group">
            <div class="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-lg transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-600" :style="{ height: `${(day.value / 100) * 300}px` }"></div>
            <p class="text-xs text-gray-600 mt-2 font-medium">{{ day.day }}</p>
            <p class="text-xs text-gray-500">{{ day.value }}</p>
          </div>
        </div>
      </div>

      <!-- Grafik Penggunaan Pintu Per Jam (Line Chart) -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Penggunaan Pintu (Per Jam)</h3>
        <div class="h-80 relative">
          <!-- SVG Chart -->
          <svg class="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
            <!-- Grid Lines -->
            <line x1="40" y1="30" x2="40" y2="270" stroke="#ccc" stroke-width="1" />
            <line x1="40" y1="270" x2="800" y2="270" stroke="#ccc" stroke-width="1" />
            
            <!-- Y Grid -->
            <line x1="35" y1="60" x2="800" y2="60" stroke="#f0f0f0" stroke-width="1" />
            <line x1="35" y1="120" x2="800" y2="120" stroke="#f0f0f0" stroke-width="1" />
            <line x1="35" y1="180" x2="800" y2="180" stroke="#f0f0f0" stroke-width="1" />
            <line x1="35" y1="240" x2="800" y2="240" stroke="#f0f0f0" stroke-width="1" />
            
            <!-- Area fill gradient -->
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#3B82F6" stop-opacity="0" />
              </linearGradient>
            </defs>
            
            <!-- Filled area under line -->
            <polygon points="55,224 140,148 225,160 310,88 395,44 480,28 565,172 55,270 565,270" fill="url(#chartGradient)" />
            
            <!-- Line chart -->
            <polyline points="55,224 140,148 225,160 310,88 395,44 480,28 565,172" fill="none" stroke="#3B82F6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            
            <!-- Data points -->
            <circle cx="55" cy="224" r="4" fill="#3B82F6" stroke="white" stroke-width="2" />
            <circle cx="140" cy="148" r="4" fill="#3B82F6" stroke="white" stroke-width="2" />
            <circle cx="225" cy="160" r="4" fill="#3B82F6" stroke="white" stroke-width="2" />
            <circle cx="310" cy="88" r="4" fill="#3B82F6" stroke="white" stroke-width="2" />
            <circle cx="395" cy="44" r="4" fill="#3B82F6" stroke="white" stroke-width="2" />
            <circle cx="480" cy="28" r="4" fill="#3B82F6" stroke="white" stroke-width="2" />
            <circle cx="565" cy="172" r="4" fill="#3B82F6" stroke="white" stroke-width="2" />
            
            <!-- X axis labels -->
            <text x="55" y="295" text-anchor="middle" font-size="12" fill="#666">00:00</text>
            <text x="140" y="295" text-anchor="middle" font-size="12" fill="#666">04:00</text>
            <text x="225" y="295" text-anchor="middle" font-size="12" fill="#666">08:00</text>
            <text x="310" y="295" text-anchor="middle" font-size="12" fill="#666">12:00</text>
            <text x="395" y="295" text-anchor="middle" font-size="12" fill="#666">16:00</text>
            <text x="480" y="295" text-anchor="middle" font-size="12" fill="#666">20:00</text>
            <text x="565" y="295" text-anchor="middle" font-size="12" fill="#666">23:00</text>
            
            <!-- Y axis labels -->
            <text x="20" y="275" text-anchor="end" font-size="11" fill="#666">0</text>
            <text x="20" y="245" text-anchor="end" font-size="11" fill="#666">5</text>
            <text x="20" y="185" text-anchor="end" font-size="11" fill="#666">10</text>
            <text x="20" y="125" text-anchor="end" font-size="11" fill="#666">15</text>
            <text x="20" y="65" text-anchor="end" font-size="11" fill="#666">20</text>
          </svg>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <p class="text-xs text-gray-600">Trend Akses: <span class="font-bold text-green-600">↑ Meningkat</span></p>
          <p class="text-xs text-gray-600">Rata-rata: <span class="font-bold">{{ avgHourlyAccess }} akses/jam</span></p>
        </div>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Jam Sibuk -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Jam Sibuk</h3>
        <div class="space-y-4">
          <div v-for="(hour, index) in busyHours" :key="index" class="group">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">{{ hour.time }}</span>
              <span class="text-sm font-bold text-gray-900">{{ hour.count }} akses</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div class="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full transition-all duration-300 group-hover:from-amber-500 group-hover:to-amber-600" :style="{ width: `${(hour.count / 35) * 100}%` }"></div>
            </div>
          </div>
        </div>
        <div class="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p class="text-sm text-amber-900"><strong>Jam Puncak:</strong> {{ busyHours[0].time }} dengan {{ busyHours[0].count }} akses</p>
        </div>
      </div>

      <!-- User Paling Sering Akses -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-6">User Paling Sering Akses</h3>
        <div class="space-y-4">
          <div v-for="(user, index) in topUsers" :key="index" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <div class="flex items-center space-x-3 flex-1">
              <div class="relative">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`" :alt="user.name" class="w-10 h-10 rounded-full">
                <div class="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {{ index + 1 }}
                </div>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ user.name }}</p>
                <p class="text-xs text-gray-500">{{ user.uid }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-900">{{ user.count }}</p>
              <p class="text-xs text-gray-500">akses</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Insights Section -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
      <h3 class="text-lg font-bold text-gray-900 mb-4">📊 Wawasan Analitik</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-2">Tingkat Kesuksesan</p>
          <p class="text-2xl font-bold text-green-600">{{ analyticsData.successPercentage }}%</p>
          <p class="text-xs text-gray-500 mt-1">Sistem bekerja dengan sangat baik</p>
        </div>
        <div class="bg-white rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-2">Rata-rata Akses/Hari</p>
          <p class="text-2xl font-bold text-blue-600">{{ analyticsData.avgDaily }}</p>
          <p class="text-xs text-gray-500 mt-1">Konsisten dan stabil</p>
        </div>
        <div class="bg-white rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-2">Peak Hour</p>
          <p class="text-2xl font-bold text-amber-600">{{ busyHours[0].time }}</p>
          <p class="text-xs text-gray-500 mt-1">Waktu tersibuk dalam sehari</p>
        </div>
      </div>
    </div>

    <!-- Detailed Statistics Table -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Statistik Detail Per User</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">User</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Total Akses</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Sukses</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Gagal</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Tingkat Sukses</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Akses Terakhir</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="stat in detailedStats" :key="stat.uid" class="hover:bg-gray-50 transition">
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${stat.uid}`" :alt="stat.name" class="w-8 h-8 rounded-full">
                  <span class="font-medium text-gray-900">{{ stat.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 font-semibold text-gray-900">{{ stat.total }}</td>
              <td class="px-4 py-3 text-green-600 font-semibold">{{ stat.success }}</td>
              <td class="px-4 py-3 text-red-600 font-semibold">{{ stat.failed }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <div class="w-12 bg-gray-200 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" :style="{ width: stat.successRate + '%' }"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-600 w-10">{{ stat.successRate }}%</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ stat.lastAccess }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const dateRange = ref('week')

const analyticsData = ref({
  totalAccess: 456,
  successCount: 428,
  failedCount: 28,
  successPercentage: 94,
  failedPercentage: 6,
  activeUsers: 12,
  avgDaily: 65,
})

const dailyUsage = ref([
  { day: 'Senin', value: 78 },
  { day: 'Selasa', value: 85 },
  { day: 'Rabu', value: 92 },
  { day: 'Kamis', value: 68 },
  { day: 'Jumat', value: 95 },
  { day: 'Sabtu', value: 45 },
  { day: 'Minggu', value: 35 },
])

const hourlyUsage = ref([
  { time: '00:00', value: 2 },
  { time: '04:00', value: 1 },
  { time: '08:00', value: 8 },
  { time: '12:00', value: 12 },
  { time: '16:00', value: 15 },
  { time: '20:00', value: 18 },
  { time: '23:00', value: 6 },
])

const avgHourlyAccess = computed(() => {
  return Math.round(hourlyUsage.value.reduce((sum, h) => sum + h.value, 0) / hourlyUsage.value.length)
})

const busyHours = ref([
  { time: '07:00 - 09:00', count: 35 },
  { time: '09:00 - 11:00', count: 28 },
  { time: '11:00 - 13:00', count: 22 },
  { time: '13:00 - 15:00', count: 18 },
  { time: '15:00 - 17:00', count: 31 },
  { time: '17:00 - 19:00', count: 25 },
])

const topUsers = ref([
  { uid: 'user001', name: 'Budi Santoso', count: 65 },
  { uid: 'user002', name: 'Siti Nurhaliza', count: 54 },
  { uid: 'user004', name: 'Dewi Lestari', count: 48 },
  { uid: 'user005', name: 'Ahmad Rizaldi', count: 42 },
  { uid: 'user006', name: 'Ratna Wijaya', count: 38 },
])

const detailedStats = ref([
  { uid: 'user001', name: 'Budi Santoso', total: 65, success: 61, failed: 4, successRate: 94, lastAccess: '12/11/2025 14:35' },
  { uid: 'user002', name: 'Siti Nurhaliza', total: 54, success: 52, failed: 2, successRate: 96, lastAccess: '12/11/2025 14:28' },
  { uid: 'user003', name: 'Rinto Harahap', total: 42, success: 38, failed: 4, successRate: 90, lastAccess: '12/11/2025 14:15' },
  { uid: 'user004', name: 'Dewi Lestari', total: 48, success: 46, failed: 2, successRate: 96, lastAccess: '12/11/2025 13:52' },
  { uid: 'user005', name: 'Ahmad Rizaldi', total: 42, success: 40, failed: 2, successRate: 95, lastAccess: '12/10/2025 16:45' },
  { uid: 'user006', name: 'Ratna Wijaya', total: 38, success: 36, failed: 2, successRate: 95, lastAccess: '12/10/2025 15:30' },
])
</script>
