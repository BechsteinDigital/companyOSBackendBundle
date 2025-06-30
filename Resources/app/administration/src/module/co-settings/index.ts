import type { CompanyOSModule } from '../../core/companyos'

const SettingsModule: CompanyOSModule = {
  name: 'co-settings',
  routes: [
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./page/co-settings-index.ts')
    }
  ],
  components: {},
  services: {},
  init() {
    console.log('Settings module initialized')
  }
}

export default SettingsModule 