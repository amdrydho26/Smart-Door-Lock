<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Analitik & Statistik</h2>
          <p class="text-gray-500 text-sm mt-1">Laporan penggunaan dan analisis pintu pintar</p>
        </div>
      </div>
    </div>


    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <p class="text-blue-600 text-sm font-medium">Total Akses</p>
        <p class="text-3xl font-bold text-blue-900 mt-2">{{ totalAccessAnimated }}</p>
        <p class="text-xs text-blue-600 mt-2">↑ 12% dari minggu lalu</p>
      </div>
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <p class="text-green-600 text-sm font-medium">Akses Berhasil</p>
        <p class="text-3xl font-bold text-green-900 mt-2">{{ successCountAnimated }}</p>
        <p class="text-xs text-green-600 mt-2">{{ successPercentageAnimated }}% tingkat berhasil</p>
      </div>
      <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <p class="text-red-600 text-sm font-medium">Akses Gagal</p>
        <p class="text-3xl font-bold text-red-900 mt-2">{{ failedCountAnimated }}</p>
        <p class="text-xs text-red-600 mt-2">{{ failedPercentageAnimated }}% tingkat kegagalan</p>
      </div>
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <p class="text-purple-600 text-sm font-medium">User Active</p>
        <p class="text-3xl font-bold text-purple-900 mt-2">{{ activeUsersAnimated }}</p>
        <p class="text-xs text-purple-600 mt-2">Minggu ini</p>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Grafik Penggunaan Pintu Harian -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Penggunaan Pintu (Per Hari)</h3>
        <div class="h-100 flex items-end justify-end gap-3 pt-6">
          <template v-if="hasChartData">
            <div v-for="(day, index) in dailyUsage" :key="index" class="flex-1 flex flex-col items-center group">
              <div class="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-lg transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-600" :style="{ height: mounted ? `${(day.value / maxDaily) * 300}px` : '0px', transition: 'height 900ms cubic-bezier(.22,1,.36,1)' }"></div>
              <p class="text-xs text-gray-600 mt-2 font-medium">{{ day.day }}</p>
              <p class="text-xs text-gray-500">{{ day.value }}</p>
            </div>
          </template>
          <div v-else class="w-full text-center text-sm text-gray-500 py-12">
            Tidak ada data waktu (harian) untuk ditampilkan.
            <div class="mt-3 text-xs text-gray-400">Jika grafik kosong, periksa format `time` pada contoh `sampleLogs`.</div>
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

            <!-- Filled area under line (dynamic) -->
            <polygon :points="areaPoints" fill="url(#chartGradient)" />

            <!-- Line chart (dynamic) -->
            <polyline :points="linePoints" fill="none" stroke="#3B82F6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

            <!-- Data points (dynamic) -->
            <circle v-for="(p, i) in pointsData" :key="i" :cx="p.x" :cy="p.y" r="4" fill="#3B82F6" stroke="white" stroke-width="2" />

            <!-- X axis labels (dynamic) -->
            <text v-for="(p, i) in pointsData" :key="'lbl-'+i" :x="p.x" y="295" text-anchor="middle" font-size="12" fill="#666">{{ p.time }}</text>
            
            <!-- Y axis labels -->
            <text x="20" y="275" text-anchor="end" font-size="11" fill="#666">0</text>
            <text x="20" y="245" text-anchor="end" font-size="11" fill="#666">5</text>
            <text x="20" y="185" text-anchor="end" font-size="11" fill="#666">10</text>
            <text x="20" y="125" text-anchor="end" font-size="11" fill="#666">15</text>
            <text x="20" y="65" text-anchor="end" font-size="11" fill="#666">20</text>
          </svg>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <p class="text-xs text-gray-600">Trend Akses:
            <span :class="[
              'font-bold',
              accessTrend.dir === 'up' ? 'text-green-600' : accessTrend.dir === 'down' ? 'text-red-600' : 'text-gray-600'
            ]">
              {{ accessTrend.text }}
            </span>
            <span class="text-xs text-gray-400 ml-2">vs hari sebelumnya</span>
          </p>
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
              <div class="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full transition-all duration-300 group-hover:from-amber-500 group-hover:to-amber-600" :style="{ width: mounted ? `${(hour.count / (busyMax || 1)) * 100}%` : '0%', transition: 'width 900ms cubic-bezier(.22,1,.36,1)' }"></div>
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
          <p class="text-sm text-gray-600 mb-2">Tingkat Keberhasilan</p>
          <p class="text-2xl font-bold text-green-600">{{ analyticsData.successPercentage }}%</p>
          <p class="text-xs text-gray-500 mt-1">Sistem bekerja dengan sangat baik</p>
        </div>
        <div class="bg-white rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-2">Rata-rata Akses/Hari</p>
          <p class="text-2xl font-bold text-blue-600">{{ avgDailyAnimated }}</p>
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
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Berhasil</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Gagal</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Tingkat Berhasil</th>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useCountUp } from '../../composables/useCountUp'
import useLogs from '../../composables/useLogs'
import { useUsers } from '../../composables/useUsers'
import { isSuccess } from '../../utils/formatStatus'
import parseLogTime from '../../utils/parseLogTime'

const { logs, fetchLogs, subscribe: subscribeLogs, unsubscribe: unsubscribeLogs } = useLogs()
const { users, fetchUsers } = useUsers()

const analyticsData = ref({
  totalAccess: 0,
  successCount: 0,
  failedCount: 0,
  successPercentage: 0,
  failedPercentage: 0,
  activeUsers: 0,
  avgDaily: 0,
})

// Animated counters
const totalAccessAnimated = useCountUp(computed(() => analyticsData.value.totalAccess), { duration: 900 })
const successCountAnimated = useCountUp(computed(() => analyticsData.value.successCount), { duration: 900 })
const failedCountAnimated = useCountUp(computed(() => analyticsData.value.failedCount), { duration: 900 })
const activeUsersAnimated = useCountUp(computed(() => analyticsData.value.activeUsers), { duration: 900 })
const successPercentageAnimated = useCountUp(computed(() => analyticsData.value.successPercentage), { duration: 900 })
const failedPercentageAnimated = useCountUp(computed(() => analyticsData.value.failedPercentage), { duration: 900 })
const avgDailyAnimated = useCountUp(computed(() => analyticsData.value.avgDaily), { duration: 900, decimals: 0 })

const mounted = ref(false)

// Removed range selector and debug toggle; analytics show all-time by default

const sumDaily = computed(() => dailyUsage.value.reduce((s, d) => s + (d.value || 0), 0))
const hasChartData = computed(() => sumDaily.value > 0 || (hourlyUsage.value && hourlyUsage.value.some(h => h.value > 0)))

onMounted(() => {
  setTimeout(() => { mounted.value = true }, 60)
})

// Use shared parser to ensure consistent local-time parsing across the app
// (see src/utils/parseLogTime.js)



const formatDateTime = (d) => {
  if (!d || isNaN(d)) return '—'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const mn = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${mn}:${ss}`
}

// Compute analytics from `logs.value` and `users.value`
// shared reactive datasets (initialized early so computeAnalytics can run immediately)
const dailyUsage = ref([
  { day: 'Senin', value: 0 },
  { day: 'Selasa', value: 0 },
  { day: 'Rabu', value: 0 },
  { day: 'Kamis', value: 0 },
  { day: 'Jumat', value: 0 },
  { day: 'Sabtu', value: 0 },
  { day: 'Minggu', value: 0 },
])
const hourlyUsage = ref(Array.from({ length: 24 }, (_, i) => ({ time: `${String(i).padStart(2,'0')}:00`, value: 0 })))
const busyHours = ref([])
const topUsers = ref([])
const detailedStats = ref([])

const dayNames = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']

function computeAnalytics() {
  const all = (logs.value || []).slice()
  const total = all.length
  const success = all.filter(l => isSuccess(l.status)).length
  const failed = total - success
  // debug
  console.debug('[Analytics] computeAnalytics start', { total, success, failed, logsCount: all.length })

  // Choose a 7-day window. Prefer the last log date (last 7 days ending at last log),
  // falling back to the current week if no logs exist.
  // All-time window: use min/max of parsed log dates when available
  const parsedDates = all.map(l => parseLogTime(l.time)).filter(d => !isNaN(d))
  let windowStart, windowEnd
  if (parsedDates.length > 0) {
    const minDate = new Date(Math.min(...parsedDates.map(d => d.getTime())))
    const maxDate = new Date(Math.max(...parsedDates.map(d => d.getTime())))
    windowStart = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0, 0, 0)
    windowEnd = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59, 999)
  } else {
    const now = new Date()
    windowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23,59,59,999)
    windowStart = new Date(windowEnd.getFullYear(), windowEnd.getMonth(), windowEnd.getDate() - 6, 0,0,0,0)
  }

  // Active users within chosen window
  const uids = new Set()
  for (const l of all) {
    const d = parseLogTime(l.time)
    if (!isNaN(d) && d >= windowStart && d <= windowEnd) uids.add(l.uid)
  }

  // Daily usage for the chosen 7-day window
  let daily = []
  for (let i = 0; i < 7; i++) {
    const dt = new Date(windowStart.getFullYear(), windowStart.getMonth(), windowStart.getDate() + i)
    const count = all.filter(l => {
      const d = parseLogTime(l.time)
      return !isNaN(d) && d >= new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0,0,0,0) && d <= new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 23,59,59,999)
    }).length
    daily.push({ day: dayNames[dt.getDay()], value: count })
  }

  // using all-time window

  // Hourly usage aggregated across the week (Mon-Sun)
  const weekStart = windowStart
  const weekEnd = windowEnd
  let hourBuckets = Array.from({ length: 24 }, (_, h) => ({ time: `${String(h).padStart(2,'0')}:00`, value: 0 }))
  for (const l of all) {
    const d = parseLogTime(l.time)
    if (isNaN(d)) continue
    if (d >= weekStart && d <= weekEnd) {
      hourBuckets[d.getHours()].value++
    }
  }

  const parsedCount = all.reduce((acc, l) => !isNaN(parseLogTime(l.time)) ? acc + 1 : acc, 0)
  const inWeekCount = all.reduce((acc, l) => {
    const d = parseLogTime(l.time)
    return (!isNaN(d) && d >= weekStart && d <= weekEnd) ? acc + 1 : acc
  }, 0)


  const sumDaily = daily.reduce((s, d) => s + d.value, 0)
  if (sumDaily === 0 && total > 0) {
    // fallback: use last 7 days ending at last log date and aggregate hourly across that week
    const lastDates = all.map(l => parseLogTime(l.time)).filter(d => !isNaN(d))
    const lastDate = new Date(Math.max(...lastDates.map(d => d.getTime())))
    const lastDayStart = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())
    daily = []
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(lastDayStart.getFullYear(), lastDayStart.getMonth(), lastDayStart.getDate() - i)
      const count = all.filter(l => {
        const d = parseLogTime(l.time)
        return !isNaN(d) && d.getFullYear() === dt.getFullYear() && d.getMonth() === dt.getMonth() && d.getDate() === dt.getDate()
      }).length
      daily.push({ day: dayNames[dt.getDay()], value: count })
    }
    // rebuild week hourBuckets for last 7 days ending at lastDayStart
    const newWeekStart = new Date(lastDayStart.getFullYear(), lastDayStart.getMonth(), lastDayStart.getDate() - 6)
    const newWeekEnd = new Date(lastDayStart.getFullYear(), lastDayStart.getMonth(), lastDayStart.getDate(), 23, 59, 59, 999)
    const hb = Array.from({ length: 24 }, (_, h) => ({ time: `${String(h).padStart(2,'0')}:00`, value: 0 }))
    for (const l of all) {
      const d = parseLogTime(l.time)
      if (isNaN(d)) continue
      if (d >= newWeekStart && d <= newWeekEnd) hb[d.getHours()].value++
    }
    for (let i = 0; i < 24; i++) hourBuckets[i].value = hb[i].value
    const parsedCountFallback = all.reduce((acc, l) => !isNaN(parseLogTime(l.time)) ? acc + 1 : acc, 0)
    const inFallbackWeek = all.reduce((acc, l) => { const d = parseLogTime(l.time); return (!isNaN(d) && d >= newWeekStart && d <= newWeekEnd) ? acc + 1 : acc }, 0)
    // fallback: used last 7 days ending at last log date
  }

  // Busy hours (top 6 by count) with 2-hour ranges
  const hourlyCounts = hourBuckets.map((h, i) => ({ time: `${String(i).padStart(2,'0')}:00 - ${String((i+2)%24).padStart(2,'0')}:00`, count: h.value }))
  hourlyCounts.sort((a,b) => b.count - a.count)
  const busy = hourlyCounts.slice(0,6)

  // Top users by total accesses
  const countsByUser = {}
  for (const l of all) countsByUser[l.uid] = (countsByUser[l.uid] || 0) + 1
  const usersList = (users.value || [])
  const top = Object.keys(countsByUser).map(uid => ({ uid, count: countsByUser[uid], name: (usersList.find(u=>u.uid===uid)||{}).name || uid }))
    .sort((a,b) => b.count - a.count)
    .slice(0,6)

  // Detailed stats per user (limit to users list)
  const detailed = (usersList || []).map(u => {
    const uid = u.uid
    const userLogs = all.filter(l => l.uid === uid).slice()
    userLogs.sort((a,b) => parseLogTime(b.time) - parseLogTime(a.time))
    const totalU = userLogs.length
    const succ = userLogs.filter(l => isSuccess(l.status)).length
    const fail = totalU - succ
    const rate = totalU ? Math.round((succ/totalU)*100) : 0
    return {
      uid,
      name: u.name || uid,
      total: totalU,
      success: succ,
      failed: fail,
      successRate: rate,
      lastAccess: userLogs[0] ? formatDateTime(parseLogTime(userLogs[0].time)) : '—'
    }
  }).sort((a,b) => b.total - a.total)

  // average per day across the window (all-time window)
  let avgDaily = 0
  if (parsedDates.length) {
    const minD = new Date(Math.min(...parsedDates.map(d => d.getTime())))
    const maxD = new Date(Math.max(...parsedDates.map(d => d.getTime())))
    const days = Math.max(1, Math.round((maxD - minD) / (24 * 3600 * 1000)) + 1)
    avgDaily = Math.round(total / days)
  }

  // Assign to reactive refs
  analyticsData.value.totalAccess = total
  analyticsData.value.successCount = success
  analyticsData.value.failedCount = failed
  analyticsData.value.successPercentage = total ? Math.round((success/total)*100) : 0
  analyticsData.value.failedPercentage = total ? 100 - analyticsData.value.successPercentage : 0
  analyticsData.value.activeUsers = uids.size
  analyticsData.value.avgDaily = avgDaily

  dailyUsage.value = daily
  hourlyUsage.value = hourBuckets
  busyHours.value = busy
  topUsers.value = top
  detailedStats.value = detailed
}

// Recompute when logs or users change
watch([logs, users], () => {
  try {
    computeAnalytics()
  } catch (e) {
    console.error('computeAnalytics failed', e)
  }
}, { immediate: true })

onMounted(async () => {
  await fetchUsers()
  // fetch all logs (no limit)
  await fetchLogs({ limit: null, sortBy: 'newest' })
  subscribeLogs()
  // ensure mounted animations
  setTimeout(() => { mounted.value = true }, 60)
})



onBeforeUnmount(() => {
  try { unsubscribeLogs() } catch (e) {}
})


const maxDaily = computed(() => Math.max(...dailyUsage.value.map(d => d.value), 1))

const barScale = (val) => {
  return (val / maxDaily.value) * 100
}

const busyMax = computed(() => busyHours.value && busyHours.value.length ? Math.max(...busyHours.value.map(h => h.count), 1) : 1)


const avgHourlyAccess = computed(() => {
  return Math.round(hourlyUsage.value.reduce((sum, h) => sum + h.value, 0) / hourlyUsage.value.length)
})

const accessTrend = computed(() => {
  // Compare last 7 days vs previous 7 days (14-day window ending at last log date)
  const all = (logs.value || []).slice()
  const parsedDates = all.map(l => parseLogTime(l.time)).filter(d => !isNaN(d))
  if (parsedDates.length === 0) return { dir: 'stable', text: '— Stabil', percent: 0 }

  const lastDate = new Date(Math.max(...parsedDates.map(d => d.getTime())))
  const endDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())

  const counts = []
  for (let i = 0; i < 14; i++) {
    const dt = new Date(endDay.getFullYear(), endDay.getMonth(), endDay.getDate() - i)
    const start = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0,0,0,0)
    const end = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 23,59,59,999)
    const count = all.reduce((acc, l) => {
      const d = parseLogTime(l.time)
      return (!isNaN(d) && d >= start && d <= end) ? acc + 1 : acc
    }, 0)
    counts.unshift(count) // oldest first
  }

  const prev7 = counts.slice(0,7).reduce((s,v)=>s+v,0)
  const last7 = counts.slice(7).reduce((s,v)=>s+v,0)

  if (prev7 === 0) {
    if (last7 === 0) return { dir: 'stable', text: '— Stabil', percent: 0 }
    return { dir: 'up', text: `↑ ${last7} (new)`, percent: 100 }
  }

  const pct = Math.round(((last7 - prev7) / prev7) * 100)
  if (pct > 0) return { dir: 'up', text: `↑ ${pct}% Meningkat`, percent: pct }
  if (pct < 0) return { dir: 'down', text: `↓ ${Math.abs(pct)}% Menurun`, percent: Math.abs(pct) }
  return { dir: 'stable', text: '— Stabil', percent: 0 }
})

const chartConfig = {
  width: 800,
  height: 300,
  left: 40,
  right: 760,
  top: 30,
  bottom: 270,
}

const scaleMax = computed(() => {
  const maxVal = Math.max(...hourlyUsage.value.map(h => h.value))
  return Math.max(20, Math.ceil(maxVal / 5) * 5)
})

const pointsData = computed(() => {
  const left = chartConfig.left
  const right = chartConfig.right
  const top = chartConfig.top
  const bottom = chartConfig.bottom
  const drawableHeight = bottom - top
  const n = hourlyUsage.value.length
  const step = n > 1 ? (right - left) / (n - 1) : 0
  const max = scaleMax.value
  return hourlyUsage.value.map((h, idx) => {
    const x = left + idx * step
    const y = bottom - (h.value / max) * drawableHeight
    return { x, y, time: h.time, value: h.value }
  })
})

const linePoints = computed(() => pointsData.value.map(p => `${p.x},${p.y}`).join(' '))

const areaPoints = computed(() => {
  if (!pointsData.value.length) return ''
  const pts = pointsData.value.map(p => `${p.x},${p.y}`).join(' ')
  const left = chartConfig.left
  const right = chartConfig.right
  const bottom = chartConfig.bottom
  return `${pts} ${right},${bottom} ${left},${bottom}`
})

watch(logs, () => {
  console.log(
    'parsed date test:',
    logs.value.slice(0,3).map(l => parseLogTime(l))
  )
})
watch(logs, () => {
  console.log('RAW LOG SAMPLE:', logs.value[0])
}, { immediate: true })


</script>
