import type { CompanyOSModule } from '../../core/companyos'

const PluginsModule: CompanyOSModule = {
  name: 'co-plugins',
  routes: [
    {
      path: '/plugins',
      name: 'plugins',
      component: () => import('./page/co-plugins-list')
    }
  ],
  components: {
    'co-plugins-grid': () => import('./component/co-plugins-grid'),
    'co-plugin-card': () => import('./component/co-plugin-card')
  },
  services: {
    'pluginService': () => import('./service/plugin-service')
  },
  init() {
    console.log('Plugins module initialized')
  }
}

export default PluginsModule 