import { defineComponent, h, ref } from 'vue'
import CoPage from '../../../component/structure/co-page'
import CoCard from '../../../component/base/co-card'
import CoButton from '../../../component/base/co-button'
import './co-settings-index.scss'

export default defineComponent({
  name: 'CoSettingsIndex',
  setup() {
    const activeTab = ref('general')
    const settings = ref({
      siteName: 'CompanyOS',
      siteUrl: 'https://companyos.com',
      email: 'admin@companyos.com',
      timezone: 'Europe/Berlin',
      language: 'de'
    })

    const tabs = [
      { id: 'general', label: 'Allgemein', icon: '⚙️' },
      { id: 'email', label: 'E-Mail', icon: '📧' },
      { id: 'security', label: 'Sicherheit', icon: '🔒' },
      { id: 'backup', label: 'Backup', icon: '💾' }
    ]

    return () => h(CoPage, {
      title: 'Einstellungen',
      subtitle: 'System-Konfiguration verwalten'
    }, {
      default: () => [
        h('div', { class: 'row' }, [
          // Tabs
          h('div', { class: 'col-3' }, [
            h(CoCard, {
              title: 'Kategorien'
            }, {
              default: () => h('div', { class: 'settings-tabs' }, 
                tabs.map(tab => 
                  h('button', {
                    key: tab.id,
                    class: `settings-tab ${activeTab.value === tab.id ? 'settings-tab--active' : ''}`,
                    onClick: () => activeTab.value = tab.id
                  }, [
                    h('span', { class: 'settings-tab__icon' }, tab.icon),
                    h('span', { class: 'settings-tab__label' }, tab.label)
                  ])
                )
              )
            })
          ]),
          // Content
          h('div', { class: 'col-9' }, [
            h(CoCard, {
              title: tabs.find(t => t.id === activeTab.value)?.label || 'Einstellungen'
            }, {
              default: () => {
                if (activeTab.value === 'general') {
                  return h('div', { class: 'settings-form' }, [
                    h('div', { class: 'form-group' }, [
                      h('label', { class: 'form-label' }, 'Website-Name'),
                      h('input', {
                        type: 'text',
                        class: 'form-input',
                        value: settings.value.siteName
                      })
                    ]),
                    h('div', { class: 'form-group' }, [
                      h('label', { class: 'form-label' }, 'Website-URL'),
                      h('input', {
                        type: 'url',
                        class: 'form-input',
                        value: settings.value.siteUrl
                      })
                    ]),
                    h('div', { class: 'form-group' }, [
                      h('label', { class: 'form-label' }, 'Admin-E-Mail'),
                      h('input', {
                        type: 'email',
                        class: 'form-input',
                        value: settings.value.email
                      })
                    ]),
                    h('div', { class: 'form-group' }, [
                      h('label', { class: 'form-label' }, 'Zeitzone'),
                      h('select', { class: 'form-select' }, [
                        h('option', { value: 'Europe/Berlin' }, 'Europe/Berlin'),
                        h('option', { value: 'UTC' }, 'UTC'),
                        h('option', { value: 'America/New_York' }, 'America/New_York')
                      ])
                    ])
                  ])
                }
                return h('p', { class: 'text-center text-muted' }, 'Einstellungen für diesen Bereich werden hier angezeigt')
              },
              footer: () => [
                h(CoButton, { variant: 'secondary' }, { default: () => 'Zurücksetzen' }),
                h(CoButton, { variant: 'primary' }, { default: () => 'Speichern' })
              ]
            })
          ])
        ])
      ]
    })
  }
}) 