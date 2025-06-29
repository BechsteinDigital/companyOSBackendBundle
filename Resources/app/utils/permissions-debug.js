// ===============================
// PERMISSIONS DEBUG UTILITY
// ===============================
// Hilfsklasse zur Diagnose von Permission-Problemen

import { useAuthStore } from '../stores/auth.js'

export class PermissionsDebug {
  constructor() {
    this.authStore = useAuthStore()
    this.logLevel = 'INFO' // DEBUG, INFO, WARN, ERROR
  }

  // Debug-Logging basierend auf Level
  log(level, message, data = null) {
    const levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 }
    if (levels[level] >= levels[this.logLevel]) {
      const timestamp = new Date().toISOString()
      const prefix = `[PERMISSIONS-${level}] ${timestamp}`
      
      if (data) {
        console[level.toLowerCase()](prefix, message, data)
      } else {
        console[level.toLowerCase()](prefix, message)
      }
    }
  }

  // Vollständige Permission-Analyse
  async analyzePermissions() {
    this.log('INFO', '🔍 Starte Permission-Analyse...')
    
    const analysis = {
      user: this.authStore.user,
      userPermissions: this.authStore.user?.permissions || [],
      userRoles: this.authStore.user?.roles || [],
      timestamp: new Date().toISOString(),
      checks: {}
    }

    // Navigation-Permissions testen
    const navigationPermissions = [
      'dashboard.view',
      'dashboard',
      'administration',
      'user.read',
      'user.create',
      'role.read',
      'role.create',
      'system',
      'plugin.read',
      'settings.read',
      'webhook.read',
      'development',
      'profile.view',
      'profile'
    ]

    this.log('INFO', '📋 Teste Navigation-Permissions...')
    
    for (const permission of navigationPermissions) {
      const hasPermission = this.authStore.hasPermission(permission)
      const canAccess = this.authStore.canAccess(permission)
      
      analysis.checks[permission] = {
        hasPermission,
        canAccess,
        status: hasPermission && canAccess ? '✅' : '❌'
      }
      
      this.log('DEBUG', `Permission ${permission}`, {
        hasPermission,
        canAccess,
        userPermissions: analysis.userPermissions
      })
    }

    // Ergebnis-Summary
    const granted = Object.values(analysis.checks).filter(c => c.hasPermission && c.canAccess).length
    const total = navigationPermissions.length
    
    this.log('INFO', `📊 Permission-Analyse abgeschlossen: ${granted}/${total} Permissions gewährt`)
    
    // Detaillierte Ausgabe
    console.group('🔐 PERMISSIONS ANALYSIS RESULTS')
    console.table(analysis.checks)
    console.log('👤 User Info:', {
      id: analysis.user?.id,
      username: analysis.user?.username,
      email: analysis.user?.email,
      permissions: analysis.userPermissions,
      roles: analysis.userRoles
    })
    console.groupEnd()

    return analysis
  }

  // Spezifische Permission testen
  testPermission(permission, context = {}) {
    this.log('INFO', `🧪 Teste Permission: ${permission}`)
    
    const results = {
      permission,
      context,
      tests: {
        hasPermission: this.authStore.hasPermission(permission),
        canAccess: this.authStore.canAccess(permission),
        hasAnyPermission: this.authStore.hasAnyPermission([permission]),
        checkNavigationPermission: this.authStore.checkNavigationPermission(permission)
      },
      userInfo: {
        authenticated: !!this.authStore.user,
        permissions: this.authStore.user?.permissions || [],
        roles: this.authStore.user?.roles || []
      }
    }

    console.group(`🧪 PERMISSION TEST: ${permission}`)
    console.table(results.tests)
    console.log('User Permissions:', results.userInfo.permissions)
    console.log('User Roles:', results.userInfo.roles)
    console.groupEnd()

    return results
  }

  // Navigation-Filter testen
  testNavigationFiltering() {
    this.log('INFO', '🧭 Teste Navigation-Filterung...')
    
    // Simuliere Navigation-Items
    const navItems = [
      { name: 'Dashboard', permission: 'dashboard.view' },
      { name: 'Benutzer', permission: ['user.create', 'user.read', 'user.update', 'user.delete'] },
      { name: 'Rollen', permission: ['role.create', 'role.read', 'role.update', 'role.delete'] },
      { name: 'Plugins', permission: ['plugin.create', 'plugin.read', 'plugin.update', 'plugin.delete'] },
      { name: 'Einstellungen', permission: ['settings.system', 'settings.read', 'settings.update'] },
      { name: 'Webhooks', permission: ['webhook.create', 'webhook.read', 'webhook.update', 'webhook.delete'] }
    ]

    const filteredItems = navItems.filter(item => {
      if (Array.isArray(item.permission)) {
        return this.authStore.hasAnyPermission(item.permission)
      } else {
        return this.authStore.canAccess(item.permission)
      }
    })

    this.log('INFO', `📈 Navigation-Filter: ${filteredItems.length}/${navItems.length} Items sichtbar`)
    
    console.group('🧭 NAVIGATION FILTERING TEST')
    console.log('Alle Items:', navItems.map(i => i.name))
    console.log('Sichtbare Items:', filteredItems.map(i => i.name))
    console.log('Versteckte Items:', navItems.filter(i => !filteredItems.includes(i)).map(i => i.name))
    console.groupEnd()

    return {
      allItems: navItems,
      visibleItems: filteredItems,
      hiddenItems: navItems.filter(i => !filteredItems.includes(i))
    }
  }

  // Permission-Probleme diagnostizieren
  diagnoseProblems() {
    this.log('INFO', '🩺 Diagnostiziere Permission-Probleme...')
    
    const problems = []
    const user = this.authStore.user

    // Problem 1: Kein Benutzer eingeloggt
    if (!user) {
      problems.push({
        type: 'AUTHENTICATION',
        level: 'ERROR',
        message: 'Kein Benutzer eingeloggt',
        solution: 'Benutzer muss sich anmelden'
      })
      return problems
    }

    // Problem 2: Keine Permissions geladen
    if (!user.permissions || user.permissions.length === 0) {
      problems.push({
        type: 'PERMISSIONS_MISSING',
        level: 'ERROR',
        message: 'Keine Permissions für Benutzer geladen',
        solution: 'Backend-API für User-Permissions prüfen'
      })
    }

    // Problem 3: Nur Profil-Permissions (typisches Problem)
    if (user.permissions && user.permissions.length > 0) {
      const hasOnlyProfile = user.permissions.every(p => p.startsWith('profile.'))
      if (hasOnlyProfile) {
        problems.push({
          type: 'LIMITED_PERMISSIONS',
          level: 'WARN',
          message: 'Benutzer hat nur Profil-Permissions',
          solution: 'Datenbank-Permissions erweitern oder SQL-Fix ausführen'
        })
      }
    }

    // Problem 4: Dashboard nicht zugänglich
    if (!this.authStore.canAccess('dashboard.view') && !this.authStore.canAccess('dashboard')) {
      problems.push({
        type: 'DASHBOARD_ACCESS',
        level: 'ERROR',
        message: 'Dashboard nicht zugänglich',
        solution: 'dashboard.view Permission hinzufügen oder Permission-Mapping prüfen'
      })
    }

    // Problem 5: Navigation leer
    const navTest = this.testNavigationFiltering()
    if (navTest.visibleItems.length === 0) {
      problems.push({
        type: 'NAVIGATION_EMPTY',
        level: 'ERROR',
        message: 'Keine Navigation-Items sichtbar',
        solution: 'Permission-Mappings oder Rollen-Zuweisungen prüfen'
      })
    }

    console.group('🩺 PERMISSION PROBLEMS DIAGNOSIS')
    problems.forEach(problem => {
      console[problem.level.toLowerCase()](`${problem.type}: ${problem.message}`)
      console.log(`   💡 Lösung: ${problem.solution}`)
    })
    console.groupEnd()

    return problems
  }

  // Automatische Vollanalyse
  async runFullDiagnosis() {
    console.log('🚀 STARTE VOLLSTÄNDIGE PERMISSION-DIAGNOSE')
    console.log('=' .repeat(50))
    
    const results = {
      timestamp: new Date().toISOString(),
      userInfo: this.authStore.user,
      analysis: await this.analyzePermissions(),
      navigationTest: this.testNavigationFiltering(),
      problems: this.diagnoseProblems()
    }

    // Summary
    const problemsCount = results.problems.length
    const errorsCount = results.problems.filter(p => p.level === 'ERROR').length
    const warningsCount = results.problems.filter(p => p.level === 'WARN').length

    console.log(`📋 DIAGNOSE ABGESCHLOSSEN`)
    console.log(`   Probleme gefunden: ${problemsCount}`)
    console.log(`   Davon Errors: ${errorsCount}`)
    console.log(`   Davon Warnings: ${warningsCount}`)
    console.log(`   Navigation Items sichtbar: ${results.navigationTest.visibleItems.length}`)
    
    if (problemsCount === 0) {
      console.log('✅ Keine Permission-Probleme gefunden!')
    } else {
      console.log('❌ Permission-Probleme gefunden - siehe Details oben')
    }

    return results
  }
}

// Globale Debug-Instanz
export const permissionsDebug = new PermissionsDebug()

// Browser-Console Hilfsfunktionen
if (typeof window !== 'undefined') {
  window.debugPermissions = permissionsDebug
  window.testPermission = (permission) => permissionsDebug.testPermission(permission)
  window.diagnosePermissions = () => permissionsDebug.runFullDiagnosis()
}

export default PermissionsDebug 