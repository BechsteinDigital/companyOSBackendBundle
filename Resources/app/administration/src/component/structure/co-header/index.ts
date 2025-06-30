import { defineComponent, h, ref, computed } from 'vue'
import './co-header.scss'
import template from './co-header.hba'

export default defineComponent({
  name: 'CoHeader',
  setup() {
    const user = ref({
      name: 'Admin User',
      email: 'admin@companyos.com',
      avatar: '👤'
    })

    const notifications = ref([
      { id: 1, message: 'Neues Plugin verfügbar', type: 'info' },
      { id: 2, message: 'System-Update abgeschlossen', type: 'success' }
    ])

    // Template data für Handlebars
    const templateData = computed(() => ({
      user: user.value,
      notifications: notifications.value
    }))

    // Handlebars-Template rendern
    const renderTemplate = () => {
      return template(templateData.value)
    }

    return () => h('div', {
      class: 'co-header-wrapper',
      innerHTML: renderTemplate()
    })
  }
}) 