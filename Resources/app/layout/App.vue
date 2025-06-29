<template>
  <div>
    <AppSidebar v-if="showLayout" />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader v-if="showLayout" />
      <div class="body flex-grow-1">
        <CContainer class="px-4" lg>
          <router-view />
        </CContainer>
      </div>
      <AppFooter v-if="showLayout" />
    </div>
    
    <!-- Plugin Components Overlay -->
    <div v-if="showLayout && activePluginComponents.length > 0" class="plugin-components-overlay">
      <div v-for="component in activePluginComponents" :key="component.name" class="plugin-component">
        <component 
          :is="component.name"
          v-bind="component.props || {}"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppSidebar from '../components/AppSidebar.vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { updatePluginNavigation } from '../_nav.js'

const route = useRoute()
const auth = useAuthStore()
const showLayout = computed(() => route.path !== '/login')
const activePluginComponents = ref([])

// Auth-Store beim App-Start initialisieren
onMounted(async () => {
  // Stelle sicher, dass der Auth-Store geladen ist
  auth.loadTokens()
  
  // Plugin-Komponenten laden
  await loadPluginComponents()
})

// Plugin-Komponenten laden
const loadPluginComponents = async () => {
  try {
    // Nur eingeloggte Benutzer können Plugins laden
    if (!auth.accessToken) {
      return
    }
    
    const response = await fetch('/api/plugins', {
      headers: {
        'Authorization': `Bearer ${auth.accessToken}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      
      // Korrekte API-Response-Struktur: { success: true, data: [...] }
      const plugins = result.data || result
      
      // Prüfen ob plugins ein Array ist
      if (!Array.isArray(plugins)) {
        console.warn('Plugin API returned non-array data:', plugins)
        return
      }
      
      // Nur aktive Plugins verarbeiten
      const activePlugins = plugins.filter(plugin => plugin.isActive || plugin.active)
      
      console.log('Aktive Plugins geladen:', activePlugins)
      
      // Plugin-Assets laden (falls vorhanden)
      for (const plugin of activePlugins) {
        if (plugin.assets) {
          if (plugin.assets.css) {
            await loadCSS(plugin.assets.css)
          }
          if (plugin.assets.js) {
            await loadJS(plugin.assets.js)
          }
        }
      }
    }
  } catch (error) {
    console.error('Fehler beim Laden der Plugin-Komponenten:', error)
  }
}

// Plugin-Navigation laden (wird jetzt über /api/plugins abgedeckt)
const loadPluginNavigation = async () => {
  // Navigation wird jetzt über den Plugin-Endpoint geladen
  console.log('Plugin-Navigation wird über /api/plugins geladen')
}

// Aktive Plugin-Komponenten laden
async function loadActivePluginComponents() {
  try {
    if (!auth.accessToken) {
      return
    }
    
    const response = await fetch('/api/plugins', {
      headers: {
        'Authorization': `Bearer ${auth.accessToken}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      const plugins = result.data || result
      
      // Prüfen ob plugins ein Array ist
      if (!Array.isArray(plugins)) {
        console.warn('Plugin API returned non-array data:', plugins)
        return
      }
      
      // Nur aktive Plugins mit Frontend-Komponenten
      const components = []
      for (const plugin of plugins) {
        if ((plugin.isActive || plugin.active) && plugin.frontendComponents) {
          for (const [componentName, componentConfig] of Object.entries(plugin.frontendComponents)) {
            if (componentConfig.overlay) {
              components.push({
                name: componentName,
                props: componentConfig.props || {},
                plugin: plugin.name
              })
            }
          }
        }
      }
      
      activePluginComponents.value = components
      console.log('✅ Aktive Plugin-Overlay-Komponenten geladen:', components.length)
    }
  } catch (error) {
    console.error('❌ Fehler beim Laden der Plugin-Komponenten:', error)
  }
}

// Helper-Funktionen für CSS und JS-Loading
async function loadCSS(cssPath) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = cssPath
  document.head.appendChild(link)
}

async function loadJS(jsPath) {
  const script = document.createElement('script')
  script.src = jsPath
  document.head.appendChild(script)
}
</script>

<style lang="scss">
@use '../styles/style' as *;

.plugin-components-overlay {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem;
  pointer-events: none;
}

.plugin-component {
  pointer-events: auto;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}
</style> 
