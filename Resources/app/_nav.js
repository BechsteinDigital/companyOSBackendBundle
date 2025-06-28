// Alle verfügbaren Navigation-Items mit erweiterten RBAC/ABAC/ACL-Berechtigungen
export const allNavigationItems = [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    permission: 'dashboard.view',
    fallbackPermission: 'dashboard',
    public: false // Nur für authentifizierte Benutzer
  },
  {
    component: 'CNavTitle',
    name: 'Verwaltung',
    permission: ['user.read', 'role.read'], // Mindestens eine erforderlich
    fallbackPermission: 'administration'
  },
  {
    component: 'CNavItem',
    name: 'Benutzer',
    to: '/users',
    icon: 'cil-user',
    permission: ['user.create', 'user.read', 'user.update', 'user.delete'],
    fallbackPermission: 'administration',
    // ABAC - Zeitbasierte Einschränkungen (Geschäftszeiten)
    timeRestrictions: {
      hours: [8, 18], // 8:00 bis 18:00 Uhr
      weekdays: [1, 2, 3, 4, 5] // Montag bis Freitag
    },
    security: 'medium'
  },
  {
    component: 'CNavItem',
    name: 'Rollen',
    to: '/roles',
    icon: 'cil-lock-locked',
    permission: ['role.create', 'role.read', 'role.update', 'role.delete'],
    fallbackPermission: 'administration',
    // ACL - Kritischer Bereich, nur für bestimmte Benutzer
    departmentRestrictions: ['IT', 'Management', 'Security'],
    security: 'high',
    // ABAC - Nur während Arbeitszeit
    timeRestrictions: {
      hours: [9, 17],
      weekdays: [1, 2, 3, 4, 5]
    }
  },
  {
    component: 'CNavItem',
    name: 'Berechtigungen',
    to: '/permissions',
    icon: 'cil-shield-alt',
    permission: ['permission.read', 'role.read'],
    fallbackPermission: 'administration',
    // Hochsicherheitsbereich
    security: 'high',
    departmentRestrictions: ['IT', 'Security'],
    // Nur von sicheren IP-Bereichen
    ipRestrictions: ['192.168.1.', '10.0.0.', '172.16.'],
    timeRestrictions: {
      hours: [9, 16], // Verkürzte Arbeitszeit
      weekdays: [1, 2, 3, 4, 5]
    }
  },
  {
    component: 'CNavTitle',
    name: 'System',
    permission: ['plugin.read', 'settings.read'],
    fallbackPermission: 'system'
  },
  {
    component: 'CNavItem',
    name: 'Plugins',
    to: '/plugins',
    icon: 'cil-puzzle',
    permission: ['plugin.create', 'plugin.read', 'plugin.update', 'plugin.delete'],
    fallbackPermission: 'system',
    // Plugin-Installation ist kritisch
    security: 'high',
    departmentRestrictions: ['IT'],
    // Plugin-Installation nur während Wartungsfenster
    timeRestrictions: {
      hours: [22, 6], // 22:00 bis 06:00 (Wartungsfenster)
      weekdays: [0, 6] // Sonntag und Samstag
    },
    // Audit-Logging aktivieren
    auditRequired: true
  },
  {
    component: 'CNavItem',
    name: 'Einstellungen',
    to: '/settings',
    icon: 'cil-settings',
    permission: ['settings.system', 'settings.read', 'settings.update'],
    fallbackPermission: 'system',
    // System-Einstellungen sind kritisch
    security: 'high',
    departmentRestrictions: ['IT', 'Management'],
    // Nur von Admin-Workstations
    ipRestrictions: ['192.168.10.', '10.0.1.'],
    auditRequired: true
  },
  {
    component: 'CNavItem',
    name: 'Webhooks',
    to: '/webhooks',
    icon: 'cil-link',
    permission: ['webhook.create', 'webhook.read', 'webhook.update', 'webhook.delete'],
    fallbackPermission: 'system',
    // Webhooks können sicherheitskritisch sein
    security: 'medium',
    departmentRestrictions: ['IT', 'Development'],
    timeRestrictions: {
      hours: [8, 20], // Erweiterte Arbeitszeit
      weekdays: [1, 2, 3, 4, 5, 6] // Montag bis Samstag
    }
  },
  {
    component: 'CNavTitle',
    name: 'Entwicklung',
    permission: ['api.read', 'system.logs'],
    fallbackPermission: 'development',
    // Development-Bereich nur für Entwickler
    departmentRestrictions: ['IT', 'Development']
  },
  {
    component: 'CNavItem',
    name: 'API-Dokumentation',
    to: '/api-docs',
    icon: 'cil-code',
    permission: ['api.read', 'api.documentation'],
    fallbackPermission: 'development',
    departmentRestrictions: ['IT', 'Development'],
    // API-Docs nur aus internem Netzwerk
    ipRestrictions: ['192.168.', '10.0.', '172.16.'],
    security: 'medium'
  },
  {
    component: 'CNavItem',
    name: 'System-Status',
    to: '/system-status',
    icon: 'cil-chart',
    permission: ['system.monitoring', 'system.status'],
    fallbackPermission: 'development',
    departmentRestrictions: ['IT', 'Operations'],
    // System-Monitoring rund um die Uhr
    timeRestrictions: null, // Keine Zeiteinschränkungen
    security: 'medium'
  },
  
  // Erweiterte System-Navigation für Compliance
  {
    component: 'CNavTitle',
    name: 'Compliance',
    permission: ['audit.read', 'compliance.read'],
    fallbackPermission: 'compliance',
    departmentRestrictions: ['Legal', 'Compliance', 'Management']
  },
  {
    component: 'CNavItem',
    name: 'Audit-Log',
    to: '/audit-log',
    icon: 'cil-history',
    permission: ['audit.read', 'audit.export'],
    fallbackPermission: 'compliance',
    // Audit-Log ist hochsensibel
    security: 'high',
    departmentRestrictions: ['Legal', 'Compliance'],
    ipRestrictions: ['192.168.10.'], // Nur von sicheren Compliance-Workstations
    timeRestrictions: {
      hours: [9, 16], // Verkürzte Arbeitszeit
      weekdays: [1, 2, 3, 4, 5]
    },
    auditRequired: true,
    // ACL - Spezifische Benutzer-Einschlüsse
    includeUsers: [], // Wird dynamisch befüllt
    badge: {
      text: 'GDPR',
      color: 'warning'
    }
  },
  {
    component: 'CNavItem',
    name: 'Datenschutz',
    to: '/privacy',
    icon: 'cil-shield-alt',
    permission: ['privacy.read', 'gdpr.access'],
    fallbackPermission: 'compliance',
    security: 'high',
    departmentRestrictions: ['Legal', 'Compliance'],
    ipRestrictions: ['192.168.10.'],
    timeRestrictions: {
      hours: [9, 16],
      weekdays: [1, 2, 3, 4, 5]
    },
    auditRequired: true,
    badge: {
      text: 'DSGVO',
      color: 'danger'
    }
  },
  
  // Notfall-Navigation (nur für Notfälle)
  {
    component: 'CNavTitle',
    name: 'Notfall',
    permission: ['emergency.access'],
    fallbackPermission: 'emergency',
    // Notfall-Bereich nur für autorisierte Personen
    includeUsers: [], // Wird vom Backend befüllt
    security: 'critical'
  },
  {
    component: 'CNavItem',
    name: 'Notfall-Zugriff',
    to: '/emergency',
    icon: 'cil-warning',
    permission: ['emergency.access', 'system.emergency'],
    fallbackPermission: 'emergency',
    // Kritischer Notfall-Bereich
    security: 'critical',
    includeUsers: [], // Nur bestimmte Benutzer
    ipRestrictions: ['192.168.10.'], // Nur von Admin-Konsolen
    auditRequired: true,
    // Feature-Flag für Notfall-Modus
    featureFlag: 'emergency_mode_enabled',
    badge: {
      text: '🚨',
      color: 'danger'
    },
    // Zeitlich unbegrenzt (Notfälle können jederzeit auftreten)
    timeRestrictions: null
  }
]

// Plugin-Navigation aktualisieren
export function updatePluginNavigation(pluginNavigationItems = []) {
  // Plugin-Navigation mit erweiterten Sicherheitsfeatures
  const enhancedPluginNavigation = pluginNavigationItems.map(item => ({
    ...item,
    // Standard-Sicherheitslevel für Plugins
    security: item.security || 'medium',
    // Plugin-spezifische Einschränkungen
    departmentRestrictions: item.departmentRestrictions || ['IT'],
    // Plugin-Installation nur während Wartungszeiten
    timeRestrictions: item.timeRestrictions || {
      hours: [22, 6], // Wartungsfenster
      weekdays: [0, 6] // Wochenende
    },
    // Audit-Logging für alle Plugin-Aktionen
    auditRequired: true,
    // Plugin-Badge
    badge: item.badge || {
      text: 'Plugin',
      color: 'info'
    }
  }))
  
  return [...allNavigationItems, ...enhancedPluginNavigation]
}

// Sicherheitsstufen-Definition
export const SecurityLevels = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high',
  CRITICAL: 'critical'
}

// Dynamische Permission-Generierung basierend auf Kontext
export function generateContextualNavigation(user, context = {}) {
  // Basis-Navigation
  let contextualNavigation = [...allNavigationItems]
  
  // Notfall-Modus aktivieren
  if (context.emergencyMode) {
    contextualNavigation.push({
      component: 'CNavItem',
      name: 'Notfall-Dashboard',
      to: '/emergency-dashboard',
      icon: 'cil-warning',
      permission: ['emergency.dashboard'],
      security: 'critical',
      badge: {
        text: 'NOTFALL',
        color: 'danger'
      }
    })
  }
  
  // Wartungsmodus-Navigation
  if (context.maintenanceMode && user?.roles?.includes('ROLE_ADMIN')) {
    contextualNavigation.push({
      component: 'CNavItem',
      name: 'Wartung',
      to: '/maintenance',
      icon: 'cil-settings',
      permission: ['system.maintenance'],
      security: 'high',
      badge: {
        text: 'WARTUNG',
        color: 'warning'
      }
    })
  }
  
  // Compliance-spezifische Navigation
  if (user?.department === 'Legal' || user?.department === 'Compliance') {
    // Erweiterte Compliance-Navigation hinzufügen
    contextualNavigation.push({
      component: 'CNavItem',
      name: 'Löschanträge',
      to: '/deletion-requests',
      icon: 'cil-trash',
      permission: ['gdpr.deletion', 'privacy.requests'],
      security: 'high',
      departmentRestrictions: ['Legal', 'Compliance'],
      auditRequired: true,
      badge: {
        text: 'GDPR',
        color: 'info'
      }
    })
  }
  
  return contextualNavigation
}

// Navigation-Security-Helpers
export const NavigationSecurity = {
  /**
   * Prüft ob ein Navigation-Item kritisch ist
   */
  isCritical(item) {
    return item.security === SecurityLevels.CRITICAL
  },
  
  /**
   * Prüft ob ein Navigation-Item Audit-Logging benötigt
   */
  requiresAudit(item) {
    return item.auditRequired === true || this.isCritical(item)
  },
  
  /**
   * Gibt das Sicherheitslevel eines Navigation-Items zurück
   */
  getSecurityLevel(item) {
    return item.security || SecurityLevels.LOW
  },
  
  /**
   * Prüft ob ein Navigation-Item zeitliche Einschränkungen hat
   */
  hasTimeRestrictions(item) {
    return item.timeRestrictions !== null && item.timeRestrictions !== undefined
  },
  
  /**
   * Prüft ob ein Navigation-Item IP-Einschränkungen hat
   */
  hasIpRestrictions(item) {
    return Array.isArray(item.ipRestrictions) && item.ipRestrictions.length > 0
  },
  
  /**
   * Prüft ob ein Navigation-Item Abteilungs-Einschränkungen hat
   */
  hasDepartmentRestrictions(item) {
    return Array.isArray(item.departmentRestrictions) && item.departmentRestrictions.length > 0
  }
}

// Standard-Export - nur Dashboard für Kompatibilität
export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    public: true // Öffentlich zugänglich für nicht-authentifizierte Benutzer
  }
] 