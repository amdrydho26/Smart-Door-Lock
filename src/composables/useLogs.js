import { ref, onUnmounted } from 'vue'
import supabase from '../supabase'

export function useLogs() {
  const logs = ref([])
  const loading = ref(false)
  const error = ref(null)
  const lastFetchedAt = ref(null)
  const lastFetchedCount = ref(0)

  let subscription = null

  const formatRow = (r) => {
    // Normalize fields and produce a parseable `time` string in 'dd/mm/yyyy hh:mm:ss' when possible
    const statusRaw = r.status == null ? '' : String(r.status)
    const status = statusRaw.trim()

    let timeStr = ''
    try {
      // Prefer explicit date column
      if (r.date) {
        const d = new Date(r.date)
        const dd = String(d.getDate()).padStart(2, '0')
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const yyyy = d.getFullYear()
        if (r.time) {
          timeStr = `${dd}/${mm}/${yyyy} ${r.time}`
        } else if (r.created_at) {
          const created = new Date(r.created_at)
          const h = String(created.getHours()).padStart(2, '0')
          const m = String(created.getMinutes()).padStart(2, '0')
          const s = String(created.getSeconds()).padStart(2, '0')
          timeStr = `${dd}/${mm}/${yyyy} ${h}:${m}:${s}`
        } else {
          timeStr = `${dd}/${mm}/${yyyy}`
        }
      } else if (r.created_at) {
        const created = new Date(r.created_at)
        const dd = String(created.getDate()).padStart(2, '0')
        const mm = String(created.getMonth() + 1).padStart(2, '0')
        const yyyy = created.getFullYear()
        const h = String(created.getHours()).padStart(2, '0')
        const m = String(created.getMinutes()).padStart(2, '0')
        const s = String(created.getSeconds()).padStart(2, '0')
        timeStr = `${dd}/${mm}/${yyyy} ${h}:${m}:${s}`
      } else if (r.time) {
        // time without date: attach today's date so parsing & date filters work
        const today = new Date()
        const dd = String(today.getDate()).padStart(2, '0')
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const yyyy = today.getFullYear()
        timeStr = `${dd}/${mm}/${yyyy} ${r.time}`
      } else {
        timeStr = new Date().toLocaleString()
      }
    } catch (e) {
      timeStr = r.time || r.date || r.created_at || ''
    }

    return {
      ...r,
      status: status,
      time: timeStr,
      userName: r.name || r.userName || '',
    }
  }

  async function fetchLogs({ startDate, endDate, uid, status, search, sortBy = 'newest', limit = 500, offset = 0 } = {}) {
    loading.value = true
    error.value = null
    console.debug('[useLogs] fetchLogs params', { startDate, endDate, uid, status, search, sortBy, limit, offset })
    try {
      let q = supabase.from('log').select('*')

      // NOTE: We avoid server-side date filtering because some rows may store date/time in "time" string
      // and not in the `date` column. Date filtering is applied client-side in the component.

      if (uid) {
        q = q.or(`uid.ilike.%${uid}%,name.ilike.%${uid}%`)
      }

      // Status mapping: accept several variants (sukses, berhasil, success, etc.)
      if (status) {
        const STATUS_VARIANTS = {
          sukses: ['sukses', 'berhasil', 'success', 'ok'],
          gagal: ['gagal', 'failed', 'error', 'false', '0']
        }
        const s = String(status || '').trim().toLowerCase()
        // find group by matching value in variants or by key
        let group = null
        if (Object.keys(STATUS_VARIANTS).includes(s)) group = s
        else {
          for (const k of Object.keys(STATUS_VARIANTS)) {
            if (STATUS_VARIANTS[k].includes(s)) { group = k; break }
          }
        }
        if (group) {
          const orExpr = STATUS_VARIANTS[group].map(v => `status.ilike.%${v}%`).join(',')
          q = q.or(orExpr)
        } else {
          // unknown status, do case-insensitive match
          q = q.ilike('status', `%${status}%`)
        }
      }

      if (search) {
        const s = String(search).trim()
        if (s.length) {
          // search across message, name, and uid for better UX
          q = q.or(`message.ilike.%${s}%,name.ilike.%${s}%,uid.ilike.%${s}%`)
        }
      }

      // Sorting: order by date then time
      if (sortBy === 'newest') {
        q = q.order('date', { ascending: false }).order('time', { ascending: false })
      } else if (sortBy === 'oldest') {
        q = q.order('date', { ascending: true }).order('time', { ascending: true })
      } else if (sortBy === 'user') {
        q = q.order('name', { ascending: true })
      } else if (sortBy === 'status') {
        q = q.order('status', { ascending: true })
      }

      if (limit != null) {
        q = q.range(offset, offset + limit - 1)
      }

      const { data, error: e } = await q
      if (e) throw e

      console.debug('[useLogs] fetchLogs result count', (data || []).length)
      lastFetchedCount.value = (data || []).length
      lastFetchedAt.value = new Date().toISOString()
      logs.value = (data || []).map(formatRow)
    } catch (e) {
      error.value = e
      console.error('fetchLogs error', e)
    } finally {
      loading.value = false
    }
  }

  function subscribe() {
    // unsubscribe existing channel safely
    if (subscription && typeof subscription.unsubscribe === 'function') {
      try {
        subscription.unsubscribe()
      } catch (e) {
        console.warn('failed to unsubscribe previous channel', e)
      }
      subscription = null
    }

    subscription = supabase
      .channel('public:log')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'log' }, (payload) => {
        if (payload && payload.new) {
          const newRow = formatRow(payload.new)
          // prepend
          logs.value = [newRow, ...(logs.value || [])]
        }
      })
      .subscribe()
  }

  function unsubscribe() {
    if (subscription) {
      if (typeof subscription.unsubscribe === 'function') {
        try {
          subscription.unsubscribe()
        } catch (e) {
          console.warn('failed to unsubscribe channel', e)
        }
      } else if (typeof supabase.removeChannel === 'function') {
        // fallback for older APIs
        try {
          supabase.removeChannel(subscription)
        } catch (e) {
          console.warn('failed to remove channel via supabase.removeChannel', e)
        }
      }
      subscription = null
    }
  }

  onUnmounted(() => unsubscribe())

  return { logs, loading, error, fetchLogs, subscribe, unsubscribe, lastFetchedAt, lastFetchedCount }
}

export default useLogs
