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
  
  getters: {
    // Permission-Prüfung - einfach und sauber
    hasPermission: (state) => (permission) => {
      if (!state.user || !state.user.permissions) return false
      
      // Super-Admin hat alle Rechte
      if (state.user.permissions.includes('**')) return true
      
      // Direkte Permission-Prüfung
      if (state.user.permissions.includes(permission)) return true
      
      // Wildcard-Prüfung (z.B. user.* für user.read)
      const permissionPrefix = permission.split('.')[0] + '.*'
      if (state.user.permissions.includes(permissionPrefix)) return true
      
      return false
    },
    
    // Navigation-Access - simpel und effizient
    canAccess: (state) => (permission) => {
      if (!state.user) return false
      
      // Super-Admin hat alle Berechtigungen
      if (state.user.permissions?.includes('**')) return true
      
      // Direkte Permission-Prüfung
      if (state.user.permissions?.includes(permission)) return true
      
      // Navigation-spezifische Mappings
      const userPermissions = state.user.permissions || []
      
      switch (permission) {
        case 'dashboard.view':
        case 'dashboard':
          return userPermissions.includes('dashboard.view') || 
                 userPermissions.includes('profile.read') ||
                 userPermissions.includes('dashboard.*')
        
        case 'administration':
          return userPermissions.some(p => 
            p.startsWith('user.') || p.startsWith('role.') || p === 'administration.*'
          )
        
        case 'system':
          return userPermissions.some(p => 
            p.startsWith('plugin.') || p.startsWith('settings.') || 
            p.startsWith('webhook.') || p === 'system.*'
          )
        
        case 'development':
          return userPermissions.some(p => 
            p.startsWith('api.') || p.startsWith('system.logs') || p === 'development.*'
          )
        
        case 'profile':
        case 'profile.view':
          return userPermissions.includes('profile.read') || 
                 userPermissions.includes('profile.*') || true
        
        default:
          return false
      }
    },
    
    // Mehrere Permissions prüfen
    hasAnyPermission: (state) => (permissions) => {
      if (!state.user || !state.user.permissions) return false
      return permissions.some(permission => state.user.permissions.includes(permission))
    },
    
    // Dashboard-Typ
    dashboardType: (state) => {
      if (!state.user || !state.user.roles) return 'user'
      if (state.user.roles.includes('ROLE_ADMIN')) return 'admin'
      if (state.user.roles.includes('ROLE_EMPLOYEE')) return 'employee'
      return 'user'
    }
  },

  actions: {
    // Login
    async login({ username, password, remember = false }) {
      this.loading = true
      this.error = null
      this.remember = remember
      
      try {
        // OAuth2 Password Grant - Form-encoded data
        const formData = new URLSearchParams({
          grant_type: 'password',
          client_id: 'backend',
          username: username.trim().toLowerCase(),
          password: password
        })
        
        const response = await axios.post('/api/oauth2/token', formData, {
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        
        this.setTokens(response.data, remember)
        await this.fetchProfile()
        
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login fehlgeschlagen'
        console.error('Login error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    // Tokens setzen
    setTokens(data, remember = this.remember) {
      this.accessToken = data.access_token
      this.refreshToken = data.refresh_token
      this.expiresAt = data.expires_in ? Date.now() + (data.expires_in * 1000) : null
      this.scopes = data.scope ? data.scope.split(' ') : []
      this.remember = remember
      
      const storage = getStorage(remember)
      storage.setItem(STORAGE_KEY, JSON.stringify({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        expiresAt: this.expiresAt,
        scopes: this.scopes,
        remember: this.remember
      }))
    },
    
    // Tokens laden
    loadTokens() {
      const sessionData = sessionStorage.getItem(STORAGE_KEY)
      const localData = localStorage.getItem(STORAGE_KEY)
      const data = sessionData || localData
      
      if (data) {
        const parsed = JSON.parse(data)
        this.accessToken = parsed.accessToken
        this.refreshToken = parsed.refreshToken
        this.expiresAt = parsed.expiresAt
        this.scopes = parsed.scopes || []
        this.remember = parsed.remember || false
      }
    },
    
    // Logout
    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.expiresAt = null
      this.scopes = []
      this.user = null
      this.error = null
      
      sessionStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STORAGE_KEY)
    },
    
    // Token refresh
    async refresh() {
      if (!this.refreshToken) return false
      
      try {
        // OAuth2 Refresh Grant - Form-encoded data
        const formData = new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: 'backend',
          refresh_token: this.refreshToken
        })
        
        const response = await axios.post('/api/oauth2/token', formData, {
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        
        this.setTokens(response.data, this.remember)
        return true
      } catch (error) {
        console.error('Token refresh failed:', error)
        this.logout()
        return false
      }
    },
    
    // Profil laden
    async fetchProfile() {
      if (!this.accessToken) {
        throw new Error('No access token available')
      }
      
      try {
        const response = await axios.get('/api/users/profile', {
          headers: { 
            Authorization: `Bearer ${this.accessToken}` 
          }
        })
        this.user = response.data
        this.error = null
        console.log('User-Profil geladen:', this.user)
        console.log('User-Permissions:', this.user?.permissions)
        return this.user
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        if (error.response?.status === 401) {
          this.logout()
        }
        throw error
      }
    }
  }
})

// Auto-refresh setup
export function setupAutoRefresh(store) {
  if (!store || typeof store.refresh !== 'function') return
  
  const interval = setInterval(async () => {
    if (store.accessToken && store.refreshToken) {
      if (store.expiresAt && Date.now() >= (store.expiresAt - 60000)) {
        const success = await store.refresh()
        if (!success) {
          clearInterval(interval)
        }
      }
    } else {
      clearInterval(interval)
    }
  }, 60000)
}
