// Alle verfügbaren Navigation-Items mit spezifischen Berechtigungen
export const allNavigationItems = [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    permission: 'dashboard.view', // Spezifische Permission
    fallbackPermission: 'dashboard' // Fallback für Legacy-Systeme
  },
  {
    component: 'CNavTitle',
    name: 'Verwaltung',
    permission: ['user.read', 'role.read'], // Mehrere Permissions (mindestens eine)
    fallbackPermission: 'administration'
  },
  {
    component: 'CNavItem',
    name: 'Benutzer',
    to: '/users',
    icon: 'cil-user',
    permission: ['user.create', 'user.read', 'user.update', 'user.delete'], // User-Management
    fallbackPermission: 'administration'
  },
  {
    component: 'CNavItem',
    name: 'Rollen',
    to: '/roles',
    icon: 'cil-lock-locked',
    permission: ['role.create', 'role.read', 'role.update', 'role.delete'], // Rollen-Management
    fallbackPermission: 'administration'
  },
  {
    component: 'CNavItem',
    name: 'Berechtigungen',
    to: '/permissions',
    icon: 'cil-shield-alt',
    permission: ['permission.read', 'role.read'], // Permission-Verwaltung
    fallbackPermission: 'administration'
  },
  {
    component: 'CNavTitle',
    name: 'System',
    permission: ['plugin.read', 'settings.read'], // System-Zugriff
    fallbackPermission: 'system'
  },
  {
    component: 'CNavItem',
    name: 'Plugins',
    to: '/plugins',
    icon: 'cil-puzzle',
    permission: ['plugin.create', 'plugin.read', 'plugin.update', 'plugin.delete'], // Plugin-Management
    fallbackPermission: 'system'
  },
  {
    component: 'CNavItem',
    name: 'Einstellungen',
    to: '/settings',
    icon: 'cil-settings',
    permission: ['settings.system', 'settings.read', 'settings.update'], // Einstellungen
    fallbackPermission: 'system'
  },
  {
    component: 'CNavItem',
    name: 'Webhooks',
    to: '/webhooks',
    icon: 'cil-link',
    permission: ['webhook.create', 'webhook.read', 'webhook.update', 'webhook.delete'], // Webhook-Management
    fallbackPermission: 'system'
  },
  {
    component: 'CNavTitle',
    name: 'Entwicklung',
    permission: ['api.read', 'system.logs'], // Development-Zugriff
    fallbackPermission: 'development'
  },
  {
    component: 'CNavItem',
    name: 'API-Dokumentation',
    to: '/api-docs',
    icon: 'cil-code',
    permission: ['api.read', 'api.documentation'], // API-Dokumentation
    fallbackPermission: 'development'
  },
  {
    component: 'CNavItem',
    name: 'System-Status',
    to: '/system-status',
    icon: 'cil-chart',
    permission: ['system.monitoring', 'system.status'], // System-Monitoring
    fallbackPermission: 'development'
  }
]

// Plugin-Navigation aktualisieren
export function updatePluginNavigation(pluginNavigationItems = []) {
  // Hier können Plugin-spezifische Navigation-Items hinzugefügt werden
  return [...allNavigationItems, ...pluginNavigationItems]
}

// Standard-Export - nur Dashboard für Kompatibilität
export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  }
] 