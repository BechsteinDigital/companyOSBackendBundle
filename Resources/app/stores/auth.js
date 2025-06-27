import { defineStore } from 'pinia'
import axios from 'axios'

const STORAGE_KEY = 'auth_storage'

function getStorage(remember) {
  return remember ? localStorage : sessionStorage
}

// Input-Sanitization Funktionen
function sanitizeEmail(email) {
  return email.trim().toLowerCase()
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password) {
  return password && password.length >= 8
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
    csrfToken: null,
  }),
  
  getters: {
    // Rollenprüfung
    hasRole: (state) => (role) => {
      if (!state.user || !state.user.roles) return false
      return state.user.roles.includes(role)
    },
    
    // Berechtigungsprüfung für Navigation
    canAccess: (state) => (permission) => {
      if (!state.user || !state.user.roles) return false
      
      const userRoles = state.user.roles
      
      // Admin hat alle Berechtigungen
      if (userRoles.includes('ROLE_ADMIN')) return true
      
      // Spezifische Berechtigungen
      switch (permission) {
        case 'dashboard':
          return userRoles.includes('ROLE_CUSTOMER') || 
                 userRoles.includes('ROLE_EMPLOYEE') || 
                 userRoles.includes('ROLE_ADMIN')
        
        case 'administration':
          return userRoles.includes('ROLE_ADMIN')
        
        case 'system':
          return userRoles.includes('ROLE_ADMIN')
        
        case 'development':
          return userRoles.includes('ROLE_ADMIN')
        
        case 'profile':
          return userRoles.includes('ROLE_CUSTOMER') || 
                 userRoles.includes('ROLE_EMPLOYEE') || 
                 userRoles.includes('ROLE_ADMIN')
        
        default:
          return false
      }
    },
    
    // Benutzerrolle für Dashboard-Typ
    dashboardType: (state) => {
      if (!state.user || !state.user.roles) return 'customer'
      
      if (state.user.roles.includes('ROLE_ADMIN')) return 'admin'
      if (state.user.roles.includes('ROLE_EMPLOYEE')) return 'employee'
      return 'customer'
    }
  },
  
  actions: {
    async login({ username, password, remember = false }) {
      this.loading = true
      this.error = null
      this.remember = remember
      
      try {
        // Input-Validierung
        const sanitizedEmail = sanitizeEmail(username)
        if (!validateEmail(sanitizedEmail)) {
          throw new Error('Ungültige E-Mail-Adresse')
        }
        
        if (!validatePassword(password)) {
          throw new Error('Passwort muss mindestens 8 Zeichen lang sein')
        }
        
        // CSRF-Token abrufen falls nicht vorhanden
        if (!this.csrfToken) {
          await this.fetchCsrfToken()
        }
        
        const formData = `grant_type=password&client_id=backend&username=${encodeURIComponent(sanitizedEmail)}&password=${encodeURIComponent(password)}`
        const { data } = await axios.post('/api/oauth2/token', formData, {
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRF-TOKEN': this.csrfToken
          }
        })
        
        this.setTokens(data, remember)
        this.loading = false
        await this.fetchProfile()
        return true
      } catch (e) {
        this.error = e.response?.data?.message || e.message || 'Login fehlgeschlagen'
        this.loading = false
        return false
      }
    },
    
    async fetchCsrfToken() {
      try {
        const response = await axios.get('/api/csrf-token', {
          withCredentials: true
        })
        this.csrfToken = response.data.token
      } catch (error) {
        console.warn('CSRF-Token konnte nicht abgerufen werden:', error)
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
      this.csrfToken = null
      localStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem(STORAGE_KEY)
    },
    
    async refresh() {
      if (!this.refreshToken) return false
      try {
        // CSRF-Token erneuern
        await this.fetchCsrfToken()
        
        const formData = `grant_type=refresh_token&client_id=backend&refresh_token=${encodeURIComponent(this.refreshToken)}`
        const { data } = await axios.post('/api/oauth2/token', formData, {
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRF-TOKEN': this.csrfToken
          }
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