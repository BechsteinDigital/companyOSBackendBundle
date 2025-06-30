import type { CompanyOSModule } from '../../core/companyos'

const SettingsModule: CompanyOSModule = {
  name: 'co-settings',
  routes: [
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./page/co-settings-index')
    }
  ],
  components: {
    'co-settings-form': () => import('./component/co-settings-form'),
    'co-settings-tabs': () => import('./component/co-settings-tabs')
  },
  services: {
    'settingsService': () => import('./service/settings-service')
  },
  init() {
    console.log('Settings module initialized')
  }
}

export default SettingsModule 