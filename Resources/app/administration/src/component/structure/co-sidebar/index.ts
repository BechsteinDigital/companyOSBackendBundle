import { defineComponent, h, ref, computed } from 'vue'
import template from './co-sidebar.hba'

export default defineComponent({
  name: 'CoSidebar',
  setup() {
    const isCollapsed = ref(false)
    const activeRoute = ref('/dashboard')

    const menuItems = ref([
      {
        icon: '📊',
        label: 'Dashboard',
        route: '/dashboard'
      },
      {
        icon: '👥',
        label: 'Benutzer',
        route: '/users'
      },
      {
        icon: '🔌',
        label: 'Plugins',
        route: '/plugins'
      },
      {
        icon: '⚙️',
        label: 'Einstellungen',
        route: '/settings'
      }
    ])

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
    }

    // Template data für Handlebars
    const templateData = computed(() => ({
      collapsed: isCollapsed.value,
      menuItems: menuItems.value.map(item => ({
        ...item,
        active: activeRoute.value === item.route
      }))
    }))

    // Handlebars-Template rendern
    const renderTemplate = () => {
      return template(templateData.value)
    }

    return () => h('div', {
      class: 'co-sidebar-wrapper',
      innerHTML: renderTemplate()
    })
  }
}) 