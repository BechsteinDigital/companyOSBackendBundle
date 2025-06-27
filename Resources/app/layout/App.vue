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
    const response = await fetch('/admin/plugin-components')
    if (response.ok) {
      const plugins = await response.json()
      
      // Plugin-Komponenten laden
      for (const plugin of plugins) {
        if (plugin.css) {
          await loadCSS(plugin.css)
        }
        if (plugin.js) {
          await loadJS(plugin.js)
        }
      }
      
      // Plugin-Navigation laden
      await loadPluginNavigation()
      
      console.log('Plugin-Komponenten geladen:', plugins)
    }
  } catch (error) {
    console.error('Fehler beim Laden der Plugin-Komponenten:', error)
  }
}

// Plugin-Navigation laden
const loadPluginNavigation = async () => {
  try {
    const response = await fetch('/admin/plugin-navigation')
    if (response.ok) {
      const pluginNav = await response.json()
      updatePluginNavigation(pluginNav)
      console.log('Plugin-Navigation geladen:', pluginNav)
    }
  } catch (error) {
    console.error('Fehler beim Laden der Plugin-Navigation:', error)
  }
}

// Aktive Plugin-Komponenten laden
async function loadActivePluginComponents() {
  try {
    const response = await fetch('/admin/plugin-assets')
    const assets = await response.json()
    
    // Nur Komponenten von installierten UND aktivierten Plugins laden
    const components = []
    for (const [componentName, componentConfig] of Object.entries(assets.frontendComponents)) {
      // Prüfen ob Plugin installiert UND aktiviert ist UND als Overlay angezeigt werden soll
      if (componentConfig.plugin && 
          await isPluginActive(componentConfig.plugin) && 
          componentConfig.overlay) {
        components.push({
          name: componentName,
          props: componentConfig.props || {},
          plugin: componentConfig.plugin
        })
      }
    }
    
    activePluginComponents.value = components
    console.log('✅ Aktive Plugin-Overlay-Komponenten geladen:', components.length)
  } catch (error) {
    console.error('❌ Fehler beim Laden der Plugin-Komponenten:', error)
  }
}

// Prüfen ob Plugin installiert UND aktiviert ist
async function isPluginActive(pluginName) {
  try {
    const response = await fetch(`/admin/plugin-status/${pluginName}`)
    const status = await response.json()
    return status.installed && status.active
  } catch (error) {
    console.error(`❌ Fehler beim Prüfen des Plugin-Status für ${pluginName}:`, error)
    return false
  }
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
