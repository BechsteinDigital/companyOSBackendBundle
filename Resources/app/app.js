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
  },
  {
    path: '/system-status',
    name: 'SystemStatus',
    component: () => import('./views/SystemStatus.vue'),
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

app.use(pinia)
app.use(router)

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

// Auto-Refresh Setup
setupAutoRefresh()

// App mounten
app.mount('#app') 
