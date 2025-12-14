import { ref } from 'vue'
import { supabase } from '../supabase'

const users = ref([])
const loading = ref(false)
const error = ref(null)

export function useUsers() {
  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('userdata')
        .select('*')
        .order('name', { ascending: true })

      if (err) throw err
      // map in a friendly `dateAdded` field if the DB has timestamps
      users.value = (data || []).map(u => ({
        ...u,
        dateAdded: u.created_at || u.inserted_at || ''
      }))
    } catch (err) {
      console.warn('[useUsers] fetchUsers error', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const createUser = async (user) => {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase
        .from('userdata')
        .insert([user])
      if (err) throw err
      await fetchUsers()
      return { ok: true }
    } catch (err) {
      console.warn('[useUsers] createUser error', err)
      error.value = err
      return { error: err }
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (uid, updates) => {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase
        .from('userdata')
        .update(updates)
        .eq('uid', uid)
      if (err) throw err
      await fetchUsers()
      return { ok: true }
    } catch (err) {
      console.warn('[useUsers] updateUser error', err)
      error.value = err
      return { error: err }
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (uid) => {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase
        .from('userdata')
        .delete()
        .eq('uid', uid)
      if (err) throw err
      await fetchUsers()
      return { ok: true }
    } catch (err) {
      console.warn('[useUsers] deleteUser error', err)
      error.value = err
      return { error: err }
    } finally {
      loading.value = false
    }
  }

  // Realtime subscription to keep UI in sync
  const subscribe = () => {
    try {
      const channel = supabase
        .channel('public:userdata')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'userdata' }, () => {
          fetchUsers()
        })
        .subscribe()

      return () => {
        if (channel) supabase.removeChannel(channel)
      }
    } catch (err) {
      console.warn('[useUsers] subscribe error', err)
      return () => {}
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    subscribe,
  }
}

export default useUsers
