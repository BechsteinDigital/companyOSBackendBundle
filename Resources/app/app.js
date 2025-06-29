// vendor/companyos/backend/Resources/app/app.js

// 1️⃣ CoreUI base styles
import '@coreui/coreui/dist/css/coreui.min.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import axios from 'axios'
import { useThemeStore } from './stores/theme.js'
import { useAuthStore, setupAutoRefresh } from './stores/auth.js'
import { useNavigationStore, navigationHelper } from './stores/navigation.js'

// CoreUI Icons & Components
import { iconsSet } from './icons'
import CIcon from '@coreui/icons-vue'
import {
  CContainer, CSidebar, CSidebarHeader, CSidebarBrand, CSidebarNav,
  CSidebarFooter, CSidebarToggler, CCloseButton, CHeader, CHeaderToggler,
  CHeaderNav, CNavItem, CNavLink, CFooter, CBreadcrumb, CBreadcrumbItem,
  CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownHeader,
  CDropdownDivider, CAvatar, CNavGroup, CNavTitle, CBadge, CCard, CCardHeader,
  CCardBody, CCardGroup, CCol, CRow, CButton, CForm, CFormInput,
  CInputGroup, CInputGroupText, CAlert, CSpinner, CListGroup, CListGroupItem,
  CWidgetStatsF
} from '@coreui/vue'

// Your root component
import App from './layout/App.vue'

// Vue components
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import Users from './views/Users.vue'
import Roles from './views/Roles.vue'
import Permissions from './views/Permissions.vue'
import Plugins from './views/Plugins.vue'
import Settings from './views/Settings.vue'
import Webhooks from './views/Webhooks.vue'
import ApiDocs from './views/ApiDocs.vue'
import SystemStatus from './views/SystemStatus.vue'

// Vue-Router setup mit erweiterten Permission-Guards
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard', 
    component: Dashboard,
    meta: { 
      requiresAuth: true,
      permission: 'dashboard.view',
      fallbackPermission: 'dashboard',
      securityLevel: 'low'  // Dashboard ist unkritisch - erlaubt Fallbacks
    }
  },
  // Administration Routes mit erweiterten Permissions
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { 
      requiresAuth: true, 
      permission: ['user.create', 'user.read', 'user.update', 'user.delete'],
      fallbackPermission: 'administration',
      // ABAC - Zeitbasierte Einschränkungen (Geschäftszeiten)
      timeRestrictions: {
        hours: [8, 18],
        weekdays: [1, 2, 3, 4, 5]
      },
      security: 'medium'
    }
  },
  {
    path: '/roles',
    name: 'Roles',
    component: Roles,
    meta: { 
      requiresAuth: true, 
      permission: ['role.create', 'role.read', 'role.update', 'role.delete'],
      fallbackPermission: 'administration',
      // ACL - Kritischer Bereich, nur für bestimmte Abteilungen
      departmentRestrictions: ['IT', 'Management', 'Security'],
      security: 'high',
      timeRestrictions: {
        hours: [9, 17],
        weekdays: [1, 2, 3, 4, 5]
      }
    }
  },
  {
    path: '/permissions',
    name: 'Permissions',
    component: Permissions,
    meta: { 
      requiresAuth: true, 
      permission: ['permission.read', 'role.read'],
      fallbackPermission: 'administration',
      // Hochsicherheitsbereich
      security: 'high',
      departmentRestrictions: ['IT', 'Security'],
      ipRestrictions: ['192.168.1.', '10.0.0.', '172.16.'],
      timeRestrictions: {
        hours: [9, 16],
        weekdays: [1, 2, 3, 4, 5]
      }
    }
  },
  // System Routes mit erweiterten Sicherheitsfeatures
  {
    path: '/plugins',
    name: 'Plugins',
    component: Plugins,
    meta: { 
      requiresAuth: true, 
      permission: ['plugin.create', 'plugin.read', 'plugin.update', 'plugin.delete'],
      fallbackPermission: 'system',
      // Plugin-Verwaltung ist kritisch
      security: 'high',
      departmentRestrictions: ['IT'],
      timeRestrictions: {
        hours: [22, 6], // Wartungsfenster
        weekdays: [0, 6] // Wochenende
      },
      auditRequired: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { 
      requiresAuth: true, 
      permission: ['settings.system', 'settings.read', 'settings.update'],
      fallbackPermission: 'system',
      // System-Einstellungen sind kritisch
      security: 'high',
      departmentRestrictions: ['IT', 'Management'],
      ipRestrictions: ['192.168.10.', '10.0.1.'],
      auditRequired: true
    }
  },
  {
    path: '/webhooks',
    name: 'Webhooks',
    component: Webhooks,
    meta: { 
      requiresAuth: true, 
      permission: ['webhook.create', 'webhook.read', 'webhook.update', 'webhook.delete'],
      fallbackPermission: 'system',
      security: 'medium',
      departmentRestrictions: ['IT', 'Development'],
      timeRestrictions: {
        hours: [8, 20],
        weekdays: [1, 2, 3, 4, 5, 6]
      }
    }
  },
  // Development Routes
  {
    path: '/api-docs',
    name: 'ApiDocs',
    component: ApiDocs,
    meta: { 
      requiresAuth: true, 
      permission: ['api.read', 'api.documentation'],
      fallbackPermission: 'development',
      departmentRestrictions: ['IT', 'Development'],
      ipRestrictions: ['192.168.', '10.0.', '172.16.'],
      security: 'medium'
    }
  },
  {
    path: '/system-status',
    name: 'SystemStatus',
    component: SystemStatus,
    meta: { 
      requiresAuth: true, 
      permission: ['system.monitoring', 'system.status'],
      fallbackPermission: 'development',
      departmentRestrictions: ['IT', 'Operations'],
      timeRestrictions: null, // Keine Zeiteinschränkungen
      security: 'medium'
    }
  },
  // Redirects
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/admin',
    redirect: '/dashboard'
  }
]

// Plugin loader helpers
async function loadActivePlugins() {
  try {
    const res = await axios.get('/api/plugins')
    const plugins = res.data
    return plugins.filter(p => p.active)
  } catch (e) {
    console.error('Failed to load plugins', e)
    return []
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    s.onload  = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
}

async function loadPluginEntrypoints(activePlugins) {
  for (const plugin of activePlugins) {
    const path = `/bundles/${plugin.name.toLowerCase()}/dist/plugin.js`
    try {
      await loadScript(path)
      console.log(`Loaded plugin: ${plugin.name}`)
    } catch (e) {
      console.error(`Error loading plugin ${plugin.name}`, e)
    }
  }
}

function registerPluginComponents(app, router, navigationStore) {
  for (const key of Object.keys(window)) {
    if (key.startsWith('plugin_') && typeof window[key] === 'object') {
      const { components = {}, routes = [], navigation = [] } = window[key]
      
      // Components registrieren
      Object.entries(components).forEach(([name, comp]) => {
        app.component(name, comp)
      })
      
      // Routes registrieren mit erweiterten Permission-Checks
      routes.forEach(r => {
        // Plugin-Routes mit Standard-Sicherheitsfeatures erweitern
        if (r.meta) {
          r.meta = {
            ...r.meta,
            security: r.meta.security || 'medium',
            departmentRestrictions: r.meta.departmentRestrictions || ['IT'],
            auditRequired: true
          }
        }
        router.addRoute(r)
      })
      
      // Navigation registrieren
      if (navigation.length > 0) {
        const enhancedNavigation = navigation.map(item => ({
          ...item,
          plugin: key.replace('plugin_', ''),
          security: item.security || 'medium',
          departmentRestrictions: item.departmentRestrictions || ['IT'],
          auditRequired: true
        }))
        
        navigationStore.addPluginNavigation(enhancedNavigation)
        console.log(`Registered navigation for plugin: ${key}`, enhancedNavigation)
      }
    }
  }
}

/**
 * Erweiterte Permission-Prüfung für Router-Guards
 */
async function checkAdvancedPermissions(to, auth, navigationStore) {
  if (!to.meta.permission) return true
  
  console.log(`🔍 Checking secure permissions for route: ${to.name}`)
  
  // Sichere Permission-Prüfung mit Backend-Validierung
  let hasPermission = false
  
  if (Array.isArray(to.meta.permission)) {
    // Mehrere Permissions - eine muss erfüllt sein
    for (const permission of to.meta.permission) {
      try {
        if (await auth.checkPermissionSecure(permission)) {
          hasPermission = true
          break
        }
      } catch (error) {
        console.error(`Permission check failed for ${permission}:`, error)
      }
    }
  } else {
    // Einzelne Permission
    try {
      hasPermission = await auth.checkPermissionSecure(to.meta.permission)
    } catch (error) {
      console.error(`Permission check failed for ${to.meta.permission}:`, error)
    }
  }
  
  // Fallback Permission prüfen wenn Hauptpermission fehlschlägt
  if (!hasPermission && to.meta.fallbackPermission) {
    try {
      hasPermission = await auth.checkPermissionSecure(to.meta.fallbackPermission)
    } catch (error) {
      console.error(`Fallback permission check failed for ${to.meta.fallbackPermission}:`, error)
    }
  }
  
  if (!hasPermission) {
    console.error(`❌ SECURE permission check FAILED for route: ${to.name}`)
    return false
  }
  
  // ABAC - Zeitbasierte Einschränkungen
  if (to.meta.timeRestrictions) {
    const now = new Date()
    const currentHour = now.getHours()
    const currentDay = now.getDay()
    
    if (to.meta.timeRestrictions.hours) {
      const [startHour, endHour] = to.meta.timeRestrictions.hours
      if (currentHour < startHour || currentHour > endHour) {
        console.warn(`Access denied: Route ${to.name} not accessible at ${currentHour}:00`)
        return false
      }
    }
    
    if (to.meta.timeRestrictions.weekdays && !to.meta.timeRestrictions.weekdays.includes(currentDay)) {
      console.warn(`Access denied: Route ${to.name} not accessible on weekday ${currentDay}`)
      return false
    }
  }
  
  // ABAC - Abteilungsbasierte Einschränkungen
  if (to.meta.departmentRestrictions && auth.user?.department) {
    if (!to.meta.departmentRestrictions.includes(auth.user.department)) {
      console.warn(`Access denied: Route ${to.name} not accessible for department ${auth.user.department}`)
      return false
    }
  }
  
  // Audit-Logging für kritische Routen (vereinfacht)
  if (to.meta.auditRequired || to.meta.security === 'high' || to.meta.security === 'critical') {
    console.log('🔒 Route Access Audit:', {
      user: auth.user?.id,
      email: auth.user?.email,
      route: to.name,
      path: to.path,
      permissions: to.meta.permission,
      security: to.meta.security,
      timestamp: new Date().toISOString()
    })
  }
  
  return true
}

/**
 * Navigation Context für ABAC initialisieren
 */
async function initializeNavigationContext(navigationStore, auth) {
  try {
    // IP-Adresse ermitteln (vereinfacht)
    const ipResponse = await fetch('https://api.ipify.org?format=json')
    const ipData = await ipResponse.json()
    
    // Browser-Informationen sammeln
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const language = navigator.language
    const userAgent = navigator.userAgent
    
    // Navigation Context logging (vereinfacht)
    console.log('🌐 Navigation context initialized:', {
      ipAddress: ipData.ip,
      timezone: timezone,
      language: language,
      userAgent: userAgent,
      location: auth.user?.location || null,
      department: auth.user?.department || null,
      sessionStart: new Date().toISOString()
    })
  } catch (error) {
    console.warn('⚠️ Failed to initialize navigation context:', error)
  }
}

// ─────────────────────────────────────────────
// Initialization
// ─────────────────────────────────────────────
async function initializeApp() {
  // 1) Create app & Pinia
  const app = createApp(App)
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)

  // 2) Set up Auth store + auto-refresh
  const auth = useAuthStore()
  const navigationStore = useNavigationStore()
  
  auth.loadTokens()
  
  // Initialisierung der Authentifizierung
  if (auth.accessToken) {
    try {
      await auth.fetchProfile()
      setupAutoRefresh(auth)
    } catch (error) {
      console.log('Profile loading failed, user will be redirected to login')
      // Don't logout here, let the router guard handle it
    }
  }

  // 3) Axios interceptors
  axios.interceptors.request.use(cfg => {
    if (auth.accessToken) {
      cfg.headers.Authorization = `Bearer ${auth.accessToken}`
    }
    cfg.headers['X-Requested-With'] = 'XMLHttpRequest'
    return cfg
  })
  axios.interceptors.response.use(
    res => res,
    async err => {
      if (err.response?.status === 401 && auth.refreshToken) {
        const ok = await auth.refresh()
        if (ok) {
          err.config.headers.Authorization = `Bearer ${auth.accessToken}`
          return axios(err.config)
        }
      }
      
      // Nur logout wenn es nicht der Profile-Endpoint ist
      // (Profile-Endpoint handled logout selbst)
      if (err.response?.status === 401 && !err.config?.url?.includes('/profile')) {
      auth.logout()
      }
      
      return Promise.reject(err)
    }
  )

  // 4) Register CoreUI icons & components
  app.component('CIcon', CIcon)
  app.provide('icons', iconsSet)
  ;[
    CContainer, CSidebar, CSidebarHeader, CSidebarBrand, CSidebarNav,
    CSidebarFooter, CSidebarToggler, CCloseButton, CHeader, CHeaderToggler,
    CHeaderNav, CNavItem, CNavLink, CFooter, CBreadcrumb, CBreadcrumbItem,
    CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownHeader,
    CDropdownDivider, CAvatar, CNavGroup, CNavTitle, CBadge, CCard,
    CCardHeader, CCardBody, CCardGroup, CCol, CRow, CButton, CForm,
    CFormInput, CInputGroup, CInputGroupText, CAlert, CSpinner,
    CListGroup, CListGroupItem, CWidgetStatsF
  ].forEach(comp => app.component(comp.name, comp))

  // 5) Router & erweiterte Guards
  const router = createRouter({
    history: createWebHistory('/admin'),
    routes
  })
  
  router.beforeEach(async (to, from, next) => {
    console.log(`🔐 Router Guard: ${from.path} → ${to.path}`)
    
    // Wenn Login-Seite aufgerufen wird und Token vorhanden ist
    if (to.path === '/login' && auth.accessToken) {
      return next('/dashboard')
    }
    
    // Wenn Route keine Authentifizierung erfordert
    if (!to.meta.requiresAuth) {
      return next()
    }
    
    // Wenn kein Access Token vorhanden ist
    if (!auth.accessToken) {
      console.log('❌ No access token, redirecting to login')
      return next('/login')
    }
    
    // Wenn Access Token vorhanden ist, aber User-Profil noch nicht geladen
    if (auth.accessToken && !auth.user && !auth.loading) {
      try {
        await auth.fetchProfile()
      } catch (error) {
        console.error('Failed to load user profile:', error)
        auth.logout()
        return next('/login')
      }
    }
    
    // Legacy Rollenprüfung (optimistisch)
    if (to.meta.requiresRole) {
      console.log(`ℹ️ Role requirement detected for route: ${to.name} - granting optimistic access`)
      // Optimistische Berechtigung für bessere UX
    }
    
    // Sichere Permission-Prüfung mit Backend-Validierung
    if (to.meta.permission && auth.user && auth.accessToken) {
      try {
        const hasPermission = await checkAdvancedPermissions(to, auth, navigationStore)
        if (!hasPermission) {
          console.error(`❌ SECURE permission check FAILED for route: ${to.name}`)
          
          // Für unkritische Routen: Fallback auf Frontend-Check
          if (to.meta.securityLevel === 'low') {
            const frontendCheck = auth.canAccess(to.meta.permission || to.meta.fallbackPermission)
            if (frontendCheck) {
              console.warn(`⚠️ Using frontend fallback for route: ${to.name} (backend check failed)`)
            } else {
              console.error(`❌ Even frontend fallback failed for route: ${to.name}`)
              return next('/dashboard')
            }
          } else {
            // Für kritische Routen: Zugriff verweigern
            console.error(`🚨 Critical route access DENIED: ${to.name}`)
            return next('/dashboard')
          }
        }
      } catch (error) {
        console.error(`🚨 Permission check error for route ${to.name}:`, error)
        
        // Bei Fehlern: Nur unkritische Routen erlauben
        if (to.meta.securityLevel !== 'low') {
          return next('/dashboard')
        }
      }
    }
    
    // Legacy Permission-Prüfung ist nicht mehr nötig - wird durch sichere Checks ersetzt
    
    console.log(`✅ Access granted to route: ${to.name}`)
    next()
  })
  
  app.use(router)

  // 6) Dynamic plugin loading (only if authenticated)
  if (auth.accessToken) {
    const activePlugins = await loadActivePlugins()
    await loadPluginEntrypoints(activePlugins)
    registerPluginComponents(app, router, navigationStore)
  }

  // 7) Mount
  app.mount('#app')
  
  console.log('🚀 CompanyOS Backend initialized with enhanced RBAC/ABAC/ACL security')
  
  // 8) Debug-Modus aktivieren (nur in Development)
  if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    console.log('🔧 Debug-Modus aktiviert')
    console.log('💡 Verwenden Sie in der Browser-Konsole:')
    console.log('   - diagnosePermissions() für Permission-Diagnose')
    console.log('   - debugPermissions für erweiterte Debug-Funktionen')
    
    // Debug-Tools lazy laden um Circular Dependencies zu vermeiden
    setTimeout(async () => {
      if (auth.user) {
        try {
          const { permissionsDebug } = await import('./utils/permissions-debug.js')
          console.log('🔍 Automatische Permission-Diagnose gestartet...')
          permissionsDebug.diagnoseProblems()
        } catch (error) {
          console.warn('Debug-Tools konnten nicht geladen werden:', error)
        }
      }
    }, 2000)
  }
}

initializeApp()
