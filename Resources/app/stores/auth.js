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
    // Rollenprüfung (Legacy - wird durch Permissions ersetzt)
    hasRole: (state) => (role) => {
      if (!state.user || !state.user.roles) return false
      return state.user.roles.includes(role)
    },
    
    // Permission-Prüfung (Empfohlen)
    hasPermission: (state) => (permission) => {
      if (!state.user || !state.user.permissions) return false
      return state.user.permissions.includes(permission)
    },
    
    // Hybrid Permission Check (RBAC + ABAC)
    hasHybridPermission: (state) => (permission, context = {}) => {
      // Basis RBAC-Check
      if (!state.user || !state.user.permissions) return false
      if (!state.user.permissions.includes(permission)) return false
      
      // Admin-Überschreibung
      if (state.user.roles?.includes('ROLE_ADMIN')) return true
      
      // ABAC-Regeln prüfen (vereinfacht für Frontend)
      return state.checkAbacRules(permission, context)
    },
    
    // Mehrere Permissions prüfen (mindestens eine muss vorhanden sein)
    hasAnyPermission: (state) => (permissions) => {
      if (!state.user || !state.user.permissions) return false
      return permissions.some(permission => state.user.permissions.includes(permission))
    },
    
    // Alle Permissions prüfen (alle müssen vorhanden sein)
    hasAllPermissions: (state) => (permissions) => {
      if (!state.user || !state.user.permissions) return false
      return permissions.every(permission => state.user.permissions.includes(permission))
    },
    
    // Berechtigungsprüfung für Navigation (Permission-basiert)
    canAccess: (state) => (permission) => {
      if (!state.user) return false
      
      // Admin-Rolle hat alle Berechtigungen (Fallback)
      if (state.user.roles?.includes('ROLE_ADMIN')) return true
      
      // Permission-basierte Prüfung
      if (state.user.permissions) {
        // Direkte Permission-Prüfung
        if (state.user.permissions.includes(permission)) return true
        
        // Mapping von Legacy-Permissions zu spezifischen Permissions
        switch (permission) {
          case 'dashboard':
            return state.user.permissions.includes('dashboard.view')
          
          case 'administration':
            return state.user.permissions.some(p => p.startsWith('user.') || p.startsWith('role.'))
          
          case 'system':
            return state.user.permissions.some(p => p.startsWith('plugin.') || p.startsWith('settings.'))
          
          case 'development':
            return state.user.permissions.some(p => p.startsWith('api.') || p.startsWith('system.'))
          
          case 'profile':
            return state.user.permissions.includes('profile.view')
          
          default:
            return false
        }
      }
      
      // Fallback auf Rollen-basierte Prüfung (Legacy)
      const userRoles = state.user.roles || []
      
      switch (permission) {
        case 'dashboard':
          return userRoles.includes('ROLE_USER') || 
                 userRoles.includes('ROLE_EMPLOYEE') || 
                 userRoles.includes('ROLE_ADMIN')
        
        case 'administration':
          return userRoles.includes('ROLE_ADMIN')
        
        case 'system':
          return userRoles.includes('ROLE_ADMIN')
        
        case 'development':
          return userRoles.includes('ROLE_ADMIN')
        
        case 'profile':
          return userRoles.includes('ROLE_USER') || 
                 userRoles.includes('ROLE_EMPLOYEE') || 
                 userRoles.includes('ROLE_ADMIN')
        
        default:
          return false
      }
    },
    
    // Benutzerrolle für Dashboard-Typ
    dashboardType: (state) => {
      if (!state.user || !state.user.roles) return 'user'
      
      if (state.user.roles.includes('ROLE_ADMIN')) return 'admin'
      if (state.user.roles.includes('ROLE_EMPLOYEE')) return 'employee'
      return 'user'
    }
    },

  actions: {
    // ABAC-Regeln prüfen (Frontend-seitig)
    checkAbacRules(permission, context) {
      // Vereinfachte ABAC-Regeln für Frontend
      const rules = {
        'user.update': (ctx) => {
          // Nur eigene Profile bearbeiten
          return ctx.resource?.owner_id === this.user?.id
        },
        'user.delete': (ctx) => {
          // Nur während Arbeitszeit (9-17 Uhr)
          const hour = new Date().getHours()
          return hour >= 9 && hour <= 17
        },
        'plugin.install': (ctx) => {
          // Nur gleiche Abteilung
          return ctx.resource?.department === this.user?.department
        }
      }
      
      const rule = rules[permission]
      return rule ? rule(context) : true
    },

    // Einzelne Permission über Backend-API prüfen (mit RBAC + ABAC + ACL)
    async hasPermission(permission, context = {}) {
      if (!this.user?.id) return false
      
      try {
        const response = await fetch(`/api/users/user-permissions/check/${this.user.id}/${permission}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          console.warn(`Permission check failed for ${permission}:`, response.status)
          return false
        }
        
        const data = await response.json()
        console.log(`✅ Permission check result for ${permission}:`, data.allowed)
        return data.allowed || false
      } catch (error) {
        console.error(`Permission check error for ${permission}:`, error)
        return false
      }
    },

    // Batch-Permission Check vom Backend (mit RBAC + ABAC + ACL)
    async checkBatchPermissions(permissions, context = {}) {
      if (!this.user?.id) return {}
      
      try {
        const response = await fetch(`/api/users/api/users-hybrid/batch-permissions/${this.user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
          },
          body: JSON.stringify({
            permissions,
            context
          })
        })
        
        if (!response.ok) throw new Error('Batch permission check failed')
        
        const data = await response.json()
        return data.permissions || {}
      } catch (error) {
        console.error('Batch permission check failed:', error)
        return {}
      }
    },

    // Vereinfachte lokale Permission-Checks für Fallback
    hasRole(role) {
      return this.user?.roles?.includes(role) || false
    },

    hasAnyPermission(permissions) {
      // Für schnelle lokale Checks - nur RBAC
      if (!this.user?.roles) return false
      
      // Admin hat alle Permissions
      if (this.user.roles.includes('ROLE_ADMIN')) return true
      
      // TODO: Implementiere lokale Permission-Mappings für Performance
      // Für jetzt: Optimistische Annahme für bessere UX
      return true
    },

    // Legacy canAccess Methode für Kompatibilität
    canAccess(permission) {
      // Lokaler schneller Check für bessere UX
      if (!this.user?.roles) return false
      
      // Admin hat alle Permissions
      if (this.user.roles.includes('ROLE_ADMIN')) return true
      
      // TODO: Implementiere lokale Permission-Mappings
      return true
    },
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
      
      this.loading = true
      try {
        const { data } = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        })
        console.log('User-Profil geladen:', data)
        this.user = data
        console.log('User-Rollen:', this.user?.roles)
      } catch (error) {
        console.error('Profil konnte nicht abgerufen werden:', error)
        // Bei Fehler logout durchführen
        this.logout()
        throw error
      } finally {
        this.loading = false
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