import { defineComponent, h, onMounted, ref, resolveComponent, computed, inject } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue'
import { allNavigationItems } from '../_nav.js'
import { useAuthStore } from '../stores/auth'

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
    const firstRender = ref(true)
    const icons = inject('icons', {})
    const pluginNavigation = ref([])

    onMounted(() => {
      firstRender.value = false
      loadPluginNavigation()
    })

    // Plugin-Navigation laden
    const loadPluginNavigation = () => {
        // Plugin-Navigation zurücksetzen
        pluginNavigation.value = []
        // Plugin-Navigation aus globalen Plugin-Objekten sammeln
        Object.keys(window).forEach(key => {
            if (key.startsWith('plugin_') && typeof window[key] === 'object' && window[key].navigation) {
                pluginNavigation.value = [...pluginNavigation.value, ...window[key].navigation]
            }
        })
    }

    // Rollenbasierte Navigation berechnen (Core + Plugins)
    const navigation = computed(() => {
      console.log('Navigation berechnen - User:', auth.user)
      console.log('Navigation berechnen - User-Rollen:', auth.user?.roles)
      
      if (!auth.user) {
        console.log('Kein User - zeige nur Dashboard')
        // Fallback: Nur Dashboard anzeigen
        return allNavigationItems.filter(item => item.permission === 'dashboard')
      }
      
      // Core-Navigation basierend auf Berechtigungen filtern
      const filteredCoreNav = allNavigationItems.filter(item => {
        if (!item.permission) return true
        const canAccess = auth.canAccess(item.permission)
        console.log(`Core Item ${item.name} (${item.permission}): ${canAccess}`)
        return canAccess
      })
      
      // Plugin-Navigation basierend auf Berechtigungen filtern
      const filteredPluginNav = pluginNavigation.value.filter(item => {
        if (!item.permission) return true
        const canAccess = auth.canAccess(item.permission)
        console.log(`Plugin Item ${item.name} (${item.permission}): ${canAccess}`)
        return canAccess
      })
      
      // Core- und Plugin-Navigation kombinieren
      const combinedNav = [...filteredCoreNav, ...filteredPluginNav]
      
      console.log('Gefilterte Navigation:', combinedNav)
      return combinedNav
    })

    const renderItem = (item) => {
      if (item.items) {
        return h(
          CNavGroup,
          {
            as: 'div',
            compact: true,
            ...(firstRender.value && {
              visible: item.items.some((child) => isActiveItem(route, child)),
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
            ],
            default: () => item.items.map((child) => renderItem(child)),
          },
        )
      }

      if (item.href) {
        return h(
          resolveComponent(item.component),
          {
            href: item.href,
            target: '_blank',
            rel: 'noopener noreferrer',
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
              item.badge &&
                h(
                  CBadge,
                  {
                    class: 'ms-auto',
                    color: item.badge.color,
                    size: 'sm',
                  },
                  {
                    default: () => item.badge.text,
                  },
                ),
            ],
          },
        )
      }

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
                    as: 'div',
                    href: props.href,
                    onClick: () => props.navigate(),
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
                      item.badge &&
                        h(
                          CBadge,
                          {
                            class: 'ms-auto',
                            color: item.badge.color,
                            size: 'sm',
                          },
                          {
                            default: () => item.badge.text,
                          },
                        ),
                    ],
                  },
                ),
            },
          )
        : h(
            resolveComponent(item.component),
            {
              as: 'div',
            },
            {
              default: () => item.name,
            },
          )
    }

    return () =>
      h(
        CSidebarNav,
        {
          as: simplebar,
        },
        {
          default: () => navigation.value.map((item) => renderItem(item)),
        },
      )
  },
})

export { AppSidebarNav } 