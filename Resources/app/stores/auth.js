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
                
        // URLSearchParams für korrektes Encoding verwenden
        const formData = new URLSearchParams({
          grant_type: 'password',
          client_id: 'backend',
          username: sanitizedEmail,
          password: password
        })
        
        const { data } = await axios.post('/api/oauth2/token', formData, {
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
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
        // URLSearchParams für korrektes Encoding verwenden
        const formData = new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: 'backend',
          refresh_token: this.refreshToken
        })
        
        const { data } = await axios.post('/api/oauth2/token', formData, {
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
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
      if (!this.accessToken) return
      try {
        const { data } = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        })
        console.log('User-Profil geladen:', data)
        this.user = data
        console.log('User-Rollen:', this.user?.roles)
      } catch (error) {
        console.error('Profil konnte nicht abgerufen werden:', error)
      }
    },
    
    hasScope(scope) {
      return this.scopes.includes(scope)
    }
  }
})

export function setupAutoRefresh() {
  const auth = useAuthStore()
  
  setInterval(() => {
    if (auth.expiresAt && Date.now() > auth.expiresAt - 60000) {
      auth.refresh()
    }
  }, 30000)
} 