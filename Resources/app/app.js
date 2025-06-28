import '@coreui/coreui/dist/css/coreui.min.css';

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import axios from 'axios'
import { useColorModes } from '@coreui/vue'
import { useThemeStore } from './stores/theme.js'
import { useAuthStore, setupAutoRefresh } from './stores/auth.js'

// CoreUI Icons
import { iconsSet } from './icons'
import CIcon from '@coreui/icons-vue'

// CoreUI Components
import {
  CContainer,
  CSidebar,
  CSidebarHeader,
  CSidebarBrand,
  CSidebarNav,
  CSidebarFooter,
  CSidebarToggler,
  CCloseButton,
  CHeader,
  CHeaderToggler,
  CHeaderNav,
  CNavItem,
  CNavLink,
  CFooter,
  CBreadcrumb,
  CBreadcrumbItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownHeader,
  CDropdownDivider,
  CAvatar,
  CNavGroup,
  CNavTitle,
  CBadge,
  CCard,
  CCardHeader,
  CCardBody,
  CCardGroup,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CSpinner,
  CListGroup,
  CListGroupItem,
  CWidgetStatsF
} from '@coreui/vue'

// Layout
import App from './layout/App.vue'

// Views (werden später erstellt)
import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'

// Routing
const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
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
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('./views/Users.vue'),
    meta: { requiresAuth: true, requiresRole: 'ROLE_ADMIN' }
  },
  {
    path: '/roles',
    name: 'Roles',
    component: () => import('./views/Roles.vue'),
    meta: { requiresAuth: true, requiresRole: 'ROLE_ADMIN' }
  },
  {
    path: '/permissions',
    name: 'Permissions',
    component: () => import('./views/Permissions.vue'),
    meta: { requiresAuth: true, requiresRole: 'ROLE_ADMIN' }
  },
  {
    path: '/plugins',
    name: 'Plugins',
    component: () => import('./views/Plugins.vue'),
    meta: { requiresAuth: true, requiresRole: 'ROLE_ADMIN' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./views/Settings.vue'),
    meta: { requiresAuth: true, requiresRole: 'ROLE_ADMIN' }
  },
  {
    path: '/webhooks',
    name: 'Webhooks',
    component: () => import('./views/Webhooks.vue'),
    meta: { requiresAuth: true, requiresRole: 'ROLE_ADMIN' }
  },
  {
    path: '/api-docs',
    name: 'ApiDocs',
    component: () => import('./views/ApiDocs.vue'),
    meta: { requiresAuth: true, requiresRole: 'ROLE_ADMIN' }
  }
]

const router = createRouter({
  history: createWebHistory('/admin'),
  routes
})

// App erstellen
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Core-Komponenten importieren
import * as coreComponents from './components'

// Core-Komponenten global registrieren
Object.entries(coreComponents).forEach(([name, component]) => {
    app.component(name, component)
})

// Plugin-Status über API laden
async function loadActivePlugins() {
    try {
        const response = await fetch('/api/plugins')
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const plugins = await response.json()
        const activePlugins = plugins.filter(plugin => plugin.active)
        
        console.log('Aktive Plugins gefunden:', activePlugins.map(p => p.name))
        return activePlugins
    } catch (error) {
        console.error('Fehler beim Laden der aktiven Plugins:', error)
        return []
    }
}

// Plugin-Entrypoints dynamisch laden
async function loadPluginEntrypoints(activePlugins) {
    console.log('Lade Plugin-Entrypoints für:', activePlugins.map(p => p.name))
    
    for (const plugin of activePlugins) {
        const entrypointPath = `/bundles/${plugin.name.toLowerCase()}/dist/plugin.js`
        
        try {
            // Plugin-Script dynamisch laden
            await loadScript(entrypointPath)
            console.log(`✅ Plugin geladen: ${plugin.name}`)
        } catch (error) {
            console.error(`❌ Plugin-Fehler: ${plugin.name}`, error)
        }
    }
}

// Script dynamisch laden
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
    })
}

// Plugin-Komponenten registrieren (nach dem Laden der Scripts)
function registerPluginComponents() {
    Object.keys(window).forEach(key => {
        if (key.startsWith('plugin_') && typeof window[key] === 'object') {
            const pluginName = key.replace('plugin_', '')
            console.log(`Plugin-Komponenten registrieren: ${pluginName}`)
            
            // Plugin-Komponenten registrieren
            if (window[key].components) {
                Object.entries(window[key].components).forEach(([componentName, component]) => {
                    app.component(componentName, component)
                })
            }
            
            // Plugin-Routen hinzufügen
            if (window[key].routes) {
                window[key].routes.forEach(route => {
                    router.addRoute(route)
                })
            }
        }
    })
}

// App initialisieren
async function initializeApp() {
    // Plugin-Status über API laden
    const activePlugins = await loadActivePlugins()
    
    // Plugin-Entrypoints laden
    await loadPluginEntrypoints(activePlugins)
    
    // Plugin-Komponenten registrieren
    registerPluginComponents()
    
    // App mounten
    app.use(pinia)
    app.use(router)
    app.mount('#app')
}

// App starten
initializeApp()

// CoreUI Icons korrekt konfigurieren
app.component('CIcon', CIcon)
app.provide('icons', iconsSet)

// CoreUI Components
app.component('CContainer', CContainer)
app.component('CSidebar', CSidebar)
app.component('CSidebarHeader', CSidebarHeader)
app.component('CSidebarBrand', CSidebarBrand)
app.component('CSidebarNav', CSidebarNav)
app.component('CSidebarFooter', CSidebarFooter)
app.component('CSidebarToggler', CSidebarToggler)
app.component('CCloseButton', CCloseButton)
app.component('CHeader', CHeader)
app.component('CHeaderToggler', CHeaderToggler)
app.component('CHeaderNav', CHeaderNav)
app.component('CNavItem', CNavItem)
app.component('CNavLink', CNavLink)
app.component('CFooter', CFooter)
app.component('CBreadcrumb', CBreadcrumb)
app.component('CBreadcrumbItem', CBreadcrumbItem)
app.component('CDropdown', CDropdown)
app.component('CDropdownToggle', CDropdownToggle)
app.component('CDropdownMenu', CDropdownMenu)
app.component('CDropdownItem', CDropdownItem)
app.component('CDropdownHeader', CDropdownHeader)
app.component('CDropdownDivider', CDropdownDivider)
app.component('CAvatar', CAvatar)
app.component('CNavGroup', CNavGroup)
app.component('CNavTitle', CNavTitle)
app.component('CBadge', CBadge)
app.component('CCard', CCard)
app.component('CCardHeader', CCardHeader)
app.component('CCardBody', CCardBody)
app.component('CCardGroup', CCardGroup)
app.component('CCol', CCol)
app.component('CRow', CRow)
app.component('CButton', CButton)
app.component('CForm', CForm)
app.component('CFormInput', CFormInput)
app.component('CInputGroup', CInputGroup)
app.component('CInputGroupText', CInputGroupText)
app.component('CAlert', CAlert)
app.component('CSpinner', CSpinner)
app.component('CListGroup', CListGroup)
app.component('CListGroupItem', CListGroupItem)
app.component('CWidgetStatsF', CWidgetStatsF)

// Auth-Store initialisieren
const auth = useAuthStore()
auth.loadTokens()

// User-Profil laden falls Token vorhanden
if (auth.accessToken) {
  auth.fetchProfile()
}

// Router-Guard mit Store und Rollenprüfung
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.accessToken) {
    next('/login')
  } else if (to.path === '/login' && auth.accessToken) {
    next('/dashboard')
  } else if (to.meta.requiresRole && !auth.hasRole(to.meta.requiresRole)) {
    // Benutzer hat nicht die erforderliche Rolle
    next('/dashboard')
  } else {
    next()
  }
})

// Axios Interceptor mit Store
axios.interceptors.request.use(config => {
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  
  // Security Headers
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
  
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401 && auth.refreshToken) {
      const refreshed = await auth.refresh()
      if (refreshed) {
        err.config.headers.Authorization = `Bearer ${auth.accessToken}`
        return axios(err.config)
      } else {
        auth.logout()
        router.push('/login')
      }
    }
    
    return Promise.reject(err)
  }
) 