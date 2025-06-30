import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import CompanyOS from './core/companyos'
import './styles/index.scss'

// Core Components
import CoPage from './component/structure/co-page'
import CoCard from './component/base/co-card'
import CoButton from './component/base/co-button'
import CoModal from './component/base/co-modal'
import CoSidebar from './component/structure/co-sidebar'
import CoHeader from './component/structure/co-header'

// Modules
import DashboardModule from './module/co-dashboard'
import UsersModule from './module/co-users'
import PluginsModule from './module/co-plugins'
import SettingsModule from './module/co-settings'

// Create Vue App
const app = createApp({
  template: `
    <co-sidebar />
    <div class="admin-content">
      <co-header />
      <main class="admin-main">
        <router-view />
      </main>
    </div>
  `
})

// Register Core Components
app.component('CoPage', CoPage)
app.component('CoCard', CoCard)
app.component('CoButton', CoButton)
app.component('CoModal', CoModal)
app.component('CoSidebar', CoSidebar)
app.component('CoHeader', CoHeader)

// Create Router
const router = createRouter({
  history: createWebHistory('/admin/'),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./module/co-dashboard/page/co-dashboard-index')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('./module/co-users/page/co-users-list')
    },
    {
      path: '/plugins',
      name: 'plugins',
      component: () => import('./module/co-plugins/page/co-plugins-list')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./module/co-settings/page/co-settings-index')
    }
  ]
})

// Create Pinia Store
const pinia = createPinia()

// Initialize CompanyOS Core
const companyOS = new CompanyOS()

// Register Modules
companyOS.registerModule(DashboardModule)
companyOS.registerModule(UsersModule)
companyOS.registerModule(PluginsModule)
companyOS.registerModule(SettingsModule)

// Mount App
app.use(router)
app.use(pinia)
app.use(companyOS)

app.mount('#companyos-admin')

// Export for plugin system
window.CompanyOS = companyOS 