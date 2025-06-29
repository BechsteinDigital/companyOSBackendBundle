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
      if (!state.user || !state.user.permissions) {
        console.warn(`❌ Permission check failed: User not authenticated or no permissions loaded`)
        return false
      }
      
      // Super-Admin hat alle Rechte
      if (state.user.permissions.includes('**')) {
        console.log(`✅ Permission ${permission} granted: User has super-admin rights (**)`)
        return true
      }
      
      // Direkte Permission-Prüfung
      if (state.user.permissions.includes(permission)) {
        console.log(`✅ Permission ${permission} granted: Direct match`)
        return true
      }
      
      // Wildcard-Prüfung (z.B. user.* für user.read)
      const permissionPrefix = permission.split('.')[0] + '.*'
      if (state.user.permissions.includes(permissionPrefix)) {
        console.log(`✅ Permission ${permission} granted: Wildcard match (${permissionPrefix})`)
        return true
      }
      
      console.warn(`❌ Permission ${permission} denied: Not found in user permissions`, state.user.permissions)
      return false
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
      if (!state.user) {
        return false
      }
      
      // Super-Admin hat alle Berechtigungen
      if (state.user.permissions?.includes('**')) {
        return true
      }
      
      // Permission-basierte Prüfung
      if (state.user.permissions) {
        // Direkte Permission-Prüfung
        if (state.user.permissions.includes(permission)) {
          return true
        }
        
        // Wildcard-Prüfung
        const permissionPrefix = permission.split('.')[0] + '.*'
        if (state.user.permissions.includes(permissionPrefix)) {
          return true
        }
        
        const userPermissions = state.user.permissions
        
        // Navigation-spezifische Permission-Mappings
        switch (permission) {
          case 'dashboard.view':
          case 'dashboard':
            return userPermissions.includes('profile.read') || 
                   userPermissions.includes('dashboard.view') ||
                   userPermissions.includes('dashboard.*') ||
                   state.user.roles?.includes('ROLE_USER')
          
          case 'administration':
            return userPermissions.some(p => 
              p.startsWith('user.') || 
              p.startsWith('role.') ||
              p === 'administration.*'
            )
          
          case 'system':
            return userPermissions.some(p => 
              p.startsWith('plugin.') || 
              p.startsWith('settings.') ||
              p.startsWith('webhook.') ||
              p === 'system.*'
            )
          
          case 'development':
            return userPermissions.some(p => 
              p.startsWith('api.') || 
              p.startsWith('system.logs') ||
              p === 'development.*'
            )
          
          case 'profile':
          case 'profile.view':
            return userPermissions.includes('profile.read') ||
                   userPermissions.includes('profile.*') ||
                   true // Profil sollte für jeden Benutzer zugänglich sein
          
          default:
            return false
        }
      }
      
      return false
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
    // Navigation-spezifische Permission-Prüfung
    checkNavigationPermission(permission) {
      if (!this.user || !this.user.permissions) return false
      
      const userPermissions = this.user.permissions
      
      // Mapping von Navigation-Permissions zu Datenbank-Permissions
      switch (permission) {
        case 'dashboard.view':
        case 'dashboard':
          // Dashboard sollte für jeden authentifizierten Benutzer zugänglich sein
          return userPermissions.includes('profile.read') || 
                 userPermissions.includes('dashboard.view') ||
                 userPermissions.includes('dashboard.*') ||
                 this.user.roles?.includes('ROLE_USER')
        
        case 'administration':
          return userPermissions.some(p => 
            p.startsWith('user.') || 
            p.startsWith('role.') ||
            p === 'administration.*'
          )
        
        case 'user.read':
        case 'user.create':
        case 'user.update':
        case 'user.delete':
          return userPermissions.includes(permission) ||
                 userPermissions.includes('user.*') ||
                 userPermissions.includes('administration.*')
        
        case 'role.read':
        case 'role.create':
        case 'role.update':
        case 'role.delete':
          return userPermissions.includes(permission) ||
                 userPermissions.includes('role.*') ||
                 userPermissions.includes('administration.*')
        
        case 'system':
          return userPermissions.some(p => 
            p.startsWith('plugin.') || 
            p.startsWith('settings.') ||
            p.startsWith('webhook.') ||
            p === 'system.*'
          )
        
        case 'plugin.read':
        case 'plugin.create':
        case 'plugin.update':
        case 'plugin.delete':
          return userPermissions.includes(permission) ||
                 userPermissions.includes('plugin.*') ||
                 userPermissions.includes('system.*')
        
        case 'settings.read':
        case 'settings.update':
        case 'settings.system':
          return userPermissions.includes(permission) ||
                 userPermissions.includes('settings.*') ||
                 userPermissions.includes('system.*')
        
        case 'webhook.read':
        case 'webhook.create':
        case 'webhook.update':
        case 'webhook.delete':
          return userPermissions.includes(permission) ||
                 userPermissions.includes('webhook.*') ||
                 userPermissions.includes('system.*')
        
        case 'development':
          return userPermissions.some(p => 
            p.startsWith('api.') || 
            p.startsWith('system.logs') ||
            p === 'development.*'
          )
        
        case 'profile':
        case 'profile.view':
          return userPermissions.includes('profile.read') ||
                 userPermissions.includes('profile.*') ||
                 true // Profil sollte für jeden Benutzer zugänglich sein
        
        default:
          return false
      }
    },

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
      if (!this.user?.id || !this.accessToken) {
        console.warn(`❌ Cannot check permission ${permission}: User not authenticated`)
        return false
      }
      
      try {
        const response = await fetch(`/api/users/user-permissions/check/${this.user.id}/${permission}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.warn(`❌ Permission check denied for ${permission}: Status ${response.status}`)
            // Bei 401/403 nicht als Fehler behandeln, sondern Permission verweigern
            return false
          }
          console.warn(`⚠️ Permission check failed for ${permission}: Status ${response.status}`)
          return false
        }
        
        const data = await response.json()
        const allowed = data.hasPermission || data.allowed || false
        console.log(`✅ Permission check result for ${permission}:`, allowed)
        return allowed
      } catch (error) {
        console.error(`❌ Permission check network error for ${permission}:`, error)
        // Bei Netzwerkfehlern auf lokale Permission-Checks zurückfallen
        return this.canAccess(permission)
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