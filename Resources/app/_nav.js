// Alle verfügbaren Navigation-Items
export const allNavigationItems = [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    permission: 'dashboard'
  },
  {
    component: 'CNavTitle',
    name: 'Verwaltung',
    permission: 'administration'
  },
  {
    component: 'CNavItem',
    name: 'Benutzer',
    to: '/users',
    icon: 'cil-user',
    permission: 'administration'
  },
  {
    component: 'CNavItem',
    name: 'Rollen',
    to: '/roles',
    icon: 'cil-lock-locked',
    permission: 'administration'
  },
  {
    component: 'CNavItem',
    name: 'Berechtigungen',
    to: '/permissions',
    icon: 'cil-shield-alt',
    permission: 'administration'
  },
  {
    component: 'CNavTitle',
    name: 'System',
    permission: 'system'
  },
  {
    component: 'CNavItem',
    name: 'Plugins',
    to: '/plugins',
    icon: 'cil-puzzle',
    permission: 'system'
  },
  {
    component: 'CNavItem',
    name: 'Einstellungen',
    to: '/settings',
    icon: 'cil-settings',
    permission: 'system'
  },
  {
    component: 'CNavItem',
    name: 'Webhooks',
    to: '/webhooks',
    icon: 'cil-link',
    permission: 'system'
  },
  {
    component: 'CNavTitle',
    name: 'Entwicklung',
    permission: 'development'
  },
  {
    component: 'CNavItem',
    name: 'API-Dokumentation',
    to: '/api-docs',
    icon: 'cil-code',
    permission: 'development'
  },
  {
    component: 'CNavItem',
    name: 'System-Status',
    to: '/system-status',
    icon: 'cil-chart',
    permission: 'development'
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