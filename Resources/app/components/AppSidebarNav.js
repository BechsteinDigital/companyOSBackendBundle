import { defineComponent, h, onMounted, ref, resolveComponent, computed, inject } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue'
import { useAuthStore } from '../stores/auth'
import { useNavigationStore } from '../stores/navigation'

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

    onMounted(() => {
      firstRender.value = false
      console.log('🔍 AppSidebarNav mounted, available icons:', Object.keys(icons))
    })

    /**
     * Permission-basierte Navigation berechnen
     */
    const navigation = computed(() => {
      console.log('🔐 Computing navigation with RBAC/ABAC/ACL...')
      console.log('Current user:', auth.user)
      console.log('User permissions:', auth.user?.permissions)
      console.log('User roles:', auth.user?.roles)
      
      if (!auth.user) {
        console.log('❌ No authenticated user - showing public navigation only')
        return []
      }
      
      // Verwende den Navigation Store für erweiterte Permission-Checks
      const availableNavigation = navigationStore.availableNavigation
      
      console.log('✅ Filtered navigation items:', availableNavigation)
      
      return availableNavigation
    })

    /**
     * Einfache Navigation-Item-Rendering
     */
    const renderItem = (item) => {
      // Permission-Check vor Rendering
      if (!navigationStore.checkNavigationPermission(item, auth)) {
        console.log(`🚫 Skipping navigation item due to permissions: ${item.name}`)
        return null
      }

      console.log(`🎨 Rendering navigation item: ${item.name}, icon: ${item.icon}`)

      // Navigation-Title rendern
      if (item.component === 'CNavTitle') {
        return h(
          CNavTitle,
          { key: item.name },
          {
            default: () => item.name
          }
        )
      }

      // Standard Router-Link rendern
      if (item.to) {
        return h(
          RouterLink,
          {
            key: item.name,
            to: item.to,
            custom: true,
          },
          {
            default: (props) => {
              console.log(`🔗 Creating RouterLink for ${item.name} to ${item.to}`)
              
              return h(
                CNavItem,
                {
                  active: props.isActive,
                  href: props.href,
                  onClick: (event) => {
                    console.log(`🖱️ Clicked navigation item: ${item.name}`)
                    event.preventDefault()
                    props.navigate()
                  }
                },
                {
                  default: () => [
                    // Icon rendern
                    item.icon && icons[item.icon]
                      ? h(resolveComponent('CIcon'), {
                          customClassName: 'nav-icon',
                          content: icons[item.icon],
                        })
                      : h('span', { class: 'nav-icon' }, [
                          h('span', { class: 'nav-icon-bullet' })
                        ]),
                    // Name
                    item.name,
                    // Badge rendern
                    item.badge && h(
                      CBadge,
                      {
                        class: 'ms-auto',
                        color: item.badge.color,
                        size: 'sm',
                      },
                      { default: () => item.badge.text }
                    )
                  ],
                }
              )
            }
          }
        )
      }

      // Fallback für andere Item-Typen
      return h(
        CNavItem,
        { key: item.name },
        {
          default: () => item.name
        }
      )
    }

    return {
      navigation,
      renderItem,
      auth,
      navigationStore,
      icons
    }
  },
  
  render() {
    console.log('🎨 Rendering AppSidebarNav, navigation items:', this.navigation.length)
    console.log('🎨 Available icons:', Object.keys(this.icons).slice(0, 5), '...')
    
    return h(
      CSidebarNav,
      {
        as: simplebar,
      },
      {
        default: () => [
          // Debug-Info
          h('div', { class: 'p-2 text-muted small' }, [
            `Navigation: ${this.navigation.length} items`
          ]),
          
          // Navigation-Items rendern
          ...this.navigation.map((item) => this.renderItem(item)).filter(Boolean)
        ],
      },
    )
  }
})

export { AppSidebarNav } 