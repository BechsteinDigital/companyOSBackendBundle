import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import './styles/index.scss'

// Simple Debug Component
const DebugComponent = {
  template: `
    <div class="debug-component">
      <h1>Vue.js funktioniert!</h1>
      <p>Das ist ein Test um zu sehen ob Vue.js korrekt rendert.</p>
      <router-view />
    </div>
  `
}

// Create Vue App with Debug Component
const app = createApp(DebugComponent)

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
      component: {
        template: '<div><h2>Dashboard</h2><p>Dashboard-Inhalt würde hier stehen.</p></div>'
      }
    }
  ]
})

// Create Pinia Store
const pinia = createPinia()

// Mount App
app.use(router)
app.use(pinia)

app.mount('#companyos-admin')

// Export for plugin system
window.CompanyOS = {} 