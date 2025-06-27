import { defineStore } from 'pinia'
import axios from 'axios'

const STORAGE_KEY = 'auth_storage'

function getStorage(remember) {
  return remember ? localStorage : sessionStorage
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    scopes: [],
    user: null,
    loading: false,
    error: null,
    remember: false,
  }),
  actions: {
    async login({ username, password, remember = false }) {
      this.loading = true
      this.error = null
      this.remember = remember
      try {
        const formData = `grant_type=password&client_id=backend&username=${encodeURIComponent(username)}&password=${password}`
        const { data } = await axios.post('/api/oauth2/token', formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        this.setTokens(data, remember)
        this.loading = false
        await this.fetchProfile()
        return true
      } catch (e) {
        this.error = e.response?.data?.message || 'Login fehlgeschlagen'
        this.loading = false
        return false
      }
    },
    setTokens(data, remember = this.remember) {
      this.accessToken = data.access_token
      this.refreshToken = data.refresh_token
      this.expiresAt = Date.now() + data.expires_in * 1000
      this.scopes = data.scope ? data.scope.split(' ') : []
      this.remember = remember
      const storage = getStorage(remember)
      storage.setItem(STORAGE_KEY, JSON.stringify({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        expiresAt: this.expiresAt,
        scopes: this.scopes,
        remember: this.remember,
      }))
    },
    loadTokens() {
      let data = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)
      if (data) {
        data = JSON.parse(data)
        this.accessToken = data.accessToken
        this.refreshToken = data.refreshToken
        this.expiresAt = data.expiresAt
        this.scopes = data.scopes
        this.remember = data.remember
      }
    },
    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.expiresAt = null
      this.scopes = []
      this.user = null
      localStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem(STORAGE_KEY)
    },
    async refresh() {
      if (!this.refreshToken) return false
      try {
        const formData = `grant_type=refresh_token&client_id=backend&refresh_token=${encodeURIComponent(this.refreshToken)}`
        const { data } = await axios.post('/api/oauth2/token', formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        this.setTokens(data, this.remember)
        return true
      } catch {
        this.logout()
        return false
      }
    },
    async fetchProfile() {
      try {
        const { data } = await axios.get('/api/users/profile')
        this.user = data.data
      } catch {
        this.user = null
      }
    },
    hasScope(scope) {
      return this.scopes.includes(scope)
    }
  }
})

// Auto-Refresh Setup (kann in main.js importiert werden)
export function setupAutoRefresh() {
  const auth = useAuthStore()
  setInterval(async () => {
    if (auth.accessToken && auth.expiresAt) {
      const timeLeft = auth.expiresAt - Date.now()
      if (timeLeft < 60 * 1000 && auth.refreshToken) {
        await auth.refresh()
      }
    }
  }, 30 * 1000)
} 