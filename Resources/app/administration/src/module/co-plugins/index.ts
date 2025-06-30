import type { CompanyOSModule } from '../../core/companyos'

const PluginsModule: CompanyOSModule = {
  name: 'co-plugins',
  routes: [
    {
      path: '/plugins',
      name: 'plugins',
      component: () => import('./page/co-plugins-list.ts')
    }
  ],
  components: {
    'co-plugins-grid': () => import('./component/co-plugins-grid/index'),
    'co-plugin-card': () => import('./component/co-plugin-card/index')
  },
  services: {
    'pluginService': () => import('./service/plugin-service')
  },
  init() {
    console.log('Plugins module initialized')
  }
}

export default PluginsModule 