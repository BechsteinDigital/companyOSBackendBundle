import { defineComponent, h, ref, onMounted } from 'vue'
import CoPage from '../../../component/structure/co-page'
import CoCard from '../../../component/base/co-card'
import './co-dashboard-index.scss'

export default defineComponent({
  name: 'CoDashboardIndex',
  setup() {
    const stats = ref({
      totalUsers: 1250,
      activePlugins: 15,
      systemUptime: '99.9%',
      storageUsed: '2.5 GB'
    })

    const recentActivity = ref([
      { id: 1, type: 'user', message: 'Neuer Benutzer registriert', time: 'vor 5 Minuten' },
      { id: 2, type: 'plugin', message: 'Plugin "Analytics Pro" installiert', time: 'vor 15 Minuten' },
      { id: 3, type: 'system', message: 'System-Update abgeschlossen', time: 'vor 1 Stunde' },
      { id: 4, type: 'user', message: 'Benutzer-Einstellungen geändert', time: 'vor 2 Stunden' }
    ])

    onMounted(() => {
      console.log('Dashboard page mounted')
    })

    return () => h(CoPage, {
      title: 'Dashboard',
      subtitle: 'Übersicht über Ihr CompanyOS System'
    }, {
      default: () => [
        // Stats Cards
        h('div', { class: 'row mb-4' }, [
          h('div', { class: 'col-3' }, [
            h(CoCard, {
              title: 'Benutzer',
              subtitle: 'Gesamt'
            }, {
              default: () => h('div', { class: 'dashboard-stat' }, [
                h('span', { class: 'dashboard-stat__number' }, stats.value.totalUsers),
                h('span', { class: 'dashboard-stat__icon' }, '👥')
              ])
            })
          ]),
          h('div', { class: 'col-3' }, [
            h(CoCard, {
              title: 'Plugins',
              subtitle: 'Aktiv'
            }, {
              default: () => h('div', { class: 'dashboard-stat' }, [
                h('span', { class: 'dashboard-stat__number' }, stats.value.activePlugins),
                h('span', { class: 'dashboard-stat__icon' }, '🔌')
              ])
            })
          ]),
          h('div', { class: 'col-3' }, [
            h(CoCard, {
              title: 'Uptime',
              subtitle: 'System'
            }, {
              default: () => h('div', { class: 'dashboard-stat' }, [
                h('span', { class: 'dashboard-stat__number' }, stats.value.systemUptime),
                h('span', { class: 'dashboard-stat__icon' }, '🟢')
              ])
            })
          ]),
          h('div', { class: 'col-3' }, [
            h(CoCard, {
              title: 'Speicher',
              subtitle: 'Verwendet'
            }, {
              default: () => h('div', { class: 'dashboard-stat' }, [
                h('span', { class: 'dashboard-stat__number' }, stats.value.storageUsed),
                h('span', { class: 'dashboard-stat__icon' }, '💾')
              ])
            })
          ])
        ]),
        // Content Row
        h('div', { class: 'row' }, [
          // Chart
          h('div', { class: 'col-8' }, [
            h(CoCard, {
              title: 'System-Aktivität',
              subtitle: 'Letzte 7 Tage'
            }, {
              default: () => h('div', { class: 'dashboard-chart-placeholder' }, [
                h('p', { class: 'text-center text-muted' }, '📊 Chart wird hier angezeigt')
              ])
            })
          ]),
          // Recent Activity
          h('div', { class: 'col-4' }, [
            h(CoCard, {
              title: 'Letzte Aktivitäten',
              subtitle: 'System-Events'
            }, {
              default: () => h('div', { class: 'dashboard-activity' }, 
                recentActivity.value.map(activity => 
                  h('div', { 
                    key: activity.id,
                    class: 'dashboard-activity__item'
                  }, [
                    h('div', { class: 'dashboard-activity__content' }, [
                      h('span', { class: 'dashboard-activity__message' }, activity.message),
                      h('span', { class: 'dashboard-activity__time' }, activity.time)
                    ]),
                    h('span', { class: 'dashboard-activity__icon' }, 
                      activity.type === 'user' ? '👤' : 
                      activity.type === 'plugin' ? '🔌' : '⚙️'
                    )
                  ])
                )
              )
            })
          ])
        ])
      ]
    })
  }
}) 