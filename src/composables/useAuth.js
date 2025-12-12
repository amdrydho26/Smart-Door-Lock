import { ref } from 'vue'

const STORAGE_KEY = 'isLoggedIn'

const isLoggedIn = ref(Boolean(localStorage.getItem(STORAGE_KEY)))

export function useAuth() {
  const login = (opts = {}) => {
    localStorage.setItem(STORAGE_KEY, '1')
    isLoggedIn.value = true
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    isLoggedIn.value = false
  }

  const isAuthenticated = () => Boolean(localStorage.getItem(STORAGE_KEY))

  return { isLoggedIn, login, logout, isAuthenticated }
}
