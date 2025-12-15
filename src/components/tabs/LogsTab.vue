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
            <option value="sukses">Berhasil</option>
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
    <div v-if="logsLoading" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">Memuat log... (cek konsol untuk detail)</div>
    <div v-if="logsError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
      Gagal memuat log: {{ logsError.message || String(logsError) }}
      <button @click="loadLogs" class="ml-3 px-3 py-1 border rounded bg-white text-sm">Muat Ulang</button>
    </div>
    <div v-if="!logsLoading && !logsError" class="text-xs text-gray-500 mt-2">Terakhir dimuat: {{ lastFetchedAt || '—' }} — {{ lastFetchedCount || 0 }} baris</div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-500 text-sm font-medium">Total Log</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ totalLogsAnimated }}</p>
        <p class="text-xs text-gray-600 mt-2">{{ todayLogs }} log hari ini</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-500 text-sm font-medium">Berhasil</p>
        <p class="text-3xl font-bold text-green-600 mt-2">{{ successLogsAnimated }}</p>
        <p class="text-xs text-green-600 mt-2">{{ successPercentageAnimated }}%</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-500 text-sm font-medium">Gagal</p>
        <p class="text-3xl font-bold text-red-600 mt-2">{{ failedLogsAnimated }}</p>
        <p class="text-xs text-red-600 mt-2">{{ failedPercentageAnimated }}%</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-500 text-sm font-medium">User Active</p>
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
          <option value="oldest">Terlama</option>
          <option value="user">User</option>
          <option value="status">Status</option>
        </select>

      </div>

      <div class="flex items-center justify-between mb-4">
        <div class="text-xs text-gray-500">Debug: terakhir dimuat {{ lastFetchedCount || 0 }} baris pada {{ lastFetchedAt || '—' }}</div>
        <div>
          <button @click="toggleSample" class="px-2 py-1 mr-2 text-xs border rounded">Tampilkan contoh data</button>
          <button @click="loadLogs" class="px-2 py-1 text-xs border rounded">Muat Sekarang</button>
        </div>
      </div>

      <div v-if="!logsLoading && !logsError && lastFetchedCount === 0" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        Tidak ada data log yang diterima. Periksa bahwa `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` ada di `.env.local`, dan periksa kebijakan RLS di Supabase (pastikan `SELECT` untuk `anon` diperbolehkan sementara).
      </div>

      <div v-if="showSample" class="mb-4 overflow-auto bg-gray-50 p-3 rounded text-xs">
        <pre class="whitespace-pre-wrap">{{ JSON.stringify(logs.slice(0,5), null, 2) }}</pre>
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
                  isSuccess(log.status)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ formatStatus(log.status) }}
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
              v-if="showPrevEllipsis"
              @click="currentPage = 1"
              class="px-3 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              1
            </button>
            <span v-if="showPrevEllipsis" class="px-2">…</span>

            <button
              v-for="page in visiblePages"
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

            <span v-if="showNextEllipsis" class="px-2">…</span>
            <button
              v-if="showNextEllipsis"
              @click="currentPage = totalPages"
              class="px-3 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {{ totalPages }}
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
import { ref, computed, watch, onMounted } from 'vue'
import { useCountUp } from '../../composables/useCountUp'
import useLogs from '../../composables/useLogs'
import { isSuccess, formatStatus } from '../../utils/formatStatus'
import parseLogTime from '../../utils/parseLogTime'

const filterStartDate = ref('')
const filterEndDate = ref('')
const filterUserId = ref('')
const filterLogStatus = ref('')
const searchLog = ref('')
const sortLogBy = ref('newest')
const itemsPerPage = ref(25)
const currentPage = ref(1)

const { logs, loading: logsLoading, error: logsError, fetchLogs, subscribe, lastFetchedAt, lastFetchedCount } = useLogs()

// compute stats from fetched logs
const totalLogs = computed(() => logs.value.length)
const successLogs = computed(() => logs.value.filter(l => isSuccess(l.status)).length)
const failedLogs = computed(() => logs.value.filter(l => !isSuccess(l.status)).length)
const todayLogs = computed(() => {
  const today = new Date()
  const tOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return logs.value.filter(l => {
    try {
      const [datePart] = (l.time || '').split(' ')
      const parts = datePart && datePart.includes('/') ? datePart.split('/') : []
      if (parts.length === 3) {
        const [dd, mm, yyyy] = parts.map(Number)
        const d = new Date(yyyy, mm - 1, dd)
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() === tOnly.getTime()
      }
    } catch (e) {
      return false
    }
    return false
  }).length
})
const activeUsers = computed(() => {
  // Count unique users with activity in the current week (Monday - Sunday)
  const now = new Date()
  const dayIndex = (now.getDay() + 6) % 7 // Monday = 0
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayIndex, 0, 0, 0, 0)
  const uids = new Set()
  for (const l of logs.value) {
    try {
      const d = parseLogTime(l.time)
      if (!isNaN(d) && d >= startOfWeek) uids.add(l.uid)
    } catch (e) {
      // ignore parse errors
    }
  }
  return uids.size
})
const successPercentage = computed(() => (totalLogs.value ? Math.round((successLogs.value / totalLogs.value) * 100) : 0))
const failedPercentage = computed(() => 100 - successPercentage.value)

// animated stats
const totalLogsAnimated = useCountUp(computed(() => totalLogs.value), { duration: 900 })
const successLogsAnimated = useCountUp(computed(() => successLogs.value), { duration: 900 })
const failedLogsAnimated = useCountUp(computed(() => failedLogs.value), { duration: 900 })
const activeUsersAnimated = useCountUp(computed(() => activeUsers.value), { duration: 900 })
const successPercentageAnimated = useCountUp(computed(() => successPercentage.value), { duration: 900 })
const failedPercentageAnimated = useCountUp(computed(() => failedPercentage.value), { duration: 900 })

onMounted(() => {
  // initial fetch
  loadLogs()
  // subscribe for real-time inserts
  subscribe()
})

// debug toggle to show sample JSON
const showSample = ref(false)
function toggleSample () { showSample.value = !showSample.value }


function resetLogFilters () {
  filterStartDate.value = ''
  filterEndDate.value = ''
  filterUserId.value = ''
  filterLogStatus.value = ''
  searchLog.value = ''
  sortLogBy.value = 'newest'
  currentPage.value = 1
  loadLogs()
}

function loadLogs () {
  // use server-side filtering for main set, then client-side pagination
  fetchLogs({
    startDate: filterStartDate.value || undefined,
    endDate: filterEndDate.value || undefined,
    uid: filterUserId.value || undefined,
    status: filterLogStatus.value || undefined,
    search: searchLog.value || undefined,
    sortBy: sortLogBy.value || 'newest',
    limit: 1000,
    offset: 0,
  })
}

// Reset to page 1 when filters change
watch([filterStartDate, filterEndDate, filterUserId, filterLogStatus, searchLog, sortLogBy, itemsPerPage], () => {
  currentPage.value = 1
  loadLogs()
})


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
  let result = [...logs.value]

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
    const desiredSuccess = isSuccess(filterLogStatus.value)
    result = result.filter(log => isSuccess(log.status) === desiredSuccess)
  }

  if (searchLog.value) {
    const query = String(searchLog.value || '').toLowerCase()
    result = result.filter(log => {
      const msg = log.message == null ? '' : String(log.message).toLowerCase()
      const name = log.userName == null ? '' : String(log.userName).toLowerCase()
      const uid = log.uid == null ? '' : String(log.uid).toLowerCase()
      const st = log.status == null ? '' : String(log.status).toLowerCase()
      return msg.includes(query) || name.includes(query) || uid.includes(query) || st.includes(query)
    })
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
  return Math.max(1, Math.ceil(filteredLogs.value.length / parseInt(itemsPerPage.value)))
})

// Limit visible page buttons to avoid overflow (max 10)
const maxVisiblePages = 5
const visiblePages = computed(() => {
  const total = totalPages.value
  if (total <= maxVisiblePages) return Array.from({ length: total }, (_, i) => i + 1)

  let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let end = start + maxVisiblePages - 1
  if (end > total) {
    end = total
    start = total - maxVisiblePages + 1
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const showPrevEllipsis = computed(() => visiblePages.value[0] > 1)
const showNextEllipsis = computed(() => visiblePages.value[visiblePages.value.length - 1] < totalPages.value)

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * parseInt(itemsPerPage.value)
  const end = start + parseInt(itemsPerPage.value)
  return filteredLogs.value.slice(start, end)
})
</script>
