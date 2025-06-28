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

// Vue-Router setup
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
    meta: { requiresAuth: true }
  },
  // Administration Routes
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true, permission: 'administration' }
  },
  {
    path: '/roles',
    name: 'Roles',
    component: Roles,
    meta: { requiresAuth: true, permission: 'administration' }
  },
  {
    path: '/permissions',
    name: 'Permissions',
    component: Permissions,
    meta: { requiresAuth: true, permission: 'administration' }
  },
  // System Routes
  {
    path: '/plugins',
    name: 'Plugins',
    component: Plugins,
    meta: { requiresAuth: true, permission: 'system' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true, permission: 'system' }
  },
  {
    path: '/webhooks',
    name: 'Webhooks',
    component: Webhooks,
    meta: { requiresAuth: true, permission: 'system' }
  },
  // Development Routes
  {
    path: '/api-docs',
    name: 'ApiDocs',
    component: ApiDocs,
    meta: { requiresAuth: true, permission: 'development' }
  },
  {
    path: '/system-status',
    name: 'SystemStatus',
    component: SystemStatus,
    meta: { requiresAuth: true, permission: 'development' }
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

function registerPluginComponents(app, router) {
  for (const key of Object.keys(window)) {
    if (key.startsWith('plugin_') && typeof window[key] === 'object') {
      const { components = {}, routes = [] } = window[key]
      Object.entries(components).forEach(([name, comp]) => {
        app.component(name, comp)
      })
      routes.forEach(r => router.addRoute(r))
    }
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

  // 5) Router & guards
  const router = createRouter({
    history: createWebHistory('/admin'),
    routes
  })
  router.beforeEach(async (to, from, next) => {
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
    
    // Rollenprüfung
    if (to.meta.requiresRole && !auth.hasRole(to.meta.requiresRole)) {
      return next('/dashboard')
    }
    
    // Permission-Prüfung
    if (to.meta.permission && !auth.canAccess(to.meta.permission)) {
      return next('/dashboard')
    }
    
    next()
  })
  app.use(router)

  // 6) Dynamic plugin loading (only if authenticated)
  if (auth.accessToken) {
  const activePlugins = await loadActivePlugins()
  await loadPluginEntrypoints(activePlugins)
  registerPluginComponents(app, router)
  }

  // 7) Mount
  app.mount('#app')
}

initializeApp()
