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
    // Permission-Prüfung - sicher und präzise
    hasPermission: (state) => (permission) => {
      if (!state.user || !state.user.permissions) {
        console.warn(`❌ Permission check failed: No user or permissions loaded for ${permission}`)
        return false
      }
      
      // Super-Admin hat alle Rechte
      if (state.user.permissions.includes('**')) {
        console.log(`✅ Permission ${permission}: Super-admin access`)
        return true
      }
      
      // Direkte Permission-Prüfung
      if (state.user.permissions.includes(permission)) {
        console.log(`✅ Permission ${permission}: Direct match`)
        return true
      }
      
      // Wildcard-Prüfung (z.B. user.* für user.read)
      const permissionPrefix = permission.split('.')[0] + '.*'
      if (state.user.permissions.includes(permissionPrefix)) {
        console.log(`✅ Permission ${permission}: Wildcard match (${permissionPrefix})`)
        return true
      }
      
      console.warn(`❌ Permission ${permission}: DENIED - not found in user permissions`, state.user.permissions)
      return false
    },
    
    // Navigation-Access - strenge Sicherheitsprüfung
    canAccess: (state) => (permission) => {
      if (!state.user) {
        console.warn(`❌ Navigation access denied: No user authenticated for ${permission}`)
        return false
      }
      
      // Super-Admin hat alle Berechtigungen
      if (state.user.permissions?.includes('**')) {
        console.log(`✅ Navigation access: Super-admin can access ${permission}`)
        return true
      }
      
      // Direkte Permission-Prüfung
      if (state.user.permissions?.includes(permission)) {
        console.log(`✅ Navigation access: Direct permission match for ${permission}`)
        return true
      }
      
      // Navigation-spezifische Mappings (STRENG)
      const userPermissions = state.user.permissions || []
      let hasAccess = false
      
      switch (permission) {
        case 'dashboard.view':
        case 'dashboard':
          hasAccess = userPermissions.includes('dashboard.view') || 
                     userPermissions.includes('dashboard.*')
          break
        
        case 'administration':
          hasAccess = userPermissions.some(p => 
            p.startsWith('user.') || p.startsWith('role.') || p === 'administration.*'
          )
          break
        
        case 'system':
          hasAccess = userPermissions.some(p => 
            p.startsWith('plugin.') || p.startsWith('settings.') || 
            p.startsWith('webhook.') || p === 'system.*'
          )
          break
        
        case 'development':
          hasAccess = userPermissions.some(p => 
            p.startsWith('api.') || p.startsWith('system.logs') || p === 'development.*'
          )
          break
        
        case 'profile':
        case 'profile.view':
          // Profil-Zugriff: Nur mit expliziter Berechtigung
          hasAccess = userPermissions.includes('profile.read') || 
                     userPermissions.includes('profile.*')
          break
        
        default:
          hasAccess = false
      }
      
      if (hasAccess) {
        console.log(`✅ Navigation access: Permission granted for ${permission}`)
      } else {
        console.warn(`❌ Navigation access: Permission DENIED for ${permission}`, userPermissions)
      }
      
      return hasAccess
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
    // Backend Permission-Check (echte Sicherheit)
    async checkPermissionSecure(permission, context = {}) {
      if (!this.user?.id || !this.accessToken) {
        console.error(`❌ Secure permission check failed: User not authenticated for ${permission}`)
        console.error(`   - this.user: ${this.user ? 'exists' : 'null'}`)
        console.error(`   - this.user.id: ${this.user?.id || 'undefined'}`)
        console.error(`   - this.accessToken: ${this.accessToken ? 'exists' : 'null'}`)
        return false
      }
      
      // Erste Frontend-Validierung (schnell)
      const frontendCheck = this.hasPermission(permission)
      if (!frontendCheck) {
        console.warn(`❌ Secure permission check: Frontend check failed for ${permission}`)
        return false
      }
      
      try {
        console.log(`🔍 Backend permission check for: ${permission}`)
        
        const response = await axios.post('/api/user-permissions/check-permission', {
          user_id: this.user.id,
          permission: permission,
          context: context
        }, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        // Das CoreBundle API gibt Daten als { success: true, allowed: true } zurück
        const apiResponse = response.data
        if (!apiResponse.success) {
          console.warn(`Backend permission check failed: ${apiResponse.message}`)
          return false
        }
        
        const result = apiResponse.allowed || false
        
        if (result) {
          console.log(`✅ Backend permission check: ${permission} GRANTED`)
        } else {
          console.warn(`❌ Backend permission check: ${permission} DENIED by backend`)
        }
        
        return result
      } catch (error) {
        console.error(`🚨 Backend permission check failed for ${permission}:`, error)
        
        // Bei Backend-Fehlern: STRENGE Sicherheit - DENY by default
        if (error.response?.status === 403 || error.response?.status === 401) {
          console.warn(`❌ Backend permission check: ${permission} EXPLICITLY DENIED (403/401)`)
          return false
        }
        
        // Bei Netzwerkfehlern: Fallback auf Frontend-Check (aber nur für unkritische Permissions)
        const uncriticalPermissions = ['dashboard.view', 'profile.read', 'profile.view']
        if (uncriticalPermissions.includes(permission)) {
          console.warn(`⚠️ Backend permission check: Using frontend fallback for ${permission} (network error)`)
          return frontendCheck
        }
        
        console.warn(`❌ Backend permission check: ${permission} DENIED (network error, critical permission)`)
        return false
      }
    },

    // Batch Permission Check für Performance
    async checkPermissionsBatch(permissions, context = {}) {
      if (!this.user?.id || !this.accessToken) {
        console.error(`❌ Batch permission check failed: User not authenticated`)
        return {}
      }
      
      try {
        const response = await axios.post('/api/user-permissions/check-permissions-batch', {
          user_id: this.user.id,
          permissions: permissions,
          context: context
        }, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        // Das CoreBundle API gibt Daten als { success: true, permissions: {...} } zurück
        const apiResponse = response.data
        if (!apiResponse.success) {
          console.warn(`Backend batch permission check failed: ${apiResponse.message}`)
          return {}
        }
        
        return apiResponse.permissions || {}
      } catch (error) {
        console.error('🚨 Batch permission check failed:', error)
        
        // Fallback: Einzelne Frontend-Checks für unkritische Permissions
        const result = {}
        const uncriticalPermissions = ['dashboard.view', 'profile.read', 'profile.view']
        
        permissions.forEach(permission => {
          if (uncriticalPermissions.includes(permission)) {
            result[permission] = this.hasPermission(permission)
          } else {
            result[permission] = false // Kritische Permissions werden bei Backend-Fehlern verweigert
          }
        })
        
        return result
      }
    },

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
        try {
          const parsed = JSON.parse(data)
          this.accessToken = parsed.accessToken
          this.refreshToken = parsed.refreshToken
          this.expiresAt = parsed.expiresAt
          this.scopes = parsed.scopes || []
          this.remember = parsed.remember || false
          
          console.log('✅ Tokens loaded from storage', {
            hasAccessToken: !!this.accessToken,
            hasRefreshToken: !!this.refreshToken,
            remember: this.remember,
            expiresAt: this.expiresAt ? new Date(this.expiresAt).toLocaleString() : 'never'
          })
        } catch (error) {
          console.error('❌ Failed to parse stored tokens:', error)
          this.logout() // Ungültige Daten entfernen
        }
      } else {
        console.log('ℹ️ No stored tokens found')
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
        
        // Das CoreBundle API gibt Daten als { success: true, data: { ... } } zurück
        const apiResponse = response.data
        console.log('📥 Raw API Response:', apiResponse)
        
        if (!apiResponse.success) {
          throw new Error(apiResponse.message || 'API returned unsuccessful response')
        }
        
        const userData = apiResponse.data
        
        // Debug: Vollständige Response anzeigen
        console.log('📥 User Profile Response:', userData)
        
        // Validierung der wichtigsten User-Eigenschaften
        if (!userData || typeof userData !== 'object') {
          throw new Error('Invalid user data received from backend')
        }
        
        if (!userData.id) {
          console.error('❌ User profile is missing ID field!', userData)
          throw new Error('User profile is missing required ID field')
        }
        
        if (!userData.permissions || !Array.isArray(userData.permissions)) {
          console.warn('⚠️ User profile is missing or has invalid permissions', userData.permissions)
          userData.permissions = []
        }
        
        this.user = userData
        this.error = null
        
        console.log('✅ User-Profil erfolgreich geladen:', {
          id: this.user.id,
          username: this.user.username || 'N/A',
          email: this.user.email || 'N/A',
          roles: this.user.roles || [],
          permissions: this.user.permissions?.length || 0,
          permissionsList: this.user.permissions
        })
        
        return this.user
      } catch (error) {
        console.error('❌ Failed to fetch profile:', error)
        
        if (error.response?.status === 401) {
          console.log('🔒 Unauthorized - logging out')
          this.logout()
        } else if (error.response?.status === 500) {
          console.error('🚨 Backend error when fetching profile:', error.response?.data)
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
