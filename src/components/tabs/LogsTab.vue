<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Log Akses Pintu</h2>
        <p class="text-gray-500 text-sm mt-1">Pantau semua aktivitas akses pintu</p>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="font-semibold text-gray-900 mb-4">Filter & Pencarian</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
          <input 
            v-model="filterStartDate"
            type="date" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
          <input 
            v-model="filterEndDate"
            type="date" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">User/UID</label>
          <input 
            v-model="filterUserId"
            type="text" 
            placeholder="Cari user..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filterLogStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Semua Status</option>
            <option value="sukses">Sukses</option>
            <option value="gagal">Gagal</option>
          </select>
        </div>
        <div class="flex items-end gap-2">
          <button @click="resetLogFilters" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium">
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-500 text-sm font-medium">Total Log</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ totalLogsAnimated }}</p>
        <p class="text-xs text-gray-600 mt-2">{{ logStats.todayLogs }} log hari ini</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-500 text-sm font-medium">Sukses</p>
        <p class="text-3xl font-bold text-green-600 mt-2">{{ successLogsAnimated }}</p>
        <p class="text-xs text-green-600 mt-2">{{ successPercentageAnimated }}%</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-500 text-sm font-medium">Gagal</p>
        <p class="text-3xl font-bold text-red-600 mt-2">{{ failedLogsAnimated }}</p>
        <p class="text-xs text-red-600 mt-2">{{ failedPercentageAnimated }}%</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-500 text-sm font-medium">User Aktif</p>
        <p class="text-3xl font-bold text-blue-600 mt-2">{{ activeUsersAnimated }}</p>
        <p class="text-xs text-blue-600 mt-2">Minggu ini</p>
      </div>
    </div>

    <!-- Search and Sort -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input 
          v-model="searchLog"
          type="text" 
          placeholder="Cari pesan log..." 
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <select v-model="sortLogBy" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlamam</option>
          <option value="user">User</option>
          <option value="status">Status</option>
        </select>

      </div>

      <!-- Log Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 text-sm">No</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 text-sm">Waktu</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 text-sm">User</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 text-sm">UID</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 text-sm">Status</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 text-sm">Pesan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(log, index) in paginatedLogs" :key="index" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 text-sm text-gray-600">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 font-mono">{{ log.time }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.uid}`" :alt="log.userName" class="w-8 h-8 rounded-full">
                  <span class="font-medium text-gray-900">{{ log.userName }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 font-mono">{{ log.uid }}</td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  log.status === 'sukses'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ log.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ log.message }}</td>
            </tr>
            <tr v-if="filteredLogs.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                <p>Tidak ada log yang sesuai dengan filter</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredLogs.length > 0" class="mt-6 flex items-center justify-between">
        <p class="text-sm text-gray-600">
          Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredLogs.length) }} dari {{ filteredLogs.length }} log
        </p>
        <div class="flex space-x-2">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Sebelumnya
          </button>
          <div class="flex items-center space-x-1">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-2 rounded-lg font-medium transition',
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Berikutnya →
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCountUp } from '../../composables/useCountUp'

const filterStartDate = ref('')
const filterEndDate = ref('')
const filterUserId = ref('')
const filterLogStatus = ref('')
const searchLog = ref('')
const sortLogBy = ref('newest')
const itemsPerPage = ref('25')
const currentPage = ref(1)

const logStats = ref({
  totalLogs: 342,
  todayLogs: 18,
  successLogs: 322,
  failedLogs: 20,
  successPercentage: 94,
  failedPercentage: 6,
  activeUsers: 12,
})

// animated stats
const totalLogsAnimated = useCountUp(computed(() => logStats.value.totalLogs), { duration: 900 })
const successLogsAnimated = useCountUp(computed(() => logStats.value.successLogs), { duration: 900 })
const failedLogsAnimated = useCountUp(computed(() => logStats.value.failedLogs), { duration: 900 })
const activeUsersAnimated = useCountUp(computed(() => logStats.value.activeUsers), { duration: 900 })
const successPercentageAnimated = useCountUp(computed(() => logStats.value.successPercentage), { duration: 900 })
const failedPercentageAnimated = useCountUp(computed(() => logStats.value.failedPercentage), { duration: 900 })

const allLogs = ref([
  { time: '12/11/2025 14:35:22', uid: 'user001', userName: 'Budi Santoso', status: 'sukses', message: 'Pintu dibuka dengan PIN' },
  { time: '12/11/2025 14:28:15', uid: 'user002', userName: 'Siti Nurhaliza', status: 'sukses', message: 'Pintu dibuka dengan RFID' },
  { time: '12/11/2025 14:15:47', uid: 'user003', userName: 'Rinto Harahap', status: 'gagal', message: 'PIN salah (Percobaan 3)' },
  { time: '12/11/2025 14:05:33', uid: 'user001', userName: 'Budi Santoso', status: 'sukses', message: 'Pintu dibuka dengan PIN' },
  { time: '12/11/2025 13:52:09', uid: 'user004', userName: 'Dewi Lestari', status: 'sukses', message: 'Pintu dibuka dengan RFID' },
  { time: '12/11/2025 13:40:22', uid: 'user005', userName: 'Ahmad Rizaldi', status: 'gagal', message: 'UID tidak terdaftar' },
  { time: '12/11/2025 13:25:15', uid: 'user006', userName: 'Ratna Wijaya', status: 'sukses', message: 'Pintu dibuka dengan PIN' },
  { time: '12/11/2025 13:10:47', uid: 'user002', userName: 'Siti Nurhaliza', status: 'sukses', message: 'Pintu dibuka dengan RFID' },
  { time: '12/10/2025 16:45:33', uid: 'user001', userName: 'Budi Santoso', status: 'sukses', message: 'Pintu dibuka dengan PIN' },
  { time: '12/10/2025 16:20:09', uid: 'user003', userName: 'Rinto Harahap', status: 'gagal', message: 'User tidak aktif' },
  { time: '12/10/2025 16:05:22', uid: 'user004', userName: 'Dewi Lestari', status: 'sukses', message: 'Pintu dibuka dengan RFID' },
  { time: '12/10/2025 15:45:15', uid: 'user005', userName: 'Ahmad Rizaldi', status: 'sukses', message: 'Pintu dibuka dengan RFID' },
  { time: '12/10/2025 15:30:47', uid: 'user006', userName: 'Ratna Wijaya', status: 'gagal', message: 'PIN salah (Percobaan 1)' },
  { time: '12/10/2025 15:15:33', uid: 'user002', userName: 'Siti Nurhaliza', status: 'sukses', message: 'Pintu dibuka dengan PIN' },
  { time: '12/10/2025 15:00:09', uid: 'user001', userName: 'Budi Santoso', status: 'sukses', message: 'Pintu dibuka dengan RFID' },
  { time: '12/09/2025 14:45:22', uid: 'user003', userName: 'Rinto Harahap', status: 'sukses', message: 'Pintu dibuka dengan PIN' },
  { time: '12/09/2025 14:30:15', uid: 'user004', userName: 'Dewi Lestari', status: 'sukses', message: 'Pintu dibuka dengan RFID' },
  { time: '12/09/2025 14:15:47', uid: 'user005', userName: 'Ahmad Rizaldi', status: 'gagal', message: 'UID tidak terdaftar' },
  { time: '12/09/2025 14:00:33', uid: 'user006', userName: 'Ratna Wijaya', status: 'sukses', message: 'Pintu dibuka dengan PIN' },
  { time: '12/09/2025 13:45:09', uid: 'user002', userName: 'Siti Nurhaliza', status: 'sukses', message: 'Pintu dibuka dengan RFID' },
])

const resetLogFilters = () => {
  filterStartDate.value = ''
  filterEndDate.value = ''
  filterUserId.value = ''
  filterLogStatus.value = ''
  searchLog.value = ''
  sortLogBy.value = 'newest'
  currentPage.value = 1
}

// Helper: parse log time string 'dd/mm/yyyy hh:mm:ss' to Date
const parseLogTime = (timeStr) => {
  // Supports formats: 'dd/mm/yyyy hh:mm:ss' and 'yyyy-mm-dd hh:mm:ss' and ISO
  const [datePart, timePart] = timeStr.split(' ')
  if (!datePart) return new Date(timeStr)
  let year, month, day
  if (datePart.includes('/')) {
    // dd/mm/yyyy
    [day, month, year] = datePart.split('/').map(Number)
  } else if (datePart.includes('-')) {
    // yyyy-mm-dd
    [year, month, day] = datePart.split('-').map(Number)
  } else {
    return new Date(timeStr)
  }
  const [hour = 0, minute = 0, second = 0] = (timePart || '').split(':').map(Number)
  return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0)
}

// Helper: parse input date 'YYYY-MM-DD' to start/end Date objects
const parseInputDateStart = (dateStr) => {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0)
}
const parseInputDateEnd = (dateStr) => {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 23, 59, 59, 999)
}

// Strip time, return a date-only (midnight) object for safer comparisons
const dateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

const filteredLogs = computed(() => {
  let result = [...allLogs.value]

  // Date range filter
  let startDate = parseInputDateStart(filterStartDate.value)
  let endDate = parseInputDateEnd(filterEndDate.value)
  // Handle reversed dates by swapping
  if (startDate && endDate && startDate > endDate) {
    const tmp = startDate
    startDate = endDate
    endDate = tmp
  }

  if (startDate || endDate) {
    const startOnly = startDate ? dateOnly(startDate) : null
    const endOnly = endDate ? dateOnly(endDate) : null
    result = result.filter(log => {
      const logDate = parseLogTime(log.time)
      const logOnly = dateOnly(logDate)
      if (startOnly && endOnly) return logOnly >= startOnly && logOnly <= endOnly
      if (startOnly) return logOnly >= startOnly
      if (endOnly) return logOnly <= endOnly
      return true
    })
  }

  if (filterUserId.value) {
    result = result.filter(log =>
      log.uid.toLowerCase().includes(filterUserId.value.toLowerCase()) ||
      log.userName.toLowerCase().includes(filterUserId.value.toLowerCase())
    )
  }

  if (filterLogStatus.value) {
    result = result.filter(log => log.status === filterLogStatus.value)
  }

  if (searchLog.value) {
    const query = searchLog.value.toLowerCase()
    result = result.filter(log => log.message.toLowerCase().includes(query))
  }

  // Sorting with parseLogTime
  if (sortLogBy.value === 'newest') {
    result.sort((a, b) => parseLogTime(b.time) - parseLogTime(a.time))
  } else if (sortLogBy.value === 'oldest') {
    result.sort((a, b) => parseLogTime(a.time) - parseLogTime(b.time))
  } else if (sortLogBy.value === 'user') {
    result.sort((a, b) => a.userName.localeCompare(b.userName))
  } else if (sortLogBy.value === 'status') {
    result.sort((a, b) => a.status.localeCompare(b.status))
  }

  return result
})

// Reset to page 1 when filters change
watch([filterStartDate, filterEndDate, filterUserId, filterLogStatus, searchLog, sortLogBy, itemsPerPage], () => {
  currentPage.value = 1
})

const totalPages = computed(() => {
  return Math.ceil(filteredLogs.value.length / parseInt(itemsPerPage.value))
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * parseInt(itemsPerPage.value)
  const end = start + parseInt(itemsPerPage.value)
  return filteredLogs.value.slice(start, end)
})
</script>
