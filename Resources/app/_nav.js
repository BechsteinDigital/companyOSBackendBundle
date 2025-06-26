export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavTitle',
    name: 'Verwaltung',
  },
  {
    component: 'CNavItem',
    name: 'Benutzer',
    to: '/users',
    icon: 'cil-user',
  },
  {
    component: 'CNavItem',
    name: 'Rollen',
    to: '/roles',
    icon: 'cil-lock-locked',
  },
  {
    component: 'CNavItem',
    name: 'Berechtigungen',
    to: '/permissions',
    icon: 'cil-shield-alt',
  },
  {
    component: 'CNavTitle',
    name: 'System',
  },
  {
    component: 'CNavItem',
    name: 'Plugins',
    to: '/plugins',
    icon: 'cil-puzzle',
  },
  {
    component: 'CNavItem',
    name: 'Einstellungen',
    to: '/settings',
    icon: 'cil-settings',
  },
  {
    component: 'CNavItem',
    name: 'Webhooks',
    to: '/webhooks',
    icon: 'cil-link',
  },
  {
    component: 'CNavTitle',
    name: 'Entwicklung',
  },
  {
    component: 'CNavItem',
    name: 'API-Dokumentation',
    to: '/api-docs',
    icon: 'cil-code',
  },
  {
    component: 'CNavItem',
    name: 'System-Status',
    to: '/system-status',
    icon: 'cil-chart',
  },
] 