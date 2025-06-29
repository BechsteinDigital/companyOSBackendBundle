import { defineStore } from 'pinia'
import { allNavigationItems } from '../_nav.js'
import { useAuthStore } from './auth.js'

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    pluginNavigation: [],
    currentContext: {
      department: null,
      location: null,
      timeOfDay: null,
      ipAddress: null
    }
  }),
  
  getters: {
    /**
     * Berechnet die verfügbare Navigation basierend auf RBAC, ABAC und ACL
     */
    availableNavigation: (state) => {
      const auth = useAuthStore()
      
      if (!auth.user) {
        // Nur öffentliche Navigation für nicht-authentifizierte Benutzer
        return state.getPublicNavigation()
      }
      
      console.log('🔍 Navigation: Alle verfügbaren Items:', allNavigationItems.map(i => `${i.name} (${i.component})`))
      
      // Core-Navigation filtern
      const filteredCoreNav = allNavigationItems.filter(item => {
        const hasPermission = state.checkNavigationPermission(item, auth)
        console.log(`🎯 Navigation Filter: ${item.name} (${item.component}) -> ${hasPermission ? '✅ ALLOW' : '❌ DENY'}`)
        return hasPermission
      })
      
      console.log('🔍 Navigation: Gefilterte Core-Items:', filteredCoreNav.map(i => `${i.name} (${i.component})`))
      
      // Plugin-Navigation filtern
      const filteredPluginNav = state.pluginNavigation.filter(item => 
        state.checkNavigationPermission(item, auth)
      )
      
      // Navigation hierarchisch strukturieren
      const structured = state.structureNavigation([...filteredCoreNav, ...filteredPluginNav])
      console.log('🏗️ Navigation: Strukturierte Navigation:', structured.map(i => `${i.name} (${i.component}) - Children: ${i.items?.length || 0}`))
      
      return structured
    },

    /**
     * Gruppierte Navigation für bessere UX
     */
    groupedNavigation: (state) => {
      const navigation = state.availableNavigation
      const groups = {}
      
      navigation.forEach(item => {
        if (item.component === 'CNavTitle') {
          groups[item.name] = { title: item, items: [] }
        } else if (item.group) {
          if (!groups[item.group]) {
            groups[item.group] = { title: { name: item.group }, items: [] }
          }
          groups[item.group].items.push(item)
        }
      })
      
      return groups
    }
  },
  
  actions: {
    /**
     * Erweiterte Permission-Prüfung mit RBAC, ABAC und ACL
     */
    checkNavigationPermission(item, auth) {
      console.log(`🔍 Checking permission for: ${item.name} (${item.component})`)
      console.log(`   - Permission: ${Array.isArray(item.permission) ? item.permission.join(', ') : item.permission}`)
      console.log(`   - User permissions: ${auth.user?.permissions}`)
      
      // Öffentliche Items (ohne Permission) immer anzeigen
      if (!item.permission) {
        console.log(`✅ ${item.name}: No permission required`)
        return true
      }
      
      // Super-Admin-Überschreibung (basierend auf Permission, nicht Rolle)
      // Super-Admin mit "**" Permission umgeht ALLE Einschränkungen (RBAC, ABAC, ACL)
      if (auth.user?.permissions?.includes('**')) {
        console.log(`✅ Navigation Super-Admin override for: ${item.name}`)
        return true
      }
      
      // RBAC - Role-Based Access Control
      const rbacCheck = this.checkRBAC(item, auth)
      console.log(`   - RBAC check result: ${rbacCheck}`)
      if (!rbacCheck) return false
      
      // ABAC - Attribute-Based Access Control
      const abacCheck = this.checkABAC(item, auth)
      console.log(`   - ABAC check result: ${abacCheck}`)
      if (!abacCheck) return false
      
      // ACL - Access Control Lists (für spezifische Ressourcen)
      const aclCheck = this.checkACL(item, auth)
      console.log(`   - ACL check result: ${aclCheck}`)
      if (!aclCheck) return false
      
      console.log(`✅ ${item.name}: All checks passed`)
      return true
    },
    
    /**
     * RBAC - Role-Based Access Control
     */
    checkRBAC(item, auth) {
      if (!item.permission) return true
      
      // Mehrere Permissions (mindestens eine erforderlich)
      if (Array.isArray(item.permission)) {
        const hasAnyPermission = auth.hasAnyPermission(item.permission)
        if (hasAnyPermission) return true
        
        // Fallback auf Rollen-Check
        if (item.fallbackPermission) {
          return auth.canAccess(item.fallbackPermission)
        }
        return false
      }
      
      // Einzelne Permission
      const hasPermission = auth.hasPermission(item.permission)
      if (hasPermission) return true
      
      // Fallback auf Rollen-Check
      if (item.fallbackPermission) {
        return auth.canAccess(item.fallbackPermission)
      }
      
      return false
    },
    
    /**
     * ABAC - Attribute-Based Access Control
     */
    checkABAC(item, auth) {
      // Zeitbasierte Zugriffskontrolle
      if (item.timeRestrictions) {
        const now = new Date()
        const currentHour = now.getHours()
        const currentDay = now.getDay() // 0 = Sonntag, 1 = Montag, ...
        
        if (item.timeRestrictions.hours) {
          const [startHour, endHour] = item.timeRestrictions.hours
          if (currentHour < startHour || currentHour > endHour) {
            return false
          }
        }
        
        if (item.timeRestrictions.weekdays && !item.timeRestrictions.weekdays.includes(currentDay)) {
          return false
        }
      }
      
      // Standortbasierte Zugriffskontrolle
      if (item.locationRestrictions && this.currentContext.location) {
        if (!item.locationRestrictions.includes(this.currentContext.location)) {
          return false
        }
      }
      
      // Abteilungsbasierte Zugriffskontrolle
      if (item.departmentRestrictions && auth.user?.department) {
        if (!item.departmentRestrictions.includes(auth.user.department)) {
          return false
        }
      }
      
      // IP-basierte Zugriffskontrolle (für kritische Funktionen)
      if (item.ipRestrictions && this.currentContext.ipAddress) {
        const allowedIPs = item.ipRestrictions
        const userIP = this.currentContext.ipAddress
        
        // Einfache IP-Prüfung (in Produktion sollte CIDR-Notation unterstützt werden)
        if (!allowedIPs.some(ip => userIP.startsWith(ip))) {
          return false
        }
      }
      
      return true
    },
    
    /**
     * ACL - Access Control Lists (für spezifische Ressourcen)
     */
    checkACL(item, auth) {
      // Benutzer-spezifische Ausschlüsse
      if (item.excludeUsers && auth.user?.id) {
        if (item.excludeUsers.includes(auth.user.id)) {
          return false
        }
      }
      
      // Benutzer-spezifische Einschlüsse (Whitelist)
      if (item.includeUsers && auth.user?.id) {
        if (!item.includeUsers.includes(auth.user.id)) {
          return false
        }
      }
      
      // Feature-Flags prüfen
      if (item.featureFlag) {
        // Hier könnte eine Feature-Flag-API abgefragt werden
        // Für jetzt nehmen wir an, dass alle Features aktiviert sind
        return true
      }
      
      return true
    },
    
    /**
     * Öffentliche Navigation für nicht-authentifizierte Benutzer
     */
    getPublicNavigation() {
      return allNavigationItems.filter(item => item.public === true)
    },
    
    /**
     * Navigation hierarchisch strukturieren
     */
    structureNavigation(items) {
      const structured = []
      let currentGroup = null
      
      items.forEach(item => {
        if (item.component === 'CNavTitle') {
          currentGroup = { ...item, items: [] }
          structured.push(currentGroup)
        } else {
          if (currentGroup) {
            currentGroup.items.push(item)
          } else {
            structured.push(item)
          }
        }
      })
      
      return structured
    },
    
    /**
     * Plugin-Navigation hinzufügen
     */
    addPluginNavigation(pluginItems) {
      this.pluginNavigation = [...this.pluginNavigation, ...pluginItems]
    },
    
    /**
     * Plugin-Navigation entfernen
     */
    removePluginNavigation(pluginName) {
      this.pluginNavigation = this.pluginNavigation.filter(
        item => item.plugin !== pluginName
      )
    },
    
    /**
     * Aktuellen Kontext für ABAC aktualisieren
     */
    updateContext(context) {
      this.currentContext = { ...this.currentContext, ...context }
    },
    
    /**
     * Navigation-Auditlog (für Compliance)
     */
    logNavigationAccess(item, granted = true) {
      const auth = useAuthStore()
      
      console.log('Navigation Access Log:', {
        user: auth.user?.id,
        item: item.name,
        permission: item.permission,
        granted,
        timestamp: new Date().toISOString(),
        context: this.currentContext
      })
      
      // In Produktion: An Audit-API senden
      // await auditAPI.logNavigationAccess({ ... })
    },

    
    /**
     * Navigation-Permissions vom Backend synchronisieren
     */
    async syncNavigationPermissions() {
      const auth = useAuthStore()
      
      if (!auth.user?.id) return
      
      try {
        const response = await fetch(`/api/users/user-permissions/navigation/${auth.user.id}`, {
          headers: {
            'Authorization': `Bearer ${auth.accessToken}`
          }
        })
        
        if (!response.ok) throw new Error('Navigation sync failed')
        
        const data = await response.json()
        
        // Navigation-spezifische Permissions aktualisieren
        if (data.success && data.navigationPermissions) {
          // Hier könnten wir navigation-spezifische Permissions cachen
          console.log('Navigation permissions synced:', data.navigationPermissions)
        }
      } catch (error) {
        console.error('Failed to sync navigation permissions:', error)
      }
    }
  }
})


/**
 * Navigation Helper für einfache Permission-Checks
 */
export const navigationHelper = {
  /**
   * Prüft ob ein Benutzer auf eine bestimmte Route zugreifen kann
   */
  canAccessRoute(routeName, auth, navigationStore) {
    const navigationItem = allNavigationItems.find(item => 
      item.to === routeName || item.name === routeName
    )
    
    if (!navigationItem) return true // Unbekannte Routen erlauben
    
    return navigationStore.checkNavigationPermission(navigationItem, auth)
  },
  
  /**
   * Gibt die verfügbaren Aktionen für einen Benutzer zurück
   */
  getAvailableActions(auth) {
    const actions = []
    
    if (auth.hasPermission('user.create')) actions.push('create_user')
    if (auth.hasPermission('role.create')) actions.push('create_role')
    if (auth.hasPermission('plugin.install')) actions.push('install_plugin')
    if (auth.hasPermission('settings.update')) actions.push('update_settings')
    if (auth.hasPermission('webhook.create')) actions.push('create_webhook')
    
    return actions
  },
  
  /**
   * Dynamische Permission-Generierung basierend auf Kontext
   */
  generateContextualPermissions(resource, auth, context = {}) {
    const permissions = []
    
    // Basis-Permissions basierend auf Rolle
    if (auth.hasRole('ROLE_ADMIN')) {
      permissions.push(`${resource}.admin`)
    }
    
    if (auth.hasRole('ROLE_MANAGER')) {
      permissions.push(`${resource}.manage`)
    }
    
    if (auth.hasRole('ROLE_USER')) {
      permissions.push(`${resource}.view`)
    }
    
    // Kontext-basierte Permissions
    if (context.isOwner) {
      permissions.push(`${resource}.owner`)
    }
    
    if (context.sameDepartment) {
      permissions.push(`${resource}.department`)
    }
    
    return permissions
  }
} 