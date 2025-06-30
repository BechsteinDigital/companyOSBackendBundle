import { defineComponent, h, ref } from 'vue'
import CoPage from '../../../component/structure/co-page'
import CoCard from '../../../component/base/co-card'
import CoButton from '../../../component/base/co-button'
import CoModal from '../../../component/base/co-modal'
import './co-plugins-list.scss'

export default defineComponent({
  name: 'CoPluginsList',
  setup() {
    const plugins = ref([
      { id: 1, name: 'Analytics Pro', version: '1.2.0', status: 'Aktiv', description: 'Erweiterte Analytics-Funktionen' },
      { id: 2, name: 'Backup Manager', version: '2.1.0', status: 'Aktiv', description: 'Automatische Backup-Verwaltung' },
      { id: 3, name: 'Email Marketing', version: '1.0.5', status: 'Inaktiv', description: 'E-Mail-Marketing-Tools' }
    ])

    const showUploadModal = ref(false)

    return () => h(CoPage, {
      title: 'Plugins',
      subtitle: 'Verwalten Sie Ihre System-Plugins'
    }, {
      default: () => [
        h(CoCard, {
          title: 'Installierte Plugins',
          subtitle: `${plugins.value.length} Plugins gefunden`
        }, {
          default: () => [
            // Plugin Grid
            h('div', { class: 'plugins-grid' }, 
              plugins.value.map(plugin => 
                h('div', { key: plugin.id, class: 'plugin-card' }, [
                  h('div', { class: 'plugin-card__header' }, [
                    h('h3', { class: 'plugin-card__title' }, plugin.name),
                    h('span', { class: 'plugin-card__version' }, `v${plugin.version}`)
                  ]),
                  h('p', { class: 'plugin-card__description' }, plugin.description),
                  h('div', { class: 'plugin-card__footer' }, [
                    h('span', { 
                      class: `plugin-status plugin-status--${plugin.status === 'Aktiv' ? 'active' : 'inactive'}`
                    }, plugin.status),
                    h('div', { class: 'plugin-card__actions' }, [
                      h(CoButton, { 
                        variant: plugin.status === 'Aktiv' ? 'warning' : 'success', 
                        size: 'sm' 
                      }, { default: () => plugin.status === 'Aktiv' ? 'Deaktivieren' : 'Aktivieren' }),
                      h(CoButton, { 
                        variant: 'danger', 
                        size: 'sm' 
                      }, { default: () => 'Entfernen' })
                    ])
                  ])
                ])
              )
            )
          ],
          footer: () => [
            h(CoButton, { 
              variant: 'primary',
              onClick: () => showUploadModal.value = true
            }, { default: () => 'Plugin hochladen' })
          ]
        }),
        // Upload Modal
        h(CoModal, {
          modelValue: showUploadModal.value,
          title: 'Plugin hochladen',
          size: 'lg'
        }, {
          default: () => [
            h('div', { class: 'upload-area' }, [
              h('p', { class: 'text-center' }, 'Ziehen Sie eine Plugin-Datei hierher oder klicken Sie zum Auswählen'),
              h('input', { 
                type: 'file', 
                accept: '.zip,.tar.gz',
                class: 'upload-input'
              })
            ])
          ],
          footer: () => [
            h(CoButton, { variant: 'secondary' }, { default: () => 'Abbrechen' }),
            h(CoButton, { variant: 'primary' }, { default: () => 'Hochladen' })
          ]
        })
      ]
    })
  }
}) 