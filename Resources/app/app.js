import '@coreui/coreui/dist/css/coreui.min.css';

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import axios from 'axios'

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
  history: createWebHistory(),
  routes
})

// Auth Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

// Axios global konfigurieren
axios.defaults.baseURL = '/api'
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

// App erstellen
const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

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