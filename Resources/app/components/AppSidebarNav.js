import { defineComponent, h, onMounted, ref, resolveComponent, computed, inject, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue'
import { useAuthStore } from '../stores/auth'
import { useNavigationStore, navigationHelper } from '../stores/navigation'

import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

const isActiveLink = (route, link) => {
  if (link === undefined) {
    return false
  }

  if (route.hash === link) {
    return true
  }

  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)

  return currentPath === targetPath
}

const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) {
    return true
  }

  if (item.items) {
    return item.items.some((child) => isActiveItem(route, child))
  }

  return false
}

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  setup() {
    const route = useRoute()
    const auth = useAuthStore()
    const navigationStore = useNavigationStore()
    const firstRender = ref(true)
    const icons = inject('icons', {})

    onMounted(async () => {
      firstRender.value = false
      
      // Kontext für ABAC initialisieren
      await initializeNavigationContext()
      
      // Plugin-Navigation laden
      loadPluginNavigation()
      
      // Navigation-Permissions synchronisieren
      await navigationStore.syncNavigationPermissions()
    })

    // Watch für User-Änderungen (re-compute navigation)
    watch(() => auth.user, (newUser) => {
      if (newUser) {
        console.log('User changed, recomputing navigation permissions')
        navigationStore.syncNavigationPermissions()
      }
    })

    /**
     * Kontext für ABAC-Checks initialisieren
     */
    const initializeNavigationContext = async () => {
      try {
        // IP-Adresse ermitteln (vereinfacht)
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipResponse.json()
        
        // Browser-Zeitzone ermitteln
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        
        // Kontext aktualisieren
        navigationStore.updateContext({
          ipAddress: ipData.ip,
          timezone: timezone,
          userAgent: navigator.userAgent,
          location: auth.user?.location || null,
          department: auth.user?.department || null,
          timestamp: new Date().toISOString()
        })
        
        console.log('Navigation context initialized:', navigationStore.currentContext)
      } catch (error) {
        console.warn('Failed to initialize navigation context:', error)
      }
    }

    /**
     * Plugin-Navigation laden
     */
    const loadPluginNavigation = () => {
      // Plugin-Navigation zurücksetzen
      navigationStore.pluginNavigation = []
      
      // Plugin-Navigation aus globalen Plugin-Objekten sammeln
      Object.keys(window).forEach(key => {
        if (key.startsWith('plugin_') && typeof window[key] === 'object' && window[key].navigation) {
          const pluginNavigation = window[key].navigation.map(item => ({
            ...item,
            plugin: key.replace('plugin_', ''), // Plugin-Name für Tracking
          }))
          
          navigationStore.addPluginNavigation(pluginNavigation)
          console.log(`Loaded navigation for plugin: ${key}`, pluginNavigation)
        }
      })
    }

    /**
     * Permission-basierte Navigation berechnen
     */
    const navigation = computed(() => {
      console.log('🔐 Computing navigation with RBAC/ABAC/ACL...')
      console.log('Current user:', auth.user)
      console.log('User permissions:', auth.user?.permissions)
      console.log('User roles:', auth.user?.roles)
      console.log('Navigation context:', navigationStore.currentContext)
      
      if (!auth.user) {
        console.log('❌ No authenticated user - showing public navigation only')
        return []
      }
      
      // Verwende den Navigation Store für erweiterte Permission-Checks
      const availableNavigation = navigationStore.availableNavigation
      
      console.log('✅ Filtered navigation items:', availableNavigation)
      
      // Audit-Logging für jeden Navigation-Zugriff
      availableNavigation.forEach(item => {
        navigationStore.logNavigationAccess(item, true)
      })
      
      return availableNavigation
    })

    /**
     * Erweiterte Navigation-Item-Rendering mit Permission-Awareness
     */
    const renderItem = (item) => {
      // Permission-Check vor Rendering (zusätzliche Sicherheit)
      if (!navigationStore.checkNavigationPermission(item, auth)) {
        console.log(`🚫 Skipping navigation item due to permissions: ${item.name}`)
        return null
      }

      // Gruppe/Untermenü rendern
      if (item.items && item.items.length > 0) {
        // Filter auch Unter-Items basierend auf Permissions
        const filteredSubItems = item.items.filter(subItem => 
          navigationStore.checkNavigationPermission(subItem, auth)
        )
        
        // Wenn keine Unter-Items verfügbar sind, die Gruppe nicht anzeigen
        if (filteredSubItems.length === 0) {
          return null
        }

        return h(
          CNavGroup,
          {
            as: 'div',
            compact: true,
            ...(firstRender.value && {
              visible: filteredSubItems.some((child) => isActiveItem(route, child)),
            }),
          },
          {
            togglerContent: () => [
              item.icon && icons[item.icon]
                ? h(resolveComponent('CIcon'), {
                    customClassName: 'nav-icon',
                    content: icons[item.icon],
                  })
                : h('span', { class: 'nav-icon' }, h('span', { class: 'nav-icon-bullet' })),
              item.name,
              // Sicherheits-Badge für kritische Bereiche
              item.security === 'high' && h(
                CBadge,
                {
                  class: 'ms-auto',
                  color: 'danger',
                  size: 'sm',
                },
                { default: () => '🔒' }
              ),
            ],
            default: () => filteredSubItems.map((child) => renderItem(child)),
          },
        )
      }

      // Externes Link rendern
      if (item.href) {
        return h(
          resolveComponent(item.component),
          {
            href: item.href,
            target: '_blank',
            rel: 'noopener noreferrer',
            onClick: () => navigationStore.logNavigationAccess(item, true)
          },
          {
            default: () => [
              item.icon && icons[item.icon]
                ? h(resolveComponent('CIcon'), {
                    customClassName: 'nav-icon',
                    content: icons[item.icon],
                  })
                : h('span', { class: 'nav-icon' }, h('span', { class: 'nav-icon-bullet' })),
              item.name,
              renderItemBadges(item),
            ],
          },
        )
      }

      // Navigation-Title rendern
      if (item.component === 'CNavTitle') {
        return h(
          CNavTitle,
          {},
          {
            default: () => [
              item.name,
              // Permission-Badge für Admins (Debug-Info)
              auth.user?.roles?.includes('ROLE_ADMIN') && h(
                CBadge,
                {
                  class: 'ms-auto',
                  color: 'info',
                  size: 'sm',
                  title: JSON.stringify(item.permission)
                },
                { default: () => '🛡️' }
              ),
            ]
          }
        )
      }

      // Standard Router-Link rendern
      return item.to
        ? h(
            RouterLink,
            {
              to: item.to,
              custom: true,
            },
            {
              default: (props) =>
                h(
                  resolveComponent(item.component),
                  {
                    active: props.isActive,
                    as: 'RouterLink',
                    to: item.to,
                    onClick: () => {
                      navigationStore.logNavigationAccess(item, true)
                      
                      // Zusätzliche Kontext-Updates bei Navigation
                      navigationStore.updateContext({
                        lastAccessed: item.name,
                        lastAccessedAt: new Date().toISOString()
                      })
                    }
                  },
                  {
                    default: () => [
                      item.icon && icons[item.icon]
                        ? h(resolveComponent('CIcon'), {
                            customClassName: 'nav-icon',
                            content: icons[item.icon],
                          })
                        : h('span', { class: 'nav-icon' }, h('span', { class: 'nav-icon-bullet' })),
                      item.name,
                      renderItemBadges(item),
                    ],
                  },
                ),
            },
          )
        : h(
            resolveComponent(item.component),
            {},
            {
              default: () => item.name,
            },
          )
    }

    /**
     * Badges für Navigation-Items rendern (Sicherheit, Einschränkungen, etc.)
     */
    const renderItemBadges = (item) => {
      const badges = []

      // Standard Badge
      if (item.badge) {
        badges.push(h(
          CBadge,
          {
            class: 'ms-auto',
            color: item.badge.color,
            size: 'sm',
          },
          { default: () => item.badge.text }
        ))
      }

      // Zeit-Einschränkungen Badge
      if (item.timeRestrictions) {
        badges.push(h(
          CBadge,
          {
            class: 'ms-auto',
            color: 'warning',
            size: 'sm',
            title: 'Zeitlich eingeschränkt'
          },
          { default: () => '⏰' }
        ))
      }

      // IP-Einschränkungen Badge
      if (item.ipRestrictions) {
        badges.push(h(
          CBadge,
          {
            class: 'ms-auto',
            color: 'info',
            size: 'sm',
            title: 'IP-Einschränkung aktiv'
          },
          { default: () => '🌐' }
        ))
      }

      // Abteilungs-Einschränkungen Badge
      if (item.departmentRestrictions) {
        badges.push(h(
          CBadge,
          {
            class: 'ms-auto',
            color: 'secondary',
            size: 'sm',
            title: 'Abteilungsabhängig'
          },
          { default: () => '🏢' }
        ))
      }

      // Plugin Badge
      if (item.plugin) {
        badges.push(h(
          CBadge,
          {
            class: 'ms-auto',
            color: 'success',
            size: 'sm',
            title: `Plugin: ${item.plugin}`
          },
          { default: () => '🔌' }
        ))
      }

      return badges
    }

    /**
     * Permission-Debug-Info (nur für Admins)
     */
    const showPermissionDebug = computed(() => {
      return auth.user?.roles?.includes('ROLE_ADMIN') && 
             navigationStore.currentContext.debug === true
    })

    return {
      navigation,
      renderItem,
      showPermissionDebug,
      
      // Für Template-Debugging
      auth,
      navigationStore,
      availableActions: computed(() => navigationHelper.getAvailableActions(auth))
    }
  },
  
  render() {
    return h(
      CSidebarNav,
      {
        as: simplebar,
      },
      {
        default: () => [
          // Debug-Info für Admins
          this.showPermissionDebug && h(
            'div',
            { class: 'p-2 border-bottom' },
            [
              h('small', { class: 'text-muted' }, `User: ${this.auth.user?.email}`),
              h('br'),
              h('small', { class: 'text-muted' }, `Permissions: ${this.auth.user?.permissions?.length || 0}`),
              h('br'),
              h('small', { class: 'text-muted' }, `Context: ${Object.keys(this.navigationStore.currentContext).length} attrs`)
            ]
          ),
          
          // Navigation-Items
          ...this.navigation.map((item) => this.renderItem(item)).filter(Boolean),
          
          // Verfügbare Aktionen (Debug)
          this.showPermissionDebug && this.availableActions.length > 0 && h(
            'div',
            { class: 'p-2 border-top' },
            [
              h('small', { class: 'text-muted' }, 'Available Actions:'),
              h('br'),
              ...this.availableActions.map(action => 
                h('small', { class: 'badge bg-info me-1' }, action)
              )
            ]
          )
        ],
      },
    )
  }
})

export default AppSidebarNav 