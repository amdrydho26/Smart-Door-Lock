import { ref } from 'vue'
import { supabase } from '../supabase'

const STORAGE_KEY = 'isLoggedIn'

const isLoggedIn = ref(Boolean(localStorage.getItem(STORAGE_KEY)))
const user = ref(null)

// Initialize auth state immediately
async function initAuth() {
  try {
    const { data } = await supabase.auth.getSession()
    const session = data?.session ?? null
    console.log('[useAuth] init getSession', { session })
    if (session?.user) {
      user.value = session.user
      isLoggedIn.value = true
      localStorage.setItem(STORAGE_KEY, '1')
    } else {
      user.value = null
      isLoggedIn.value = false
    }
  } catch (err) {
    console.warn('[useAuth] init getSession failed', err)
  }

  // Subscribe to auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('[useAuth] onAuthStateChange', { event, session })
    if (session?.user) {
      user.value = session.user
      isLoggedIn.value = true
      localStorage.setItem(STORAGE_KEY, '1')
    } else {
      user.value = null
      isLoggedIn.value = false
      localStorage.removeItem(STORAGE_KEY)
    }
  })
}

// Run init immediately
initAuth()

export function useAuth() {
  const login = async ({ email, password } = {}) => {
    if (!email || !password) return { error: new Error('Email and password required') }
    console.log('[useAuth] login attempt', { email })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      console.log('[useAuth] signInWithPassword result', { data, error })
      if (error) return { error }
      // If user or session present, set local flag (onAuthStateChange will also sync)
      if (data?.user || data?.session) {
        user.value = data.user || data.session?.user || null
        isLoggedIn.value = Boolean(user.value)
        if (isLoggedIn.value) localStorage.setItem(STORAGE_KEY, '1')
      }
      return { data, error }
    } catch (err) {
      console.warn('[useAuth] login error', err)
      return { error: err }
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.warn('[useAuth] signOut error', error)
        // proceed to local cleanup anyway
      }
    } catch (err) {
      console.warn('[useAuth] signOut thrown', err)
    } finally {
      user.value = null
      isLoggedIn.value = false
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const isAuthenticated = () => isLoggedIn.value

  return { isLoggedIn, user, login, logout, isAuthenticated }
}
