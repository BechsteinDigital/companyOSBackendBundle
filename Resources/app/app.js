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
    path: '/users',
    name: 'Users',
    component: () => import('./views/Users.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/roles',
    name: 'Roles',
    component: () => import('./views/Roles.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/permissions',
    name: 'Permissions',
    component: () => import('./views/Permissions.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/plugins',
    name: 'Plugins',
    component: () => import('./views/Plugins.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./views/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/webhooks',
    name: 'Webhooks',
    component: () => import('./views/Webhooks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/api-docs',
    name: 'ApiDocs',
    component: () => import('./views/ApiDocs.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/system-status',
    name: 'SystemStatus',
    component: () => import('./views/SystemStatus.vue'),
    meta: { requiresAuth: true }
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
app.use(router)
app.use(pinia)

// Auth-Store initialisieren
const auth = useAuthStore()
auth.loadTokens()
setupAutoRefresh()

// Router-Guard mit Store
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.accessToken) {
    next('/login')
  } else if (to.path === '/login' && auth.accessToken) {
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
  
  // CSRF-Token für alle POST/PUT/DELETE Requests hinzufügen
  if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase()) && auth.csrfToken) {
    config.headers['X-CSRF-TOKEN'] = auth.csrfToken
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
    
    // CSRF-Token Fehler behandeln
    if (err.response?.status === 419) {
      // CSRF-Token erneuern und Request wiederholen
      await auth.fetchCsrfToken()
      if (auth.csrfToken) {
        err.config.headers['X-CSRF-TOKEN'] = auth.csrfToken
        return axios(err.config)
      }
    }
    
    return Promise.reject(err)
  }
)

// Theme-Color-Mode Handling wie im CoreUIAdminTemplate (jetzt nach app.use(pinia))
const { isColorModeSet, setColorMode } = useColorModes('companyos-admin-theme')
const currentTheme = useThemeStore()

app.mixin({
  beforeMount() {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    let theme = urlParams.get('theme')
    if (theme !== null && theme.match(/^[A-Za-z0-9\s]+/)) {
      theme = theme.match(/^[A-Za-z0-9\s]+/)[0]
    }
    if (theme) {
      setColorMode(theme)
      return
    }
    if (isColorModeSet()) {
      return
    }
    setColorMode(currentTheme.theme)
  }
})

// CoreUI Icons global verfügbar machen
app.component('CIcon', CIcon)
app.provide('icons', iconsSet)

// CoreUI Components global registrieren
const coreuiComponents = {
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
}

Object.entries(coreuiComponents).forEach(([name, component]) => {
  app.component(name, component)
})

// Globale $api-Methoden
app.config.globalProperties.$api = {
  // API-Methoden werden hier hinzugefügt
}

// Mounten
app.mount('#app') 
