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

// Vue-Router setup
const routes = [ /* … your route definitions … */ ]

// Plugin loader helpers
async function loadActivePlugins() {
  try {
    const res = await fetch('/api/plugins')
    const plugins = await res.json()
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
  if (auth.accessToken) {
    await auth.fetchProfile()
    setupAutoRefresh(auth)
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
      auth.logout()
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
  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !auth.accessToken) return next('/login')
    if (to.path === '/login' && auth.accessToken)    return next('/dashboard')
    if (to.meta.requiresRole && !auth.hasRole(to.meta.requiresRole)) {
      return next('/dashboard')
    }
    next()
  })
  app.use(router)

  // 6) Dynamic plugin loading
  const activePlugins = await loadActivePlugins()
  await loadPluginEntrypoints(activePlugins)
  registerPluginComponents(app, router)

  // 7) Mount
  app.mount('#app')
}

initializeApp()
